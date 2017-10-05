const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');

const router = express.Router()

const createAuthToken = user => {
	return jwt.sign({user}, config.JWT_SECRET, {
		subject: user.username,
		expiresIn: config.JWT_EXPIRY,
		algorithm: 'HS256'
	});
};

router.post('/login', 
	passport.authenticate('basic', {
		session: false, 
		failureRedirect: '/admin?login=failed'	
	}), 
	(req, res) => {
		const authToken = createAuthToken(req.user.apiRepr());
		res.json({authToken});
	}
);

module.exports = {router};



