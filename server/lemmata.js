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

// DEP on 2023-06-21 –CDC

// function waitQuery(query, params=[]) {
//   return new Promise((resolve, reject) => {
//     pool.query(query, params, (error, results) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(results);
//       }
//     });
//   });
// }

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
  try {
    const sql = 'INSERT INTO lemmata VALUES (DEFAULT) RETURNING lemma_id';

    pool.query(sql, (error, results) => {
      if (error) throw error;
      response.status(201).json(results.rows[0].lemma_id);
    });
  } catch (error) {
    console.log(error);
    response.status(500).send();
  }
};

const getLemmaQuery = require('./queries/getLemma');
const getLemma = (request, response) => {
  try {  
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
  
  } catch (error) {
    console.log(error);
    response.status(500).send();
  }
};

const saveLemmaQuery = require('./queries/saveLemma');
const saveLemma = (request, response) => {
  try {
    const lemma = request.body;
    const username = request.decoded.username;
    saveLemmaQuery(pool, lemma, username)
      .then(lemma => response.status(200).json(lemma))
      .catch(error => response.status(500).send(error));
  } catch (error) {
    response.status(400).send("Error saving lemma");
  }
};

const deleteLemma = (request, response) => {
  try {
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
  } catch (error) {
    console.log(error);
    response.status(500).send();
  }
};

const checkLemma = (request, response) => {
  try {
    // Protect against sending other fields to the api, SQL injection, etc...
    if (request.body.field !== 'checked' && request.body.field !== 'attention') {
      response.status(500);
      return;
    }

    const sql = `UPDATE lemmata SET ${request.body.field} = $2 where lemma_id = $1;`;
    // const sql = `UPDATE lemmata SET $3 = $2 where lemma_id = $1;`;

    const values = [
      request.body.lemmaId,
      request.body.checked,
    ];


    pool.query(sql, values, (error, results) => {
      if (error)
        console.log(error);
    });

    response.status(202).json(request.body);
  } catch (error) {
    console.log(error);
    response.status(500).send();
  }
};

const getEditHistory = (request, response) => {
  try {
    const lemmaId = request.query.lemmaId;
    console.log('getEditHistory')
    const sql =  `SELECT * FROM edit_history WHERE lemma_id = $1 ORDER BY timestamp DESC;`;
    pool.query(sql, [lemmaId], (error, results) => {
      if (error) {
        console.log(error);
        response.status(500);
      } else {
        response.status(200).json(results.rows);
      }
    });
  } catch (error) {
    console.log('Error in getEditHistory with lemmaId: ' + lemmaId, error);
    response.status(500).send();
  }
};

////////////////////////////////////////////////////////////////////////////////
// MEANINGS (for linking Quotations to Meanings)
////////////////////////////////////////////////////////////////////////////////
const getMeanings = (request, response) => {
  try {
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
  } catch (error) {
    console.log(error);
    response.status(500).send();
  }
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
  checkLemma,
  getMeanings,
  getEditHistory,
};