const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { mongoose } = require('./db/mongoose');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(cors());

// ROUTE HANDLERS

// LIST ROUTES
app.use('/lists', require('./routes/lists.js'));

app.listen(PORT, () => console.log('Server started on http://localhost:3000'));
