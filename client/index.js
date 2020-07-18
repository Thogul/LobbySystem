var express = require('express');
var app = express()
var http = require('http').createServer(app);

app.use(express.static("src"))
http.listen(3000, () => {
  console.log('listening on *:3000');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/index.html');
});


// to run: install node.js and run "npm install" in the client folder to install dependencies then "node index.js" to run the webserver to host the site