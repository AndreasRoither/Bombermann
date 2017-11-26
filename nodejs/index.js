// load

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

// game vars
var games = {},
    avatars = ['Bomberman'];

const ConsoleColor = require('./colorcodes.js');

app.use(express.static(__dirname + '/node_modules'));

app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(client) {
    console.log(ConsoleColor.Bright + ConsoleColor.FgGreen + '\nServer' + ConsoleColor.Reset);
    console.log('\n\tPlayer connected...\n\tid: %s', client.id);

    // socket id for connecting player
    var socketId = socket.id;
    var gameID,
        userName;

    socket.on('create', function(id, name, avatar, matrix){
        var player = {
            id: socketId,
            name: name,
            avatar: avatar,
            index: 0,
            ready: false,
            alive: true
        };

        games[i] = {
            id: id,
            players: [player],
            matrix: matrix,
            started: false,
            created: Date.now()
        };

        gameID = id;
        userName = name;

        socket.join(id);
        socket.emit('welcome', id, player);
    });

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