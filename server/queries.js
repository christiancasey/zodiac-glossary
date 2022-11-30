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

const getLemmataList = (request, response) => {
  const token = request.query.token;
  const sql = `
    SELECT lemma_id AS lemmaId, published, original, translation, transliteration, languages.value AS language 
    FROM lemmata 
    LEFT JOIN languages USING (language_id) 
    LEFT JOIN partsofspeech USING (partofspeech_id)`;

  if (token) {
    pool.query(sql, (error, results) => {
      if (error) throw error;
      response.status(200).json(results.rows);
    });
  } else {
    pool.query(sql + ' WHERE published = TRUE', (error, results) => {
      if (error) throw error;
      response.status(200).json(results.rows);
    });
  }
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

const getLemma = async (request, response) => {
  const lemmaId = request.query.lemmaId; // Will need this later for authentication
  console.log('lemmaId (sent from client)', lemmaId);

  // Temporary patch to deal with React Router making lemmaId = null in URL
  // Needs a proper fix on client side –CDC 2022-11-29
  if (!lemmaId || lemmaId == "null") {
    response.status(404);
    return;
  }

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
  // Add QUOTATIONS to lemma object
  // Add CROSS LINKS to lemma object
  // Add EXTERNAL LINKS to lemma object

  response.status(200).json(lemma);

  console.log('lemma', lemma);
};

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

const saveLemma = (request, response) => {
  const lemma = request.body;

  console.log(`\n\nSAVE LEMMA CALL:\n`, lemma);

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

  const sqlMeanings = `
    UPDATE meanings
      SET
        value = $3
    WHERE lemma_id = $1 AND meaning_id = $2
  `;

  for (meaning of lemma.meanings) {
    console.log(meaning);
    const values = [
      lemma.lemmaId,
      meaning.id,
      meaning.value,
    ];

    pool.query(sqlMeanings, values, (error, results) => {
      if (error) throw error;
    });
  }

  response.status(200);
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
};