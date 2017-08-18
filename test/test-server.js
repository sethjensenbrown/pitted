const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const {app} = require('../server');

chai.use(chaiHttp);



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