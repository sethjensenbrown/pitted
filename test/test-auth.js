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

	
});











