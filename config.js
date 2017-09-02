exports.DATABASE_URL = (process.env.DATABASE_URL ||
					   global.DATABASE_URL ||
					   'mongodb://master-admin:rbr49125rbr!@ds036577.mlab.com:36577/pitted');
exports.TEST_DATABASE_URL = (process.env.TEST_DATABASE_URL ||
							'mongodb://admin:testpass1@ds036577.mlab.com:36577/test-data');
exports.PORT = (process.env.PORT || 8080);