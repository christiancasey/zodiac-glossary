const pool = require('../pool');

const getLemmataList = (request, response) => {

  const token = request.query.token;

  try {
    let sql = `
    SELECT lemma_id, min(timestamp) as timestamp, editor, published, original, translation, primary_meaning, transliteration, literal_translation2, checked, attention, last_edit FROM lemmata
    JOIN edit_history USING (lemma_id)
    GROUP BY lemma_id
    ORDER BY timestamp DESC;
    `;

    pool.query(sql, (error, { rows: lemmata }) => {
      if (!error) {

        lemmata = lemmata.map(lemma => {
          lemma.lemmaId = lemma.lemma_id;
          delete lemma.lemma_id;
          return lemma;
        });

        response.status(200).json(lemmata);

      } else {
        throw new Error(`Error fetching lemmata list: ${error}`);
      }
    });
  } catch (error) {
    response.status(500).send(error);
  }
};

module.exports = {
  getLemmataList
};