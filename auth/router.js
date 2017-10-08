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

router.post('/login', (req, res) => {
		passport.authenticate('basic', function(err, user, info) {
			if (err) {
				return next(err)
			}
			if (!user) {
				return res.redirect('/admin?login=false')
			}
			const authToken = createAuthToken(req.user.apiRepr());
			return res.json({authToken});
		}
	}
);

router.post('/refresh', 
	passport.authenticate('jwt', {session:false}),
	(req, res) => {
		const authToken = createAuthToken(req.user);
		res.json({authToken});
	}
)

module.exports = {router};



