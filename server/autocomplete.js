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
// AUTOCOMPLETE QUERIES
////////////////////////////////////////////////////////////////////////////////

const meaningCategories = (request, response) => {
  const sql = `SELECT category FROM meanings WHERE category <> '' GROUP BY category ORDER BY category;`;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    const list = results.rows.map(meaning => meaning.category);
    response.status(200).json(list);
  });
};

const quotationSource = (request, response) => {
  const field = request.query.field.replace(/\W/g, ''); // Sanitize input, only alphanumeric values
  const sql = `SELECT ${field} FROM quotations WHERE ${field} <> '' GROUP BY ${field} ORDER BY ${field};`;
  pool.query(sql, (error, results) => {
    if (error) {
      console.error(error);
      response.status(500);
    } else {
      const list = results.rows.map(row => row[field]);
      response.status(200).json(list);
    }
  });
};

const findLongestQuotation = quotations => {
  const lenArray = quotations.map(quotation => 
    (quotation.genre + quotation.provenance + quotation.date + quotation.link).length
  );
  const maxIndex = lenArray.indexOf(Math.max(...lenArray));
  return quotations[maxIndex];
};

const quotationAutofillFromSource = (request, response) => {
  const source = request.query.source;
  const sql =  `SELECT * FROM quotations WHERE source = $1;`;
  pool.query(sql, [source], (error, results) => {
    if (error) {
      console.error(error);
      response.status(500).json([]);
    } else {
      let quotations = results.rows;

      if (quotations.length > 1)
        quotations = findLongestQuotation(quotations);
      else if (quotations.length === 1)
        quotations = quotations[0];
      else
        quotations = null;

      if (quotations) {
        response.status(200).json(quotations);
      } else {
        response.status(400).json(null);
      }
    }
  });
};

////////////////////////////////////////////////////////////////////////////////
// EXPORTS
////////////////////////////////////////////////////////////////////////////////
module.exports = {
  meaningCategories,
  quotationSource,
  quotationAutofillFromSource,
};