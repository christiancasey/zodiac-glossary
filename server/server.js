const path = require('path');
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

const db = require('./queries');

app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(express.json());

app.get('/api', (request, response) => {
  let greeting = `<h1>The Zodiac Glossary API</h1>
    <p>This API is for working directly with the Zodiac Glossary data.</p>
    <p>All data related to this project are freely publicly available. There is nothing to be gained by tinkering with the API.</p>
    <p>Please <a href="https://zodiac.fly.dev">return to the homepage</a> to continue using the Zodiac Glossary</p>
    <p>Version 1.40</p>`;
  response.send(greeting);
});


app.get('/api/users', db.getUsers);
app.get('/api/users/:id', db.getUserById);
app.post('/api/users', db.createUser);
app.put('/api/users/:id', db.updateUser);
app.delete('/api/users/:id', db.deleteUser);

// Standard immutable values
app.get('/api/languages', db.getLanguages);
app.get('/api/partsofspeech', db.getPartsOfSpeech);

// Lemmata list
app.get('/api/lemmata/list', db.getLemmataList);
app.get('/api/lemmata/add', db.addNewLemma);

// Lemma
app.get('/api/lemma/get', db.getLemma);
app.patch('/api/lemma/save', db.saveLemma);
app.delete('/api/lemma/delete', db.deleteLemma);


app.get('*', (request, response) => {
  response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});










app.listen(port, () => console.log(`Zodiac Glossary app listening on port ${port}!`));