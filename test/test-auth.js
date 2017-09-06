const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const {app, runServer, closeServer} = require('../server');
const {User} = require('../users/');
const {JWT_SECRET, TEST_DATABASE_URL} = require('../config');

const should = chai.should();
chai.use(chaiHttp);

describe('Auth endpoints', function() {
	const username = 'goku_rulz';
	const password = 'SPIRITBOMB!';
	const firstName = 'Son';
	const lastName = 'Goku';

	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function() {
		return User.hashPassword(password).then(password => 
			User.create({
				username,
				password,
				firstName,
				lastName
			})
		);
	});

	afterEach(function() {
		return User.remove({});
	});

	after(function() {
		return closeServer();
	});

	describe('API auth Login endpoint', function() {
		it('should reject requests with no credentials', function() {
			return chai.request(app)
				.post('/api/auth/login')
				.catch(err => {
					const res = err.response;
					res.should.have.status(401);
				});
		});
		it('should reject requests with incorrect username', function() {
			return chai.request(app)
				.post('/api/auth/login')
				.auth('wrongUsername', password)
				.catch(err => {
					const res = err.response;
					res.should.have.status(401);
				});
		});
		it('should reject requests with incorrect password', function() {
			return chai.request(app)
				.post('/api/auth/login')
				.auth(username, 'wrongPassword')
				.catch(err => {
					const res = err.response;
					res.should.have.status(401);
				});
		});
		it('should return a valid jwt', function() {
			return chai.request(app)
				.post('/api/auth/login')
				.auth(username, password)
				.then(res => {
					res.should.have.status(200);
					res.body.should.be.an('object');
					const token = res.body.authToken;
					token.should.be.a('string');
					const payload = jwt.verify(token, JWT_SECRET, {algorithm: ["HS256"]});
					payload.user.should.deep.equal({
						username,
						firstName,
						lastName
					});
				});
		});
	});

	describe('API auth refresh endpoint', function() {
		it('should reject requests with no credentials', function() {
			return chai.request(app)
				.post('/api/auth/refresh')
				.catch(err=> {
					const res = err.response;
					res.should.have.status(401);
				});
		});

		it('should reject requests with invalid token', function() {
			const token = jwt.sign({
				username,
				firstName,
				lastName
			}, 'wrongSecret', {
				algorithm: 'HS256',
				expiresIn: '1d'
			});
			return chai.request(app)
				.post(`/api/auth/refresh?jwt=${token}`)
				.catch(err => {
					const res = err.response;
					res.should.have.status(401);
				});
		});
		it('should reject requests with expired token', function() {
			const token = jwt.sign({
				user: {
					username,
					firstName,
					lastName
				},
				exp: Math.floor(Date.now() / 1000) - 10 // Expired ten seconds ago 
			}, JWT_SECRET, {
				algorithm: 'HS256',
				subject: username
			});
			return chai.request(app)
				.post(`/api/auth/refresh?jwt=${token}`)
				.catch(err => {
					const res = err.response;
					res.should.have.status(401);
				});
		});
		it('should return a valid jwt with new expiry date', function() {
			const token = jwt.sign({
				user: {
					username,
					firstName,
					lastName
				} 
			}, JWT_SECRET, {
				algorithm: 'HS256',
				subject: username,
				expiresIn: '1d'
			});
			const decode = jwt.decode(token);
			return chai.request(app)
				.post(`/api/auth/refresh?jwt=${token}`)
				.then(res => {
					res.should.have.status(200);
					res.body.should.be.an('object');
					const token = res.body.authToken;
					token.should.be.a('string');
					const payload = jwt.verify(token, JWT_SECRET, {algorithm: ["HS256"]});
					payload.user.should.deep.equal({
						username,
						firstName,
						lastName
					});
					payload.exp.should.be.at.least(decode.exp);
				});
		});
	});
});











