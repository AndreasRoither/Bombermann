var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var currentdate = new Date();
var datetime = "Start time: " + currentdate.getDate() + "/" +
    (currentdate.getMonth() + 1) + "/" +
    currentdate.getFullYear() + " @ " +
    currentdate.getHours() + ":" +
    currentdate.getMinutes() + ":" +
    currentdate.getSeconds();

app.use(express.static(__dirname + '/node_modules'));

app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(client) {
    console.log('\x1b[1m\x1b[32m%s\x1b[0m', '\nServer');
    console.log('\n\tClient connected...\n\tid: %s', client.id);

    client.on('join', function(data) {
        console.log('\x1b[1m\x1b[36m%s\x1b[0m', '\nClient');
        console.log(' \n\tclient message\tMessage: %s', data);
    });

    client.on('messages', function(data) {
        client.emit('broad', data);
        client.broadcast.emit('broad', data);
    });
});



server.listen(4200, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log(host);

    console.log('\n-- Server listening --');
    console.log(datetime);
    console.log('\nApp listening at http://%s:%s', host, port);
});