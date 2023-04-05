const path = require('path');
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

const settings = require('./settings');
const lemmata = require('./lemmata');
const users = require('./users');
const ac = require('./autocomplete');
const td = require('./todo');

app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(express.json());

app.get('/api', (request, response) => {
  let greeting = `<h1>The Zodiac Glossary API</h1>
    <p>This API is for working directly with the Zodiac Glossary data.</p>
    <p>All data related to this project are freely publicly available. There is nothing to be gained by tinkering with the API.</p>
    <p>Please <a href="https://zodiac.fly.dev">return to the homepage</a> to continue using the Zodiac Glossary.</p>
    <p>For help or inquiries, write to <a href="mailto:christian.casey@fu-berlin.de">christian.casey@fu-berlin.de</a>.</p>
    <p>Version 1.40</p>`;
  response.send(greeting);
});

// Standard immutable values
app.get('/api/languages', settings.getLanguages);
app.get('/api/partsofspeech', settings.getPartsOfSpeech);

// Lemmata list
app.get('/api/lemmata/list', lemmata.getLemmataList);
app.get('/api/lemmata/add', lemmata.addNewLemma);

// Lemma
app.get('/api/lemma/get', lemmata.getLemma);
app.patch('/api/lemma/save', lemmata.saveLemma);
app.delete('/api/lemma/delete', lemmata.deleteLemma);

app.patch('/api/lemma/check', lemmata.checkLemma);

// Quotation => Meanings
app.get('/api/meanings', lemmata.getMeanings); // Unused endpoint, probably not needed

// Autocomplete
app.get('/api/autocomplete/meanings', ac.meaningCategories);
app.get('/api/autocomplete/quotations', ac.quotationSource);
app.get('/api/autocomplete/quotation_from_source', ac.quotationAutofillFromSource);

// Todo List
app.get('/api/todo/list', td.getTodoList);

// User authentication (TBD – CDC 2023-02-09)
app.get('/api/users', users.getUsers);
app.get('/api/users/:id', users.getUserById);
app.post('/api/users', users.createUser);
app.put('/api/users/:id', users.updateUser);
app.delete('/api/users/:id', users.deleteUser);

app.get('*', (request, response) => {
  response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});









app.listen(port, () => console.log(`Zodiac Glossary app listening on port ${port}.`));