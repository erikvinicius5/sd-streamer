var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var users = [];
var connections = [];

var port = process.env.PORT || 3000
server.listen(port);
console.log('Listening on port ' + port);

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
  connections.push(socket);
  console.log('Viewer connected, %s online.', connections.length);

  socket.on('stream', function(image) {
    socket.broadcast.emit('stream', image);
  });

  socket.on('disconnect', function() {
    connections.splice(connections.indexOf(socket), 1);
    console.log('Viewer disconnected, %s online.', connections.length);
  });
});

