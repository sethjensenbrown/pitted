var express = require('express');
var app = express();
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/home.html')
});

app.get('/admin', (req, res) => {
	res.sendFile(__dirname + '/public/admin.html')
});

app.listen(process.env.PORT || 8080);

module.exports = {app};