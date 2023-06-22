const parseDate = require('postgres-date');

const getLemmataList = (pool, token) => {

  return new Promise((resolve, reject) => {
    let sql = `
    SELECT lemma_id, editor, published, original, translation, primary_meaning, transliteration, literal_translation2, checked, attention, last_edit, languages.value AS language, m.value, m.category
    FROM lemmata as l
    LEFT JOIN languages USING (language_id) 
    LEFT JOIN partsofspeech USING (partofspeech_id)
    LEFT JOIN meanings as m USING (lemma_id)
    `;

    // If no user logged in, show only published lemmata
    if (!token || token === 'null') {
      sql = sql + ' WHERE published = TRUE';
    }

    // Order for use in Recents; doesn't affect anything else
    sql += ' ORDER BY last_edit DESC;';

    pool.query(sql, (error, { rows: lemmataMeanings }) => {
      if (!error) {
        
        const lemmata = [];
        for (let lemmataMeaning of lemmataMeanings) {
          lemmataMeaning.lemmaId = lemmataMeaning.lemma_id;
          delete lemmataMeaning.lemma_id;

          const currentLemma = lemmata.find(lemma => lemma.lemmaId === lemmataMeaning.lemmaId);
          if (currentLemma) {
            currentLemma.meanings.push({
              value: lemmataMeaning.value,
              category: lemmataMeaning.category
            });
          } else {
            if (lemmataMeaning.value) {
              lemmataMeaning.meanings = [{
                value: lemmataMeaning.value,
                category: lemmataMeaning.category
              }];
            } else {
              lemmataMeaning.meanings = [];
            }
            lemmata.push(lemmataMeaning);
          }
        }

        resolve(lemmata);

      } else {
        reject(`Error fetching lemmata list: ${error}`);
      }
    });
  });
};

module.exports = getLemmataList;