const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const should = chai.should();

const {app, runServer, closeServer} = require('../server');
const {User} = require('../users');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

describe('Users API POST endpoint', function() {
	const username = 'goku_rulz';
	const password = 'SPIRITBOMB!';
	const firstName = 'Son';
	const lastName = 'Goku';

	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	afterEach(function() {
		return User.remove({});
	});

	after(function() {
		return closeServer();
	});

	it ('should reject requests with a missing username', function() {
		return chai.request(app)
			.post('/api/users')
			.send({
				password,
				firstName,
				lastName
			})
			.catch(function(err) {
				const res = err.response;
				res.should.be.json;
				res.should.have.status(422);
				res.body.reason.should.equal('ValidationError');
				res.body.message.should.equal('Missing Field');
				res.body.location.should.equal('username');
			});
	});
	it ('should reject requests with a missing password', function() {
		return chai.request(app)
			.post('/api/users')
			.send({
				username,
				firstName,
				lastName
			})
			.catch(function(err) {
				const res = err.response;
				res.should.be.json;
				res.should.have.status(422);
				res.body.reason.should.equal('ValidationError');
				res.body.message.should.equal('Missing Field');
				res.body.location.should.equal('password');
			});
	});

	it ('should reject requests with a non-string username', function() {
		return chai.request(app)
			.post('/api/users')
			.send({
				username: true,
				password,
				firstName,
				lastName
			})
			.catch(function(err) {
				const res = err.response;
				res.should.be.json;
				res.should.have.status(422);
				res.body.reason.should.equal('ValidationError');
				res.body.message.should.equal('Incorrect field type: expected string');
				res.body.location.should.equal('username');
			});
	});
	it ('should reject requests with a non-string password', function() {
		return chai.request(app)
			.post('/api/users')
			.send({
				username,
				password: true,
				firstName,
				lastName
			})
			.catch(function(err) {
				const res = err.response;
				res.should.be.json;
				res.should.have.status(422);
				res.body.reason.should.equal('ValidationError');
				res.body.message.should.equal('Incorrect field type: expected string');
				res.body.location.should.equal('password');
			});
	});
	it ('should reject requests with a non-string firstName', function() {
		return chai.request(app)
			.post('/api/users')
			.send({
				username,
				password,
				firstName: true,
				lastName
			})
			.catch(function(err) {
				const res = err.response;
				res.should.be.json;
				res.should.have.status(422);
				res.body.reason.should.equal('ValidationError');
				res.body.message.should.equal('Incorrect field type: expected string');
				res.body.location.should.equal('firstName');
			});
	});
	it ('should reject requests with a non-string lastName', function() {
		return chai.request(app)
			.post('/api/users')
			.send({
				username,
				password,
				firstName,
				lastName: true
			})
			.catch(function(err) {
				const res = err.response;
				res.should.be.json;
				res.should.have.status(422);
				res.body.reason.should.equal('ValidationError');
				res.body.message.should.equal('Incorrect field type: expected string');
				res.body.location.should.equal('lastName');
			});
	});

	it ('should reject requests with a whitespace in username', function() {
		return chai.request(app)
			.post('/api/users')
			.send({
				username: `  ${username}  `,
				password,
				firstName,
				lastName
			})
			.catch(function(err) {
				const res = err.response;
				res.should.be.json;
				res.should.have.status(422);
				res.body.reason.should.equal('ValidationError');
				res.body.message.should.equal('Cannot start or end with whitespace');
				res.body.location.should.equal('username');
			});
	});
	it ('should reject requests with a whitespace in password', function() {
		return chai.request(app)
			.post('/api/users')
			.send({
				username,
				password: `  ${password}  `,
				firstName,
				lastName
			})
			.catch(function(err) {
				const res = err.response;
				res.should.be.json;
				res.should.have.status(422);
				res.body.reason.should.equal('ValidationError');
				res.body.message.should.equal('Cannot start or end with whitespace');
				res.body.location.should.equal('password');
			});
	});

	it ('should reject requests with a username less than 5 characters', function() {
		return chai.request(app)
			.post('/api/users')
			.send({
				username: '1234',
				password,
				firstName,
				lastName
			})
			.catch(function(err) {
				const res = err.response;
				res.should.be.json;
				res.should.have.status(422);
				res.body.reason.should.equal('ValidationError');
				res.body.message.should.equal('Must be at least 5 characters long');
				res.body.location.should.equal('username');
			});
	});
	it ('should reject requests with a password less than 5 characters', function() {
		return chai.request(app)
			.post('/api/users')
			.send({
				username,
				password: '1234',
				firstName,
				lastName
			})
			.catch(function(err) {
				const res = err.response;
				res.should.be.json;
				res.should.have.status(422);
				res.body.reason.should.equal('ValidationError');
				res.body.message.should.equal('Must be at least 5 characters long');
				res.body.location.should.equal('password');
			});
	});
	it ('should reject requests with a password more than 72 characters', function() {
		return chai.request(app)
			.post('/api/users')
			.send({
				username,
				password: new Array(73).fill('a').join(''),
				firstName,
				lastName
			})
			.catch(function(err) {
				const res = err.response;
				res.should.be.json;
				res.should.have.status(422);
				res.body.reason.should.equal('ValidationError');
				res.body.message.should.equal('Must be at most 72 characters long');
				res.body.location.should.equal('password');
			});
	});

	it ('should reject requests with duplicate usernames', function() {
		return User.create({
			username,
			password,
			firstName,
			lastName,
		})
		.then(function() {
			chai.request(app)
				.post('/api/users')
				.send({
					username,
					password,
					firstName,
					lastName
				})
		})
		.catch(function(err) {
			const res = err.response;
			res.should.be.json;
			res.should.have.status(422);
			res.body.reason.should.equal('ValidationError');
			res.body.message.should.equal('Username already taken');
			res.body.location.should.equal('username');
		});
	});

	it ('should add a user and trim firstName and lastName', function() {
		return chai.request(app)
			.post('/api/users')
			.send({
				username,
				password,
				firstName: `  ${firstName}  `,
				lastName: `  ${lastName}  `
			})
			.then(function(res) {
				res.should.be.json;
				res.should.have.status(201);
				res.body.username.should.equal(username);
				res.body.firstName.should.equal(firstName);
				res.body.lastName.should.equal(lastName);
			})
	});

})








