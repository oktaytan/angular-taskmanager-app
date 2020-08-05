const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const { mongoose } = require('./db/mongoose');
const { User } = require('./db/models/index.js');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(cors());
// CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Methods',
		'GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE'
	);
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id'
	);

	res.header(
		'Access-Control-Expose-Headers',
		'x-access-token, x-refresh-token'
	);

	next();
});

// check whether the request has a valid JWT access token
let authenticate = (req, res, next) => {
	let token = req.header('x-access-token');

	// verify the JWT
	jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
		if (err) {
			// there was an error
			// jwt is invalid - * DO NOT AUTHENTICATE *
			res.status(401).send(err);
		} else {
			// jwt is valid
			req.user_id = decoded._id;
			next();
		}
	});
};

// ROUTE HANDLERS

// LIST ROUTES
app.use('/lists', authenticate, require('./routes/lists.js'));
// USER ROUTES
app.use('/users', require('./routes/users.js'));

app.listen(PORT, () => console.log('Server started on http://localhost:3000'));
