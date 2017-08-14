const chai = require('chai');
const chaiHttp = require('chai-http');
var server = require('../server.js');
var should = chai.should();
var app = server.app;

chai.use(chaiHttp);



describe('server', function() {

	it('should return 200', function() {
		return chai.request(app)
				.get('/')
				.then(function(res) {
					res.should.have.status(200);
					res.should.be.html;
				})
	})

})