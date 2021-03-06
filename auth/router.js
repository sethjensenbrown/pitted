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

router.post('/login', (req, res, next) => {
		passport.authenticate('basic', function(err, user, info) {
			if (err) {
				return next(err);
			}
			if (!user) {
				return res.status(401).json({redirect: true});
			}
			const authToken = createAuthToken(user.apiRepr());
			return res.json({authToken});
		})(req, res, next);
	}
);

module.exports = {router};



