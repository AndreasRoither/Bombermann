var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const ConsoleColor = require('./colorcodes.js');

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
    console.log(ConsoleColor.Bright + ConsoleColor.FgGreen + '\nServer' + ConsoleColor.Reset);
    console.log('\n\tClient connected...\n\tid: %s', client.id);

    client.on('join', function(data) {
        console.log(ConsoleColor.Bright + ConsoleColor.FgCyan + '\nClient' + ConsoleColor.Reset);
        console.log('\n\tclient ' + ConsoleColor.BgWhite + ConsoleColor.FgGreen + 'joined' + ConsoleColor.Reset);
        console.log('\tIP Address: ' + data);
    });

    client.on('messages', function(data) {
        console.log(ConsoleColor.Bright + ConsoleColor.FgGreen + '\nClient' + ConsoleColor.Reset);
        console.log('\n\tclient ' + ConsoleColor.BgWhite + ConsoleColor.FgGreen + 'message' + ConsoleColor.Reset + '\tMessage: %s', data);

        client.emit('broad', data);
        client.broadcast.emit('broad', data);
    });
});

server.listen(4200, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('\n-- Server listening --');
    console.log(datetime);
    console.log('\nApp listening at http://%s:%s', host, port);
});