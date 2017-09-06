const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const should = chai.should();

const {app, runServer, closeServer} = require('../server');
const {User} = require('../users/');
const {SurfSpots} = require('../models');
const {JWT_SECRET, TEST_DATABASE_URL} = require('../config');
const {TEST_SPOTS_SEED_DATA} = require('../TEST_SPOTS_SEED_DATA');

chai.use(chaiHttp);

function seedBlogPostData() {
	console.log('seeding blog post data');
	SurfSpots.insertMany(TEST_SPOTS_SEED_DATA);
	return SurfSpots.ensureIndexes();
};

function tearDownDb() {
	console.warn('deleting database');
	return mongoose.connection.dropDatabase();
};

describe('Pitted dynamic API endpoints', function() {
	const username = 'goku_rulz';
	const password = 'SPIRITBOMB!';
	const firstName = 'Son';
	const lastName = 'Goku';

	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function() {
		seedBlogPostData();
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
		tearDownDb();
		return User.remove({});
	});

	after(function() {
		return closeServer();
	});

	describe('state search endpoint', function() {
		it('should return all spots in MI', function() {
			return chai.request(app)
				.get('/api/state?state=MI')
				.then(function(_res) {
					res = _res;
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a('array');
					res.body.should.have.lengthOf(5);
					res.body.forEach(function(spot) {
						spot.should.be.a('object');
						spot.should.have.all.keys('__v', '_id', 'name', 'state', 'location', 'difficulty', 'image_url', 'admin_id');
						spot.location.should.have.all.keys('type', 'coordinates');
						spot.location.type.should.equal('Point');
						spot.state.should.equal('MI');
					})
				})
		})

		it('should return all spots in CA', function() {
			return chai.request(app)
				.get('/api/state?state=CA')
				.then(function(_res) {
					res = _res;
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a('array');
					res.body.should.have.lengthOf(5);
					res.body.forEach(function(spot) {
						spot.should.be.a('object');
						spot.should.have.all.keys('__v', '_id', 'name', 'state', 'location', 'difficulty', 'image_url', 'admin_id');
						spot.location.should.have.all.keys('type', 'coordinates');
						spot.location.type.should.equal('Point');
						spot.state.should.equal('CA');
					})
				})
		})
	})

	describe('zip code search endpoint', function() {
		it('should find spots near Bethany Beach, MI', function() {
			return chai.request(app)
				.get('/api/geo?laditude=41.8989487&longitude=-86.59053709999999&radius=402250')
				.then(function(_res) {
					res = _res;
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a('array');
					res.body.should.have.lengthOf(5);
					res.body.forEach(function(spot) {
						spot.should.be.a('object');
						spot.should.have.all.keys('__v', '_id', 'name', 'state', 'location', 'difficulty', 'image_url', 'admin_id');
						spot.location.should.have.all.keys('type', 'coordinates');
						spot.location.type.should.equal('Point');
						spot.state.should.equal('MI');
					})
				})
		})

		it('should find spots near Pasadena, CA', function() {
			return chai.request(app)
				.get('/api/geo?laditude=34.1657707&longitude=-118.1181199&radius=402250')
				.then(function(_res) {
					res = _res;
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a('array');
					res.body.should.have.lengthOf(5);
					res.body.forEach(function(spot) {
						spot.should.be.a('object');
						spot.should.have.all.keys('__v', '_id', 'name', 'state', 'location', 'difficulty', 'image_url', 'admin_id');
						spot.location.should.have.all.keys('type', 'coordinates');
						spot.location.type.should.equal('Point');
						spot.state.should.equal('CA');
					})
				})
		})
	})

	describe ('API POST endpoint', function() {
		it('should add a new surf spot to the database', function() {
			const newSurfSpot = {
				name: "Dope Test Spot",
				difficulty: "Chill",
				state: "MI",
				location: {
					type: "Point",
					coordinates: [-86.484375, 42.10637370579324]
				},
				admin_id: "test-admin",
				image_url: "http://landlockedsurfing.com/wp-content/uploads/2016/02/cropped-423718_311372172260334_189033544_n.jpg"
			}
			return chai.request(app)
				.post('/api/add')
				.send(newSurfSpot)
				.then(function(res) {
					res.should.have.status(201);
					res.should.be.json;
					res.body.should.be.a('object');
					res.body.should.have.all.keys('__v', '_id', 'name', 'state', 'location', 'difficulty', 'image_url', 'admin_id');
					res.body.location.should.have.all.keys('type', 'coordinates');
					res.body.name.should.equal(newSurfSpot.name);
					res.body.difficulty.should.equal(newSurfSpot.difficulty);
					res.body.state.should.equal(newSurfSpot.state);
					res.body.admin_id.should.equal(newSurfSpot.admin_id);
					res.body.image_url.should.equal(newSurfSpot.image_url);
					res.body.location.type.should.equal(newSurfSpot.location.type);
					res.body.location.coordinates[0].should.equal(newSurfSpot.location.coordinates[0]);
					res.body.location.coordinates[1].should.equal(newSurfSpot.location.coordinates[1]);
					res.body._id.should.not.be.null;
					return SurfSpots.findById(res.body._id);
				})
				.then(function(spot) {
					spot.name.should.equal(newSurfSpot.name);
					spot.difficulty.should.equal(newSurfSpot.difficulty);
					spot.state.should.equal(newSurfSpot.state);
					spot.admin_id.should.equal(newSurfSpot.admin_id);
					spot.image_url.should.equal(newSurfSpot.image_url);
					spot.location.type.should.equal(newSurfSpot.location.type);
					spot.location.coordinates[0].should.equal(newSurfSpot.location.coordinates[0]);
					spot.location.coordinates[1].should.equal(newSurfSpot.location.coordinates[1]);
				})
		})
	})

	describe('API PUT endpoint', function() {
		it('should update an existing spot', function () {
			const updateData = {
				name: 'Wait... THIS is the spot name!',
				difficulty: 'EXTREME!',
				state: 'LA',
				image_url: 'www.thatotherimage.com',
				location: {
					type: 'Point',
					coordinates: [10,10]
				}
			};

			return SurfSpots
			.findOne()
			.then(function(spot) {
				updateData._id = spot._id;
				return chai.request(app)
					.put(`/api/edit/${spot._id}`)
					.send(updateData);
			})
			.then(function(res) {
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.all.keys('__v', '_id', 'name', 'state', 'location', 'difficulty', 'image_url', 'admin_id');
				res.body.location.should.have.all.keys('type', 'coordinates');
				res.body.name.should.equal(updateData.name);
				res.body.difficulty.should.equal(updateData.difficulty);
				res.body.state.should.equal(updateData.state);
				res.body.image_url.should.equal(updateData.image_url);
				res.body.location.type.should.equal(updateData.location.type);
				res.body.location.coordinates[0].should.equal(updateData.location.coordinates[0]);
				res.body.location.coordinates[1].should.equal(updateData.location.coordinates[1]);
			})
		})
	})

	describe('API DELETE endpoint', function() {
		it('should delete a surf spot', function() {
			let deleteID;
			return SurfSpots
				.findOne()
				.then(function(spot) {
					deleteID = spot._id
					return chai.request(app)
						.delete(`/api/delete/${deleteID}`)
				})
				.then(function(res) {
					res.should.have.status(204);
					return SurfSpots.findById(deleteID);
				})
				.then(function(nonSpot) {
					should.not.exist(nonSpot);
				});
		})
	})

});



describe('Pitted static pages endpoints', function() {
	const username = 'goku_rulz';
	const password = 'SPIRITBOMB!';
	const firstName = 'Son';
	const lastName = 'Goku';

	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function() {
		seedBlogPostData();
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
		tearDownDb();
		return User.remove({});
	});

	after(function() {
		return closeServer();
	});

	describe('home page', function() {
		it('should get an html response', function() {
			return chai.request(app)
					.get('/')
					.then(function(res) {
						res.should.have.status(200);
						res.should.be.html;
					})
		})
	})

	describe('admin page', function() {
		it('should get an html response', function() {
			return chai.request(app)
					.get('/admin')
					.then(function(res) {
						res.should.have.status(200);
						res.should.be.html;
					})
		})
	})

	describe('admin menu page', function() {
		it('should get an html response', function() {
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
			return chai.request(app)
					.get(`/admin-menu?jwt=${token}`)
					.then(function(res) {
						res.should.have.status(200);
						res.should.be.html;
					})
		})
	})

	describe('editor page', function() {
		it('should get an html response', function() {
			return chai.request(app)
					.get('/editor')
					.then(function(res) {
						res.should.have.status(200);
						res.should.be.html;
					})
		})
	})

	describe('add page', function() {
		it('should get an html response', function() {
			return chai.request(app)
					.get('/add')
					.then(function(res) {
						res.should.have.status(200);
						res.should.be.html;
					})
		})
	})
})
