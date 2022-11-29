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

const getLemma = (request, response) => {
  const lemmaId = request.query.lemmaId; // Will need this later for authentication
  const sql = `
    SELECT lemma_id AS lemmaId, published, original, translation, transliteration, languages.value AS language 
    FROM lemmata 
    LEFT JOIN languages USING (language_id) 
    LEFT JOIN partsofspeech USING (partofspeech_id)
    WHERE lemma_id = $1`;

  pool.query(sql, [lemmaId], (error, results) => {
    if (error) throw error;
    let lemma = results.rows;
    if (!lemma.length) {
      response.status(404);
      return;
    }
    lemma = lemma[0];

    lemma.lemmaId = lemma.lemmaid;
    delete lemma.lemmaid;

    

    console.log(lemma);
    response.status(200).json(lemma);
  });
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
};