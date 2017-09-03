const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const should = chai.should();

const {app, runServer, closeServer} = require('../server');
const {SurfSpots} = require('../models');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

describe('Pitted API', function() {

	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	after(function() {
		return closeServer();
	})

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
			return chai.request(app)
					.get('/admin-menu')
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
						spot.should.have.all.keys('_id', 'name', 'state', 'location', 'difficulty', 'image_url', 'admin_id');
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
						spot.should.have.all.keys('_id', 'name', 'state', 'location', 'difficulty', 'image_url', 'admin_id');
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
						spot.should.have.all.keys('_id', 'name', 'state', 'location', 'difficulty', 'image_url', 'admin_id');
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
						spot.should.have.all.keys('_id', 'name', 'state', 'location', 'difficulty', 'image_url', 'admin_id');
						spot.location.should.have.all.keys('type', 'coordinates');
						spot.location.type.should.equal('Point');
						spot.state.should.equal('CA');
					})
				})
		})
	})
})
