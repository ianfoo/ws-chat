// Simple socket.io chat server.

var http = require('http');
var url = require('url');
var fs = require('fs');

var port = process.env.PORT || 3000;
var sockets = [];

var server = http.createServer(function(req, res) {
  var reqUrl = url.parse(req.url);
  var path = reqUrl.path === '/' ? '/index.html' : reqUrl.path;
  res.sendFile(__dirname + path);
});  

var io = require('socket.io')(server);

http.ServerResponse.prototype.sendFile = function(filename) {
  var fstr, code, res = this;
  fstr = fs.createReadStream(filename);
  fstr.pipe(res);
  fstr.on('error', function(err) {
    code = (err.code === 'ENOENT') ? 404 : 500; 
    res.statusCode = code;
    res.end('<h1>' + code + ' ' + http.STATUS_CODES[code] + '</h1>');
  });
}

io.on('connection', function(socket) {
  console.log('user', socket.id, 'connected');
  sockets.push(socket);
  socket.emit('registered', { userId: socket.id });
  socket.on('message', function(message) {
    var i;
    console.log('user', socket.id, 'sent message');
    for (i = 0; i < sockets.length; i++) {
      if (sockets[i] != socket) {
        sockets[i].emit('message', message);
      }
    }
  });
  socket.on('disconnect', function() {
    console.log('user disconnected');
    sockets.splice(sockets.indexOf(socket), 1);
  });
});

server.listen(port, function() {
  console.log("Listening on *:" + port);
});

