const Pool = require('pg').Pool;
require('dotenv').config();

var pool;
if (process.env.LOCAL_DEV === "true") {
  pool = new Pool({
    host: process.env.DB_HOST_LOCAL,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
  });
} else {
  pool = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
  });
}

////////////////////////////////////////////////////////////////////////////////
// USER creation and authentication
////////////////////////////////////////////////////////////////////////////////

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) throw error;
    response.status(200).json(results.rows);
  });
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('SELECT * FROM users WHERE user_id = $1', [id], (error, results) => {
    if (error) throw error;
    response.status(200).json(results.rows);
  });
};

const createUser = (request, response) => {
  const { name, email } = request.body;

  pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email], (error, results) => {
    if (error) throw error;
    response.status(201).send(`User added: ${JSON.stringify(results.rows)}`);
  })
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE user_id = $3',
    [name, email, id],
    (error, results) => {
      if (error) throw error;
      response.status(200).send(`User modified with id: ${id}`);
    }
  );
};

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('DELETE FROM users WHERE user_id = $1', [id], (error, results) => {
    if (error) throw error;
    response.status(200).send(`User deleted with id: ${id}`);
  });
};


////////////////////////////////////////////////////////////////////////////////
// LANGUAGES and PARTS OF SPEECH
////////////////////////////////////////////////////////////////////////////////

const getLanguages = (request, response) => {
  const sql = "SELECT * FROM languages WHERE active ORDER BY language";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    response.status(200).send(results.rows);
  });
};

const getPartsOfSpeech = (request, response) => {
  const sql = "SELECT * FROM partsofspeech WHERE active ORDER BY partsofspeech";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    response.status(200).send(results.rows);
  });
};

////////////////////////////////////////////////////////////////////////////////
// LEMMATA LIST
////////////////////////////////////////////////////////////////////////////////

const getLemmataList = async (request, response) => {
  const token = request.query.token;
  let sql = `
    SELECT lemma_id, published, original, translation, transliteration, languages.value AS language 
    FROM lemmata 
    LEFT JOIN languages USING (language_id) 
    LEFT JOIN partsofspeech USING (partofspeech_id)
  `;

  // If no user logged in, show only published lemmata
  if (!token) {
    sql = sql + ' WHERE published = TRUE'
  }

  const lemmataDB = await waitQuery(sql);
  let lemmata = lemmataDB.rows;

  // TODO – REWRITE THIS TO RUN meanings AND variants QUERIES ONLY ONCE EACH
  // THEN FILTER PROGRAMMATICALLY BY LEMMA_ID
  // CDC 2022-12-12
  const sqlMeanings = `SELECT * FROM meanings WHERE lemma_id = $1;`;
  const sqlVariants = `SELECT * FROM variants WHERE lemma_id = $1;`;

  for (lemma of lemmata) {
    lemma.lemmaId = lemma.lemma_id;
    delete lemma.lemma_id;

    lemma.meanings = [];
    var meaningsDB = await waitQuery(sqlMeanings, [lemma.lemmaId]);
    for (meaning of meaningsDB.rows) {
      lemma.meanings.push(meaning.value);
    }

    lemma.variants = [];
    var variantsDB = await waitQuery(sqlVariants, [lemma.lemmaId]);
    for (variant of variantsDB.rows) {
      lemma.variants.push(variant.original);
      lemma.variants.push(variant.transliteration);
    }
  }

  response.status(200).json(lemmata);
};

const addNewLemma = (request, response) => {
  const token = request.query.token; // Will need this later for authentication
  const sql = 'INSERT INTO lemmata VALUES (DEFAULT) RETURNING lemma_id';

  pool.query(sql, (error, results) => {
    if (error) throw error;
    response.status(200).json(results.rows[0].lemma_id);
  });
};

////////////////////////////////////////////////////////////////////////////////
// LEMMA
////////////////////////////////////////////////////////////////////////////////

function waitQuery(query, params) {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

const getLemma = async (request, response) => {

  var lemmaId = request.query.lemmaId; // Will need this later for authentication

  // Temporary patch to deal with React Router making lemmaId = null in URL
  // Needs a proper fix on client side –CDC 2022-11-29
  if (!lemmaId || lemmaId == "null") {
    response.status(404);
    return;
  }

  // Patch to deal with fake lemma id's for new cross links
  lemmaId = parseInt(lemmaId);

  // Query DB and create lemma object
  const sqlLemma = `
    SELECT lemma_id AS lemmaId, published, original, translation, transliteration, languages.value AS language, partsofspeech.value AS partofspeech
    FROM lemmata 
      JOIN languages USING (language_id) 
      JOIN partsofspeech USING (partofspeech_id)
    WHERE lemma_id = $1;
    `;

  var lemmaDB = await waitQuery(sqlLemma, [lemmaId]);

  var lemma = lemmaDB.rows;
  if (!lemma.length) {
    response.status(404);
    return;
  }
  lemma = lemma[0];

  lemma.lemmaId = lemma.lemmaid;
  lemma.partOfSpeech = lemma.partofspeech;
  delete lemma.partofspeech;
  delete lemma.lemmaid;

  // Add MEANINGS to lemma object
  const sqlMeanings = `SELECT * FROM meanings WHERE lemma_id = $1;`;
  var meaningsDB = await waitQuery(sqlMeanings, [lemmaId]);
  lemma.meanings = [];
  for (meaning of meaningsDB.rows) {
    meaning.id = meaning.meaning_id;
    delete meaning.meaning_id;
    delete meaning.lemma_id;
    lemma.meanings.push(meaning);
  }

  // Add VARIANTS to lemma object
  const sqlVariants = `SELECT * FROM variants WHERE lemma_id = $1;`;
  var variantsDB = await waitQuery(sqlVariants, [lemmaId]);
  lemma.variants = [];
  for (variant of variantsDB.rows) {
    variant.id = variant.variant_id;
    delete variant.variant_id;
    delete variant.lemma_id;
    lemma.variants.push(variant);
  }

  // Add QUOTATIONS to lemma object
  const sqlQuotations = `SELECT * FROM quotations WHERE lemma_id = $1;`;
  var quotationsDB = await waitQuery(sqlQuotations, [lemmaId]);
  lemma.quotations = [];
  for (quotation of quotationsDB.rows) {
    quotation.id = quotation.quotation_id;
    delete quotation.quotation_id;
    delete quotation.lemma_id;
    lemma.quotations.push(quotation);
  }

  // Add CROSS LINKS to lemma object
  const sqlCrossLinks = `SELECT * FROM cross_links WHERE lemma_id = $1;`;
  var crossLinksDB = await waitQuery(sqlCrossLinks, [lemmaId]);
  lemma.crossLinks = [];
  for (crossLink of crossLinksDB.rows) {
    crossLink.id = crossLink.cross_link_id;
    delete crossLink.cross_link_id;
    delete crossLink.lemma_id;
    lemma.crossLinks.push(crossLink);
  }

  // Add EXTERNAL LINKS to lemma object
  const sqlExternalLinks = `SELECT * FROM external_links WHERE lemma_id = $1;`;
  var externalLinksDB = await waitQuery(sqlExternalLinks, [lemmaId]);
  lemma.externalLinks = [];
  for (externalLink of externalLinksDB.rows) {
    externalLink.id = externalLink.external_link_id;
    delete externalLink.external_link_id;
    delete externalLink.lemma_id;
    lemma.externalLinks.push(externalLink);
  }

  response.status(200).json(lemma);
};

const saveLemma = async (request, response) => {
  const lemma = request.body;

  // LEMMA – basic info
  const sqlLemma = `
    UPDATE lemmata
      SET
        published = $2, 
        original = $3, 
        translation = $4, 
        transliteration = $5, 
        partofspeech_id = (SELECT partofspeech_id FROM partsofspeech WHERE value = $6), 
		    language_id = (SELECT language_id FROM languages WHERE value = $7)
    WHERE lemma_id = $1;
    `;

    const values = [
      lemma.lemmaId, 
      lemma.published, 
      lemma.original, 
      lemma.translation, 
      lemma.transliteration,
      lemma.partOfSpeech,
      lemma.language,
    ];

  pool.query(sqlLemma, values, (error, results) => {
    if (error) throw error;
  });
  
  // MEANINGS
  const sqlMeaningsUpdate = `
    UPDATE meanings
      SET
        value = $2
      WHERE lemma_id = $1 AND meaning_id = $3
    RETURNING *;
  `;
  const sqlMeaningsInsert = `
    INSERT INTO meanings (lemma_id, value)
      VALUES ($1, $2)
    RETURNING meaning_id;
  `;

  for (meaning of lemma.meanings) {

    const values = [
      lemma.lemmaId,
      meaning.value,
      isNaN(parseInt(meaning.id)) ? 0 : parseInt(meaning.id),
    ];

    var meaningUpdateResults = await waitQuery(sqlMeaningsUpdate, values);

    // If the meaning is not in the DB, add it
    // Reset the id of the lemma object with the new auto value from the DB
    if (!meaningUpdateResults.rows.length) {
      var results = await waitQuery(sqlMeaningsInsert, values.slice(0,-1));
      meaning.id = results.rows[0].meaning_id;
    }
  }

  // Clean up meanings in DB
  // Check what's in there and delete any rows that are not in the lemma object anymore
  // ... because they have been deleted by the user on the front end
  var meaningCleanUpResults = await waitQuery('SELECT * FROM meanings WHERE lemma_id = $1', [lemma.lemmaId]);
  let meaningIds = lemma.meanings.map(meaning => meaning.id);
  for (meaning of meaningCleanUpResults.rows) {
    if (!meaningIds.includes(meaning.meaning_id)) {
      pool.query('DELETE FROM meanings WHERE meaning_id = $1', [meaning.meaning_id], (error, results) => {
        if (error) throw error;
      });
    }
  }
  
  // VARIANTS
  const sqlVariantsUpdate = `
    UPDATE variants
      SET
        original = $2,
        transliteration = $3
      WHERE lemma_id = $1 AND variant_id = $4
    RETURNING *;
  `;
  const sqlVariantsInsert = `
    INSERT INTO variants (lemma_id, original, transliteration)
      VALUES ($1, $2, $3)
    RETURNING variant_id;
  `;

  for (variant of lemma.variants) {

    const values = [
      lemma.lemmaId,
      variant.original,
      variant.transliteration,
      isNaN(parseInt(variant.id)) ? 0 : parseInt(variant.id),
    ];

    var variantUpdateResults = await waitQuery(sqlVariantsUpdate, values);

    // If the variant is not in the DB, add it
    // Reset the id of the lemma object with the new auto value from the DB
    if (!variantUpdateResults.rows.length) {
      var results = await waitQuery(sqlVariantsInsert, values.slice(0,-1));
      variant.id = results.rows[0].variant_id;
    }
  }

  // Clean up variants in DB
  // Check what's in there and delete any rows that are not in the lemma object anymore
  // ... because they have been deleted by the user on the front end
  var variantCleanUpResults = await waitQuery('SELECT * FROM variants WHERE lemma_id = $1', [lemma.lemmaId]);
  let variantIds = lemma.variants.map(variant => variant.id);
  for (variant of variantCleanUpResults.rows) {
    if (!variantIds.includes(variant.variant_id)) {
      pool.query('DELETE FROM variants WHERE variant_id = $1', [variant.variant_id], (error, results) => {
        if (error) throw error;
      });
    }
  }
  
  // QUOTATIONS
  const sqlQuotationsUpdate = `
    UPDATE quotations
      SET
        original = $2,
        transliteration = $3,
        translation = $4,
        source = $5,
        genre = $6,
        provenance = $7,
        date = $8,
        publication = $9,
        link = $10
      WHERE lemma_id = $1 AND quotation_id = $11
    RETURNING *;
  `;
  const sqlQuotationsInsert = `
    INSERT INTO quotations (lemma_id, original, transliteration, translation, source, genre, provenance, date, publication, link)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING quotation_id;
  `;

  for (quotation of lemma.quotations) {

    const values = [
      lemma.lemmaId,
      quotation.original,
      quotation.transliteration,
      quotation.translation,
      quotation.source,
      quotation.genre,
      quotation.provenance,
      quotation.date,
      quotation.publication,
      quotation.link,
      isNaN(parseInt(quotation.id)) ? 0 : parseInt(quotation.id),
    ];

    var quotationUpdateResults = await waitQuery(sqlQuotationsUpdate, values);

    // If the quotation is not in the DB, add it
    // Reset the id of the lemma object with the new auto value from the DB
    if (!quotationUpdateResults.rows.length) {
      var results = await waitQuery(sqlQuotationsInsert, values.slice(0,-1));
      quotation.id = results.rows[0].quotation_id;
    }
  }

  // Clean up quotations in DB
  // Check what's in there and delete any rows that are not in the lemma object anymore
  // ... because they have been deleted by the user on the front end
  var quotationCleanUpResults = await waitQuery('SELECT * FROM quotations WHERE lemma_id = $1', [lemma.lemmaId]);
  let quotationIds = lemma.quotations.map(quotation => quotation.id);
  for (quotation of quotationCleanUpResults.rows) {
    if (!quotationIds.includes(quotation.quotation_id)) {
      pool.query('DELETE FROM quotations WHERE quotation_id = $1', [quotation.quotation_id], (error, results) => {
        if (error) throw error;
      });
    }
  }

  // CROSS LINKS
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
    
    const values = [
      lemma.lemmaId,
      crossLink.link,
      isNaN(parseInt(crossLink.id)) ? 0 : parseInt(crossLink.id),
    ];

    var crossLinkUpdateResults = await waitQuery(sqlCrossLinksUpdate, values);

    // If the crossLink is not in the DB, add it
    // Reset the id of the lemma object with the new auto value from the DB
    if (!crossLinkUpdateResults.rows.length) {
      var results = await waitQuery(sqlCrossLinksInsert, values.slice(0,-1));
      crossLink.id = results.rows[0].cross_link_id;
    }
  }

  // Clean up crossLinks in DB
  // Check what's in there and delete any rows that are not in the lemma object anymore
  // ... because they have been deleted by the user on the front end
  var crossLinkCleanUpResults = await waitQuery('SELECT * FROM cross_links WHERE lemma_id = $1', [lemma.lemmaId]);
  let crossLinkIds = lemma.crossLinks.map(crossLink => crossLink.id);
  for (crossLink of crossLinkCleanUpResults.rows) {
    if (!crossLinkIds.includes(crossLink.cross_link_id)) {
      pool.query('DELETE FROM cross_links WHERE cross_link_id = $1', [crossLink.cross_link_id], (error, results) => {
        if (error) throw error;
      });
    }
  }

  // EXTERNAL LINKS
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
      externalLink.url,
      externalLink.display,
      isNaN(parseInt(externalLink.id)) ? 0 : parseInt(externalLink.id),
    ];

    var externalLinkUpdateResults = await waitQuery(sqlExternalLinksUpdate, values);

    // If the externalLink is not in the DB, add it
    // Reset the id of the lemma object with the new auto value from the DB
    if (!externalLinkUpdateResults.rows.length) {
      var results = await waitQuery(sqlExternalLinksInsert, values.slice(0,-1));
      externalLink.id = results.rows[0].external_link_id;
    }
  }

  // Clean up externalLinks in DB
  // Check what's in there and delete any rows that are not in the lemma object anymore
  // ... because they have been deleted by the user on the front end
  var externalLinkCleanUpResults = await waitQuery('SELECT * FROM external_links WHERE lemma_id = $1', [lemma.lemmaId]);
  let externalLinkIds = lemma.externalLinks.map(externalLink => externalLink.id);
  for (externalLink of externalLinkCleanUpResults.rows) {
    if (!externalLinkIds.includes(externalLink.external_link_id)) {
      pool.query('DELETE FROM external_links WHERE external_link_id = $1', [externalLink.external_link_id], (error, results) => {
        if (error) throw error;
      });
    }
  }

  response.status(200).json(lemma);
};

const deleteLemma = (request, response) => {
  const lemmaId = request.query.lemmaId;

  const sql = `DELETE FROM lemmata WHERE lemma_id = $1;`;

    const values = [
      lemmaId,
    ];

  pool.query(sql, values, (error, results) => {
    if (error) throw error;
  });

  response.status(202).json(request.query);
};

////////////////////////////////////////////////////////////////////////////////
// EXPORTS
////////////////////////////////////////////////////////////////////////////////
module.exports = {
  getLanguages,
  getPartsOfSpeech,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getLemmataList,
  addNewLemma,
  getLemma,
  saveLemma,
  deleteLemma,
};