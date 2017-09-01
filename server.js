const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//forces mongoose to use es6 promises instead of it's own
mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {SurfSpots} = require('./models');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

/***********************************************************/

//GET request for / displays home page, search for spots here
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/home.html')
});

//GET request to this endpoint with query for state 
//will return JSON response with all spots in that state
//queries MUST include state parameter
app.get('/api/state/', (req, res) => {
	SurfSpots
		.find({'state': req.query.state})
		.then((results) => res.json(results))
		.catch((err) => {
			console.error(err)
			res.status(500).json({message: 'Internal server error'});
		});
});

//GET request to this endpoint with query for lat, lng, and search radius
//will return JSON response with all spots within radius of coordinates
//uses mongoDB $near query and GeoJSON points to search all spots
//queries MUST include laitude, longitude and radius parameters
app.get('/api/geo/', (req, res) => {
	SurfSpots
		.find({
			'location':
       			{ $near :
			          {
			            $geometry: { 
			            	type: "Point",  
			            	coordinates: [parseInt(req.query.longitude), parseInt(req.query.laditude)] 
			            },
			            $maxDistance: parseInt(req.query.radius)
			          }
			    }
			})
		.then((results) => res.json(results))
		.catch((err) => {
			//console.error(err)
			res.status(500).json({message: 'Internal server error'});
		});
});

//GET request for /admin displays admin login page
app.get('/admin', (req, res) => {
	res.sendFile(__dirname + '/public/admin.html')
});

//GET request for /admin-menu displays admin menu page
app.get('/admin-menu', (req, res) => {
	res.sendFile(__dirname + '/public/admin-menu.html')
});

//GET request for /editor displays spot editor page
app.get('/editor', (req, res) => {
	res.sendFile(__dirname + '/public/editor.html')
});

//GET request for /editor displays spot editor page
app.get('/add', (req, res) => {
	res.sendFile(__dirname + '/public/add.html')
});

/************************************************************/

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};