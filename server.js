var express = require('express');
var app = express();
app.use(express.static('public'));
const port = process.env.PORT || 8080; 

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/index.html');
  res.status(200);
});

app.listen(port);
//app.set('port', (process.env.PORT || 3000)); 

/*app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port')); 
});*/

module.exports = {app};