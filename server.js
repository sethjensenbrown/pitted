var express = require('express');
var app = express();
app.use(express.static('public'));

//GET request for / displays home page, search for spots here
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/home.html')
});

//GET request for /result displays results page 
//passing a location query will find spots
app.get('/results', (req, res) => {
	res.sendFile(__dirname + '/public/results.html')
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

app.listen(process.env.PORT || 8080);

module.exports = {app};