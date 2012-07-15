var webSocket = socketIO.listen(httpServer);
webSocket.on('connection', function(client) {
    client.send('no');
});