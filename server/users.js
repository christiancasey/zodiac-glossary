const Pool = require('pg').Pool;
require('dotenv').config();

const bcrypt = require('bcryptjs');
const { response } = require("express");
const jwt = require('jsonwebtoken');

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

const createUser = async (request, response) => {
  const { first_name, last_name, email, website, username, password } = request.body;
  const hashedPassword = await bcrypt.hash(password, 8);

  try {
    // Make sure the username doesn't exist already
    const userTest = await pool.query('SELECT * FROM users WHERE username=$1;', [username]);
    if (userTest.rows.length) {
      throw new Error();
    }

    await pool.query(
      'INSERT INTO users (first_name, last_name, email, website, username, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', 
      [first_name, last_name, email, website, username, hashedPassword], 
      (error, results) => {
        if (error) throw error;
        response.status(201).send(results.rows[0]);
    });
  } catch (error) {
    response.status(400).send();
  }
};

const loginUser = async (request, response) => {
  const {username, password} = request.body;

  try {
    const userMatch = await pool.query('SELECT * FROM users WHERE active=TRUE AND username=$1;', [username]);
    if (userMatch.rows.length !== 1)
      throw new Error();

    const user = userMatch.rows[0];
    
    if (!await bcrypt.compare(password, user.password))
      throw new Error();

    const token = await jwt.sign({ username: userMatch.rows[0].username }, 'animalitos');

    delete user.password;
    
    response.send({ user, token });
  } catch (error) {
    response.status(400).send();
  }
};

const getUser = async (request, response) => {
  try {
    const userMatch = await pool.query('SELECT * FROM users WHERE active=TRUE AND username=$1;', [request.decoded.username]);
    
    if (userMatch.rows.length !== 1)
      throw new Error();
    
    response.send({ user: userMatch.rows[0] });
  } catch (error) {
    response.status(400).send();
  }
};

const getContributions = async (request, response) => {
  const contributionSQL = `SELECT lemma_id, username, published, original, translation, transliteration, primary_meaning FROM edit_history
  RIGHT JOIN lemmata USING (lemma_id)
  ` + (request.token ? '' : 'WHERE published = TRUE') + `
  GROUP BY lemma_id, username, published
  ORDER BY username, lemma_id;`;

  const contributorSQL = `SELECT username, first_name, last_name, website FROM edit_history 
  JOIN users USING (username) 
  GROUP BY username, first_name, last_name, website
  ORDER BY last_name;`;

  try {
    const contributionsMatch = await pool.query(contributionSQL);
    const contributorsMatch = await pool.query(contributorSQL);

    if (!(contributionsMatch.rows.length && contributorsMatch.rows.length))
      throw new Error();

    response.send({ contributors: contributorsMatch.rows, contributions: contributionsMatch.rows });

  } catch (error) {
    response.status(400).send();
  }
};

module.exports = {
  createUser,
  loginUser,
  getUser,
  getContributions,
};