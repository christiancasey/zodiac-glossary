const waitQuery = require('./waitQuery');

const saveLemma = async (pool, lemma, username = '') => {
  console.log('saveLemma.js, User: ', username, ' Lemma ID: ', lemma.lemmaId);

  // LEMMA – basic info
  try {
    const sqlLemma = `
      UPDATE lemmata
        SET
          published = $2, 
          original = $3, 
          translation = $4, 
          transliteration = $5, 
          partofspeech_id = (SELECT partofspeech_id FROM partsofspeech WHERE value = $6), 
          language_id = (SELECT language_id FROM languages WHERE value = $7),
          primary_meaning = $8,
          editor = $9,
          literal_translation2 = $10,
          comment = $11,
          checked = $12,
          last_edit = (to_timestamp($13 / 1000.0)),
          loan_language_id = (SELECT language_id FROM languages WHERE value = $14)
      WHERE lemma_id = $1;
      `;

      const values = [
        lemma.lemmaId, 
        lemma.published, 
        (lemma.original ? lemma.original.trim() : ''),
        (lemma.translation ? lemma.translation.trim() : ''),
        (lemma.transliteration ? lemma.transliteration.trim() : ''),
        lemma.partOfSpeech,
        lemma.language,
        (lemma.primary_meaning ? lemma.primary_meaning.trim() : ''),
        (lemma.editor ? lemma.editor.trim() : ''),
        (lemma.literal_translation2 ? lemma.literal_translation2.trim() : ''),
        (lemma.comment ? lemma.comment.trim() : ''),
        lemma.checked,
        Date.now(),
        lemma.loan_language,
      ];

    pool.query(sqlLemma, values, (error, results) => {
      if (error) throw error;
    });
  } catch (error) {
    console.log('Error updating lemma', error);
  }
  
  // MEANINGS
  try {
    const sqlMeaningsUpdate = `
      UPDATE meanings
        SET
          value = $2,
          category = $3,
          comment = $4
        WHERE lemma_id = $1 AND meaning_id = $5
      RETURNING *;
    `;
    const sqlMeaningsInsert = `
      INSERT INTO meanings (lemma_id, value, category, comment)
        VALUES ($1, $2, $3, $4)
      RETURNING meaning_id;
    `;

    for (meaning of lemma.meanings) {

      const values = [
        lemma.lemmaId,
        (meaning.value ? meaning.value.trim() : ''),
        (meaning.category ? meaning.category.trim().toLowerCase() : ''),
        (meaning.comment ? meaning.comment.trim() : ''),
        isNaN(parseInt(meaning.id)) ? 0 : parseInt(meaning.id),
      ];

      try {
        var meaningUpdateResults = await waitQuery(pool, sqlMeaningsUpdate, values);

        // If the meaning is not in the DB, add it
        // Reset the id of the lemma object with the new auto value from the DB
        if (!meaningUpdateResults.rows.length) {
          var results = await waitQuery(pool, sqlMeaningsInsert, values.slice(0,-1));
          
          // Need to update the meaning id in any quotations that used the old dummy uuid value
          // Prevents bug where adding a meaning to a quotation in a new lemma doesn't save the value
          // Because the new meaning is saved first and then ids no longer match when the quotation is saved
          // – CDC 2023-08-30
          const oldMeaningId = meaning.id;
          const newMeaningId = results.rows[0].meaning_id;
          for (quotation of lemma.quotations) {
            if (quotation.meaning_id === oldMeaningId) {
              quotation.meaning_id = newMeaningId;
            }
          }

          meaning.id = newMeaningId;
        }
      } catch (error) {
        console.error('Error saving meaning', error, 'lemma ID', lemma.lemmaId);
      }

      // Update all categories to the DB
      try {
        const sqlCategoriesUpdate = `
          UPDATE meaning_categories
            SET
              meaning_id = $1,
              category = $2
            WHERE category_id = $3
          RETURNING *;
        `;
        const sqlCategoriesInsert = `
          INSERT INTO meaning_categories (meaning_id, category)
            VALUES ($1, $2)
          RETURNING category_id;
        `;
        
        for (category of meaning.categories) {

          const values = [
            meaning.id,
            (category.category ? category.category.trim() : ''),
            isNaN(parseInt(category.category_id)) ? 0 : parseInt(category.category_id),
          ];

          var categoryUpdateResults = await waitQuery(pool, sqlCategoriesUpdate, values);

          if (!categoryUpdateResults.rows.length) {
            var results = await waitQuery(pool, sqlCategoriesInsert, values.slice(0,-1));
            category.category_id = results.rows[0].category_id;
          }
        }

        // Delete from DB any categories no longer in the object
        var categoryCleanUpResults = await waitQuery(pool, 'SELECT * FROM meaning_categories WHERE meaning_id = $1', [meaning.id]);
        let categoryIds = meaning.categories.map(category => category.category_id);
        for (category of categoryCleanUpResults.rows) {
          if (!categoryIds.includes(category.category_id)) {
            pool.query('DELETE FROM meaning_categories WHERE category_id = $1', [category.category_id], (error, results) => {
              if (error) throw error;
            });
          }
        }

      } catch (error) {
        console.error('Error saving category', error, 'category ID', meaning.category.category_id);
      }
    }

    // Clean up meanings in DB
    // Check what's in there and delete any rows that are not in the lemma object anymore
    // ... because they have been deleted by the user on the front end
    var meaningCleanUpResults = await waitQuery(pool, 'SELECT * FROM meanings WHERE lemma_id = $1', [lemma.lemmaId]);
    let meaningIds = lemma.meanings.map(meaning => meaning.id);
    for (meaning of meaningCleanUpResults.rows) {
      if (!meaningIds.includes(meaning.meaning_id)) {
        pool.query('DELETE FROM meanings WHERE meaning_id = $1', [meaning.meaning_id], (error, results) => {
          if (error) throw error;
        });

        // Delete all related categories too
        pool.query('DELETE FROM meaning_categories WHERE meaning_id = $1', [meaning.meaning_id], (error, results) => {
          if (error) throw error;
        });
      }
    }
  } catch (error) {
    console.log('Error updating meanings', error);
  }
  
  // VARIANTS
  try {
    const sqlVariantsUpdate = `
      UPDATE variants
        SET
          original = $2,
          transliteration = $3,
          comment = $4
        WHERE lemma_id = $1 AND variant_id = $5
      RETURNING *;
    `;
    const sqlVariantsInsert = `
      INSERT INTO variants (lemma_id, original, transliteration, comment)
        VALUES ($1, $2, $3, $4)
      RETURNING variant_id;
    `;

    for (variant of lemma.variants) {

      const values = [
        lemma.lemmaId,
        (variant.original ? variant.original.trim() : ''),
        (variant.transliteration ? variant.transliteration.trim() : ''),
        (variant.comment ? variant.comment.trim() : ''),
        isNaN(parseInt(variant.id)) ? 0 : parseInt(variant.id),
      ];

      try {
        var variantUpdateResults = await waitQuery(pool, sqlVariantsUpdate, values);

        // If the variant is not in the DB, add it
        // Reset the id of the lemma object with the new auto value from the DB
        if (!variantUpdateResults.rows.length) {
          var results = await waitQuery(pool, sqlVariantsInsert, values.slice(0,-1));
          variant.id = results.rows[0].variant_id;
        }
      } catch (error) {
        console.error('Error saving variant', error, 'lemma ID', lemma.lemmaId);
      }
    }

    // Clean up variants in DB
    // Check what's in there and delete any rows that are not in the lemma object anymore
    // ... because they have been deleted by the user on the front end
    var variantCleanUpResults = await waitQuery(pool, 'SELECT * FROM variants WHERE lemma_id = $1', [lemma.lemmaId]);
    let variantIds = lemma.variants.map(variant => variant.id);
    for (variant of variantCleanUpResults.rows) {
      if (!variantIds.includes(variant.variant_id)) {
        pool.query('DELETE FROM variants WHERE variant_id = $1', [variant.variant_id], (error, results) => {
          if (error) throw error;
        });
      }
    }
  } catch (error) {
    console.log('Error updating variants', error);
  }
  
  // QUOTATIONS
  try {
    const sqlQuotationsUpdate = `
      UPDATE quotations
        SET
          original = $2,
          transliteration = $3,
          translation = $4,
          source = $5,
          line = $6,
          genre = $7,
          provenance = $8,
          date = $9,
          publication = $10,
          page = $11,
          link = $12,
          meaning_id = $13,
          comment = $14
        WHERE lemma_id = $1 AND quotation_id = $15
      RETURNING *;
    `;
    const sqlQuotationsInsert = `
      INSERT INTO quotations (lemma_id, original, transliteration, translation, source, line, genre, provenance, date, publication, page, link, meaning_id, comment)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING quotation_id;
    `;

    for (quotation of lemma.quotations) {
      // Temporarily log the saving of meaning_id in Quotations because Thomas has noticed them not saving –CDC 2023-03-21
      // console.log('Checking for problems saving quotation-meaning, given meaning_id:', quotation.meaning_id);
      // console.log('Saved meaning_id value:', (isNaN(parseInt(quotation.meaning_id)) || !quotation.meaning_id) ? 0 : parseInt(quotation.meaning_id));

      const values = [
        lemma.lemmaId,
        (quotation.original ? quotation.original.trim() : ''),
        (quotation.transliteration ? quotation.transliteration.trim() : ''),
        (quotation.translation ? quotation.translation.trim() : ''),
        (quotation.source ? quotation.source.trim() : ''),
        (quotation.line ? quotation.line.trim() : ''),
        (quotation.genre ? quotation.genre.trim().toLowerCase() : ''),
        (quotation.provenance ? quotation.provenance.trim() : ''),
        (quotation.date ? quotation.date.trim() : ''),
        (quotation.publication ? quotation.publication.trim() : ''),
        (quotation.page ? quotation.page.trim() : ''),
        (quotation.link ? quotation.link.trim() : ''),
        (isNaN(parseInt(quotation.meaning_id)) || !quotation.meaning_id) ? 0 : parseInt(quotation.meaning_id),
        (quotation.comment ? quotation.comment.trim() : ''),
        isNaN(parseInt(quotation.id)) ? 0 : parseInt(quotation.id),
      ];

      var quotationUpdateResults = await waitQuery(pool, sqlQuotationsUpdate, values);

      // If the quotation is not in the DB, add it
      // Reset the id of the lemma object with the new auto value from the DB
      if (!quotationUpdateResults.rows.length) {
        var results = await waitQuery(pool, sqlQuotationsInsert, values.slice(0,-1));
        quotation.id = results.rows[0].quotation_id;
      }
    }

    // Clean up quotations in DB
    // Check what's in there and delete any rows that are not in the lemma object anymore
    // ... because they have been deleted by the user on the front end
    var quotationCleanUpResults = await waitQuery(pool, 'SELECT * FROM quotations WHERE lemma_id = $1', [lemma.lemmaId]);
    let quotationIds = lemma.quotations.map(quotation => quotation.id);
    for (quotation of quotationCleanUpResults.rows) {
      if (!quotationIds.includes(quotation.quotation_id)) {
        pool.query('DELETE FROM quotations WHERE quotation_id = $1', [quotation.quotation_id], (error, results) => {
          if (error) throw error;
        });
      }
    }
  } catch (error) {
    console.log('Error updating quotations', error);
  }

  // CROSS LINKS
  try {
    const sqlCrossLinksUpdate = `
      UPDATE cross_links
        SET
          link = $2
        WHERE lemma_id = $1 AND cross_link_id = $3
      RETURNING *;
    `;
    const sqlCrossLinksInsert = `
      INSERT INTO cross_links (lemma_id, link)
        VALUES ($1, $2)
      RETURNING cross_link_id;
    `;

    for (crossLink of lemma.crossLinks) {

      // Don't save the ones that link back to this same lemma
      // Cross Links are collected in both directions, to and from
      // Don't save the "to's"
      // These are marked by having the same lemmaId as the link
      // Because of the way they're queried
      if (crossLink.lemmaId === crossLink.link) {
        continue;
      }

      if (!crossLink.link || !crossLink.id) {
        continue;
      }

      // Prevent crash where user accientally deletes id in UI and triggers a foreign key error
      if (!crossLink.lemmaId) {
        console.log('Invalid lemmaId in crosslink error prevention');
        continue;
      }
      
      const values = [
        lemma.lemmaId,
        crossLink.link,
        isNaN(parseInt(crossLink.id)) ? 0 : parseInt(crossLink.id),
      ];

      try {
        var crossLinkUpdateResults = await waitQuery(pool, sqlCrossLinksUpdate, values);

        // If the crossLink is not in the DB, add it
        // Reset the id of the lemma object with the new auto value from the DB
        if (!crossLinkUpdateResults.rows.length) {
          var results = await waitQuery(pool, sqlCrossLinksInsert, values.slice(0,-1));
          crossLink.id = results.rows[0].cross_link_id;
        }
      } catch (error) {
        console.error('Error saving cross link', error, 'lemma ID', lemma.lemmaId);
      }
    }

    // Clean up crossLinks in DB
    // Check what's in there and delete any rows that are not in the lemma object anymore
    // ... because they have been deleted by the user on the front end
    // Make sure to select both incoming and outgoing links so deletion works for both
    const sqlCrossLinks = `
      SELECT * FROM cross_links WHERE lemma_id = $1
      UNION
      SELECT * FROM cross_links WHERE link = $1;`;
    var crossLinkCleanUpResults = await waitQuery(pool, sqlCrossLinks, [lemma.lemmaId]);
    let crossLinkIds = lemma.crossLinks.map(crossLink => crossLink.id);
    for (crossLink of crossLinkCleanUpResults.rows) {
      if (!crossLinkIds.includes(crossLink.cross_link_id)) {
        pool.query('DELETE FROM cross_links WHERE cross_link_id = $1', [crossLink.cross_link_id], (error, results) => {
          if (error) throw error;
        });
      }
    }
  } catch (error) {
    console.log('Error updating cross links', error);
  }

  // EXTERNAL LINKS
  try {
    const sqlExternalLinksUpdate = `
      UPDATE external_links
        SET
          url = $2,
          display = $3
        WHERE lemma_id = $1 AND external_link_id = $4
      RETURNING *;
    `;
    const sqlExternalLinksInsert = `
      INSERT INTO external_links (lemma_id, url, display)
        VALUES ($1, $2, $3)
      RETURNING external_link_id;
    `;

    for (externalLink of lemma.externalLinks) {
      
      const values = [
        lemma.lemmaId,
        (externalLink.url ? externalLink.url.trim() : ''),
        (externalLink.display ? externalLink.display.trim() : ''),
        isNaN(parseInt(externalLink.id)) ? 0 : parseInt(externalLink.id),
      ];

      var externalLinkUpdateResults = await waitQuery(pool, sqlExternalLinksUpdate, values);

      // If the externalLink is not in the DB, add it
      // Reset the id of the lemma object with the new auto value from the DB
      if (!externalLinkUpdateResults.rows.length) {
        var results = await waitQuery(pool, sqlExternalLinksInsert, values.slice(0,-1));
        externalLink.id = results.rows[0].external_link_id;
      }
    }

    // Clean up externalLinks in DB
    // Check what's in there and delete any rows that are not in the lemma object anymore
    // ... because they have been deleted by the user on the front end
    var externalLinkCleanUpResults = await waitQuery(pool, 'SELECT * FROM external_links WHERE lemma_id = $1', [lemma.lemmaId]);
    let externalLinkIds = lemma.externalLinks.map(externalLink => externalLink.id);
    for (externalLink of externalLinkCleanUpResults.rows) {
      if (!externalLinkIds.includes(externalLink.external_link_id)) {
        pool.query('DELETE FROM external_links WHERE external_link_id = $1', [externalLink.external_link_id], (error, results) => {
          if (error) throw error;
        });
      }
    }
  } catch (error) {
    console.log('Error updating external links', error);
  }

  // Add a record to the edit history to record this save operation and the user who initiated it
  try {
    const sqlEditHistoryInsert = `
      INSERT INTO edit_history (lemma_id, username, timestamp)
        VALUES ($1, $2, (to_timestamp($3 / 1000.0)))
      RETURNING lemma_id;
    `;
    
    const values = [
      lemma.lemmaId,
      username,
      Date.now(),
    ];

    pool.query(sqlEditHistoryInsert, values, (error, results) => {
      if (error) throw error;
    });

  } catch (error) {
    console.log('Error adding record in edit history', error);
  }

  return lemma;
};

module.exports = saveLemma;