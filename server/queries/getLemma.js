const waitQuery = require('./waitQuery');

const getLemma = async (pool, lemmaId) => {

  // Temporary patch to deal with React Router making lemmaId = null in URL
  // Needs a proper fix on client side –CDC 2022-11-29
  if (!lemmaId || lemmaId == "null") {
    // response.status(404);
    // return null;
    console.error(`Error: Null or invalid lemmaId: ${lemmaId}`);
    throw new Error('null lemmaId');
  }

  // Patch to deal with fake lemma id's for new cross links
  lemmaId = parseInt(lemmaId);

  // Query DB and create lemma object
  const sqlLemma = `
    SELECT lemma_id AS lemmaId, editor, published, original, translation, primary_meaning, transliteration, literal_translation2, comment, languages.value AS language, partsofspeech.value AS partofspeech, attention, checked
    FROM lemmata 
      JOIN languages USING (language_id) 
      JOIN partsofspeech USING (partofspeech_id)
    WHERE lemma_id = $1;
    `;

  var lemmaDB = await waitQuery(pool, sqlLemma, [lemmaId]);

  var lemma = lemmaDB.rows;
  if (!lemma.length) {
    console.error(`Error: No lemma found with lemmaId: ${lemmaId}`);
    throw new Error('lemma not found');
  }
  lemma = lemma[0];

  lemma.lemmaId = lemma.lemmaid;
  lemma.partOfSpeech = lemma.partofspeech;
  delete lemma.partofspeech;
  delete lemma.lemmaid;

  // Add MEANINGS to lemma object
  const sqlMeanings = `SELECT * FROM meanings WHERE lemma_id = $1 ORDER BY meaning_id;`;
  lemma.meanings = [];
  await waitQuery(pool, sqlMeanings, [lemmaId])
    .then(({ rows: meanings }) => {
      for (meaning of meanings) {
        meaning.id = meaning.meaning_id;
        delete meaning.meaning_id;
        delete meaning.lemma_id;
        lemma.meanings.push(meaning);
      }
    })
    .catch(error => console.error(`\nError in getLemma.js\nCouldn't fetch Meanings for lemmaId: ${lemmaId}\n${error}`));

  // Add VARIANTS to lemma object
  const sqlVariants = `SELECT * FROM variants WHERE lemma_id = $1 ORDER BY variant_id;`;
  lemma.variants = [];
  await waitQuery(pool, sqlVariants, [lemmaId])
    .then(({ rows: variants }) => {
      for (variant of variants) {
        variant.id = variant.variant_id;
        delete variant.variant_id;
        delete variant.lemma_id;
        lemma.variants.push(variant);
      }
    })
    .catch(error => console.error(`\nError in getLemma.js\nCouldn't fetch Variants for lemmaId: ${lemmaId}\n${error}`));

  // Add QUOTATIONS to lemma object
  const sqlQuotations = `SELECT * FROM quotations WHERE lemma_id = $1 ORDER BY quotation_id;`;
  lemma.quotations = [];
  await waitQuery(pool, sqlQuotations, [lemmaId])
    .then(({ rows: quotations }) => {
      for (quotation of quotations) {
        quotation.id = quotation.quotation_id;
        delete quotation.quotation_id;
        delete quotation.lemma_id;
        lemma.quotations.push(quotation);
      }
    })
    .catch(error => console.error(`\nError in getLemma.js\nCouldn't fetch Quotations for lemmaId: ${lemmaId}\n${error}`));

  // Add CROSS LINKS to lemma object
  // Make cross links work in both directions by linking all that link to this one
  // Get all links from this lemmaId and all links to it
  const sqlCrossLinks = `
    SELECT * FROM cross_links WHERE lemma_id = $1
    UNION
    SELECT * FROM cross_links WHERE link = $1;
  `;
  // var crossLinksDB = await waitQuery(pool, sqlCrossLinks, [lemmaId]);
  lemma.crossLinks = [];
  await waitQuery(pool, sqlCrossLinks, [lemmaId])
    .then(({ rows: crossLinks }) => {
      for (crossLink of crossLinks) {
        crossLink.id = crossLink.cross_link_id;
        delete crossLink.cross_link_id;
        crossLink.lemmaId = crossLink.lemma_id;
        delete crossLink.lemma_id;

        // Make cross links work in both directions by linking all that link to this one
        if (crossLink.link === lemmaId) {
          crossLink.link = crossLink.lemmaId;
        }
        // console.log(crossLink);
        lemma.crossLinks.push(crossLink);
      }
    })
    .catch(error => console.error(`\nError in getLemma.js\nCouldn't fetch Cross Links for lemmaId: ${lemmaId}\n${error}`));

  // Add EXTERNAL LINKS to lemma object
  const sqlExternalLinks = `SELECT * FROM external_links WHERE lemma_id = $1 ORDER BY external_link_id;`;
  // var externalLinksDB = await waitQuery(pool, sqlExternalLinks, [lemmaId]);
  lemma.externalLinks = [];
  await waitQuery(pool, sqlExternalLinks, [lemmaId])
    .then(({ rows: externalLinks }) => {
      for (externalLink of externalLinks) {
        externalLink.id = externalLink.external_link_id;
        delete externalLink.external_link_id;
        delete externalLink.lemma_id;
        lemma.externalLinks.push(externalLink);
      }
    })
    .catch(error => console.error(`\nError in getLemma.js\nCouldn't fetch External Links for lemmaId: ${lemmaId}\n${error}`));

  return lemma;
};

module.exports = getLemma;