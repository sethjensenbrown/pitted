var express = require('express');
var app = express();
app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
  res.status(200);
});

app.listen(process.env.PORT || 8080, () => {
	console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});

module.exports = {app};