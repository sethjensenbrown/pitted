const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const {User} = require('./models');

const router = express.Router();
const jsonParser = bodyParser.json();

//POST endpoint allows for the creation of admin users
router.post('/', jsonParser, (req, res) => {
	//verify usename and password are included in request body
	const requiredFields = ['username', 'password'];
	const missingField = requiredFields.find(field => 
		!(field in req.body)
	);
	if (missingField) {
		return res.status(422).json({
			code: 422,
			reason: `ValidationError`,
			message: `Missing Field`,
			location: missingField
		});
	}

	//verify all expected fields in request body are strings
	const stringFields = ['username', 'password', 'firstName', 'lastName'];
	const notString = stringFields.find(field => 
		(field in req.body) && typeof req.body[field] !== 'string'
	);
	if (notString) {
		return res.status(422).json({
			code: 422,
			reason: `ValidationError`,
			message: `Incorrect field type: expected string`,
			location: notString
		});
	}

	//verify that username and password have NO whitespace
	const doNotTrim = ['username', 'password'];
	const cannotTrim = doNotTrim.find(field => 
		req.body[field].trim() !== req.body[field]
	);
	if (cannotTrim) {
		return res.status(422).json({
			code: 422,
			reason: `ValidationError`,
			message: `Cannot start or end with whitespace`,
			location: cannotTrim
		});
	}

	//length limits on username and password
	//username must be at least 5 characters
	//password must be between 5 and 72
	const sizedFields = {
		username: {
			min: 5
		},
		password: {
			min: 5,
			max: 72
		}
	};
	const tooSmallField = Object.keys(sizedFields).find(field => 
		'min' in sizedFields[field] && req.body[field].trim().length < sizedFields[field].min
	);
	const tooLargeField = Object.keys(sizedFields).find(field => 
		'max' in sizedFields[field] && req.body[field].trim().length > sizedFields[field].max
	);
	if (tooLargeField || tooSmallField) {
		return res.status(422).json({
			code: 422,
			reason: `ValidationError`,
			message: tooSmallField ?
				`Must be at least ${sizedFields[tooSmallField].min} characters long` :
				`Must be at most ${sizedFields[tooLargeField].max} characters long`,
			location: tooSmallField || tooLargeField
		});
	}

	//create variables to hold request values
	let {username, password, firstName='', lastName=''} = req.body;
	firstName = firstName.trim();
	lastName = lastName.trim();

	return User
		//ensure username is not already taken
		.find({username})
		.count()
		.then((count) => {
			if (count > 0) {
				return Promise.reject({
					code: 422,
					reason: `ValidationError`,
					message: `Username already taken`,
					location: `username`
				});
			}
			//if not, then hash password
			return User.hashPassword(password)
		})
		.then((hash) => {
			return User
				//then create user
				.create({
					username, 
					password: hash,
					firstName,
					lastName
				})
		})
		.then(user => {
			return res.status(201).json(user.apiRepr());
		})
		.catch(err => {
			if (err.reason === `ValidationError`) {
				return res.status(err.code).json(err);
			}
			res.status(500).json({code: 500, message: `Internal server error`})
		});
});

//PUT endpoint for resetting password
router.put ('/reset', passport.authenticate('basic', {session: false}), (req, res) => {
		//verify usename and password are included in request body
		const requiredFields = ['username', 'password'];
		const missingField = requiredFields.find(field => 
			!(field in req.body)
		);
		if (missingField) {
			return res.status(422).json({
				code: 422,
				reason: `ValidationError`,
				message: `Missing Field`,
				location: missingField
			});
		}

		//verify all expected fields in request body are strings
		const stringFields = ['username', 'password'];
		const notString = stringFields.find(field => 
			(field in req.body) && typeof req.body[field] !== 'string'
		);
		if (notString) {
			return res.status(422).json({
				code: 422,
				reason: `ValidationError`,
				message: `Incorrect field type: expected string`,
				location: notString
			});
		}

		//verify that username and password have NO whitespace
		const doNotTrim = ['username', 'password'];
		const cannotTrim = doNotTrim.find(field => 
			req.body[field].trim() !== req.body[field]
		);
		if (cannotTrim) {
			return res.status(422).json({
				code: 422,
				reason: `ValidationError`,
				message: `Cannot start or end with whitespace`,
				location: cannotTrim
			});
		}

		//password must be between 5 and 72 characters
		if (req.body['password'].trim().length < 5) {
			return res.status(422).json({
				code: 422,
				reason: `ValidationError`,
				message: `Must be at least 5 characters long`,
				location: `password`
			});
		}
		if (req.body['password'].trim().length > 72) {
			return res.status(422).json({
				code: 422,
				reason: `ValidationError`,
				message: `Must be at most 72 characters long`,
				location: `password`
			});
		}

		//create variables to hold request values
		let {username, password} = req.body;

		//update password
		return User
			//first hash the password
			.hashPassword(password)
			.then((hash) => {
				return User
					//then update password in the database
					.update({ username }, { password: hash})
			})
			.then(() => {
				return res.status(201).json({"message": "successfully changed!"});
			})
			.catch(err => {
				if (err.reason === `ValidationError`) {
					return res.status(err.code).json(err);
				}
				res.status(500).json({code: 500, message: `Internal server error`})
			});
	}
)

module.exports = {router};





