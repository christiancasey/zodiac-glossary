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

module.exports = {
  getLanguages,
  getPartsOfSpeech,
};