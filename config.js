exports.DATABASE_URL = (process.env.DATABASE_URL ||
					   global.DATABASE_URL ||
					   'mongodb://master-admin:rbr49125rbr!@ds036577.mlab.com:36577/pitted');
exports.TEST_DATABASE_URL = (process.env.TEST_DATABASE_URL ||
							'mongodb://master-admin:rbr49125rbr!@ds036577.mlab.com:36577/test-pitted');
exports.PORT = (process.env.PORT || 8080);