const path = require('path');
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;


console.log("PORT: " + process.env.PORT);

const db = require('./queries');

app.use(express.static(path.resolve(__dirname, '../client/build')));


app.use(express.json());
app.get('/api', (req, res) => {
  let greeting = `<h1>The Zodiac Glossary API</h1>
    <p>This API is for working directly with the Zodiac Glossary data.</p>
    <p>All data related to this project are freely publicly available. There is nothing to be gained by tinkering with the API.</p>
    <p>Please <a href="https://zodiac.fly.dev">return to the homepage</a> to continue using the Zodiac Glossary</p>`;
  res.send(greeting);
});


app.get('/api/users', db.getUsers);
app.get('/api/users/:id', db.getUserById);
app.post('/api/users', db.createUser);
app.put('/api/users/:id', db.updateUser);
app.delete('/api/users/:id', db.deleteUser);


app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});



app.listen(port, () => console.log(`Zodiac Glossary app listening on port ${port}!`));

