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
// Asynchronous Query, Returns Promise
////////////////////////////////////////////////////////////////////////////////

function waitQuery(query, params=[]) {
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

////////////////////////////////////////////////////////////////////////////////
// LEMMATA LIST
////////////////////////////////////////////////////////////////////////////////

const getLemmataListQuery = require('./queries/getLemmataList');
const getLemmataList = (request, response) => {
  const token = request.query.token;
  getLemmataListQuery(pool, token)
    .then(lemmata => response.status(200).json(lemmata))
    .catch(error => response.status(500).send(error));
};


////////////////////////////////////////////////////////////////////////////////
// LEMMA
////////////////////////////////////////////////////////////////////////////////

const addNewLemma = (request, response) => {
  const token = request.query.token; // Will need this later for authentication
  const sql = 'INSERT INTO lemmata VALUES (DEFAULT) RETURNING lemma_id';

  pool.query(sql, (error, results) => {
    if (error) throw error;
    response.status(200).json(results.rows[0].lemma_id);
  });
};

const getLemmaQuery = require('./queries/getLemma');
const getLemma = (request, response) => {
  
  var lemmaId = request.query.lemmaId;

  // Temporary patch to deal with React Router making lemmaId = null in URL
  // Needs a proper fix on client side –CDC 2022-11-29
  if (!lemmaId || lemmaId == "null") {
    response.status(500);
    return;
  }

  // Patch to deal with fake lemma id's for new cross links
  lemmaId = parseInt(lemmaId);

  getLemmaQuery(pool, lemmaId)
    .then(lemma => response.status(200).json(lemma))
    .catch(error => response.status(404).send(error));
};

const saveLemmaQuery = require('./queries/saveLemma');
const saveLemma = ({ body: lemma }, response) => {
  saveLemmaQuery(pool, lemma)
    .then(lemma => response.status(200).json(lemma))
    .catch(error => response.status(500).send(error));
};

const deleteLemma = (request, response) => {
  const lemmaId = request.query.lemmaId;

  const sql = `DELETE FROM lemmata WHERE lemma_id = $1;`;

  const values = [
    lemmaId,
  ];

  pool.query(sql, values, (error, results) => {
    if (error)
      console.log(error);
  });

  response.status(202).json(request.query);
};

////////////////////////////////////////////////////////////////////////////////
// MEANINGS (for linking Quotations to Meanings)
////////////////////////////////////////////////////////////////////////////////
const getMeanings = (request, response) => {
  const lemmaId = request.query.id;
  const sql =  `SELECT * FROM meanings WHERE lemma_id = $1;`;
  pool.query(sql, [lemmaId], (error, results) => {
    if (error) {
      console.log(error);
      response.status(500);
    } else {
      response.status(200).json(results.rows);
    }
  });
};

////////////////////////////////////////////////////////////////////////////////
// EXPORTS
////////////////////////////////////////////////////////////////////////////////
module.exports = {
  getLemmataList,
  addNewLemma,
  getLemma,
  saveLemma,
  deleteLemma,
  getMeanings,
};