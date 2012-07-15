var testip = "8.8.8.8";
var timeoutlim = 200;
var pinginterval = 500;
var port = 80;

var dns = require('dns');
var http = require('http');
var ok = true;              // connection status
var isRed = true;
var isGreen = false;

var ping = function (a) { dns.reverse(testip, function (err, domains) {
  if (err) {
    console.log("resolve error");
    ok = false;
  }
  else {
    ok = true;
  }
  clearTimeout(timer);
  })
};

var timer = {};
var pinger = function (a) {
  if (timer._idleTimeout && timer._idleTimeout != -1)  {
    // emit only if change required
    if (isGreen) {
      io.sockets.emit('change', { color: "red" });
      ok = false;
      isGreen = false;
      isRed = true;
    }
  }
     // emit only if change required and connection ok
    if (isRed && ok) {
      io.sockets.emit('change', { color: "green" });
      ok = true;
      isGreen = true;
      isRed = false;
    }
  timer = setTimeout(ping, timeoutlim); 
};

var interval = setInterval(pinger, pinginterval);

var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(80);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    
    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {
  socket.emit('hello', { shake: "ok" });
});