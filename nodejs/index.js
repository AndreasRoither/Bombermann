 /*// sending to sender-client only
socket.emit('message', "this is a test");

// sending to all clients, include sender
io.emit('message', "this is a test");

// sending to all clients except sender
socket.broadcast.emit('message', "this is a test");

// sending to all clients in 'game' room(channel) except sender
socket.broadcast.to('game').emit('message', 'nice game');

// sending to all clients in 'game' room(channel), include sender
io.in('game').emit('message', 'cool game');

// sending to sender client, only if they are in 'game' room(channel)
socket.to('game').emit('message', 'enjoy the game');

// sending to all clients in namespace 'myNamespace', include sender
io.of('myNamespace').emit('message', 'gg');

// sending to individual socketid
socket.broadcast.to(socketid).emit('message', 'for your eyes only');*/

 // load

 var express = require('express');
 var app = express();
 var server = require('http').createServer(app);
 var io = require('socket.io')(server);
 var port_to_listen = 4200;

 var currentdate = new Date();
 var datetime = "Start time: " + currentdate.getDate() + "/" +
     (currentdate.getMonth() + 1) + "/" +
     currentdate.getFullYear() + " @ " +
     currentdate.getHours() + ":" +
     currentdate.getMinutes() + ":" +
     currentdate.getSeconds();

 // game vars
 var games = {},
     avatars = ['BombermanBlue', 'BombermanYellow', 'BombermanGreen', 'BombermanRed', 'BombermanBlack', 'BombermanMagenta', 'BombermanShiny'];

 const ConsoleColor = require('./colorcodes.js');

 app.use(express.static(__dirname + '/node_modules'));

 app.get('/', function(req, res, next) {
     res.sendFile(__dirname + '/index.html');
 });

 io.on('connection', function(client) {
     console.log(ConsoleColor.Bright + ConsoleColor.FgGreen + '\nServer' + ConsoleColor.Reset);
     console.log('\tClient connected...\n\tid: %s', client.id);

     // socket id for connecting player
     var socketId = client.id;
     var gameID,
         userName;

     client.on('create', function(id, name, avatar, matrix) {
         console.log(ConsoleColor.Bright + ConsoleColor.FgCyan + '\nClient' + ConsoleColor.Reset);
         console.log('\t' + ConsoleColor.BgWhite + ConsoleColor.FgGreen + 'request to create game server' + ConsoleColor.Reset);
         console.log('\tplayer name ' + name);
         console.log('\tGame Server ID ' + id);

         var player = {
             id: socketId,
             name: name,
             avatar: avatar,
             index: 0,
             ready: false,
             alive: true
         };

         games[id] = {
             id: id,
             players: [player],
             matrix: matrix,
             started: false,
             created: Date.now()
         };

         gameID = id;
         userName = name;

         client.join(id);
         client.emit('game-server-created', id, player);
     });

     client.on('join', function(data) {
         console.log(ConsoleColor.Bright + ConsoleColor.FgCyan + '\nClient' + ConsoleColor.Reset);
         console.log('\t' + ConsoleColor.BgWhite + ConsoleColor.FgGreen + 'request to join game server' + ConsoleColor.Reset);
         console.log('\tplayer name: ' + data.name);
         console.log('\tgame id: ' + data.id);

         var game = games[data.id];

         if (!game) return client.emit('game-not-found');
         if (game.started) return client.emit('game-started');

         if (game && game.players.length <= 4) {
             var avatar = pickAvatar(game),
                 player = {
                     id: socketId,
                     name: data.name,
                     avatar: avatar,
                     index: pickIndex(game),
                     ready: false,
                     alive: true
                 };

             game.players.push(player);

             gameID = data.id;
             userName = data.name;

             client.join(data.id);
             client.emit('joined', player, game);

             client.broadcast.to(data.id).emit('player-joined', player);
         }
     });

     client.on('ready', function(id, isReady) {
        console.log(ConsoleColor.Bright + ConsoleColor.FgCyan + '\nClient' + ConsoleColor.Reset);
        console.log('\t' + ConsoleColor.BgWhite + ConsoleColor.FgGreen + 'player ready call' + ConsoleColor.Reset);
        console.log('\tid: ' + id);
        console.log('\tready: ' + isReady);
        
         var game = games[id];

         if (!game) {
            console.log('\tgame not found');
            console.log('\tgameId: ' + id);
            return;
         }

         var totalReady = 0;

         game.players.forEach(function(player, index) {
             if (player.id == socketId) {
                 player.ready = isReady ? true : false;

                 client.to(id).emit('ready', player.id, player.ready);
             }

             if (player.ready) totalReady++;
         });

         if (totalReady >= 1 && totalReady == game.players.length) {
             game.started = true;
             game.matrix = createMatrix();

             client.emit('game-start', game.matrix)
             client.broadcast.to(id).emit('game-start', game.matrix);
             console.log('\tgame started');
         }
     });

     client.on('move', function(id, player, position) {
         var game = games[id];

         if (!game) return;

         game.players.forEach(function(player) {
             if (player.id == socketId) {
                 player.position = position;
             }

         });
         client.broadcast.to(id).emit('move', player, position);
     });

     client.on('bomb', function(id, position) {
        client.to(id).emit('bomb', position);

         var game = games[id];

         if (!game) return;

         if (!game.started) return;

         var bombTimer = 2000,
             strength = 1;

         setTimeout(function() {
             var blown = [{
                     x: position.x,
                     y: position.y
                 },
                 {
                     x: position.x,
                     y: position.y - strength
                 },
                 {
                     x: position.x,
                     y: position.y + strength
                 },
                 {
                     x: position.x - strength,
                     y: position.y
                 },
                 {
                     x: position.x + strength,
                     y: position.y
                 }
             ];

             blown.forEach(function(spot) {
                 if (canExplode(game.matrix, spot.x, spot.y)) {
                     game.players.forEach(function(player) {
                         if (player.position.x == spot.x && player.position.y == spot.y) {
                             player.alive = false;
                             client.to(id).emit('death', player.id);
                         }

                     });
                 }

             });

             var totalAlive = 0,
                 winner;

             game.players.forEach(function(player) {
                 if (player.alive) {
                     totalAlive++;

                     winner = player;
                 }
             });

             if (totalAlive == 1) {
                 client.to(id).emit('win', winner);
             }

         }, bombTimer);

     });

     client.on('disconnect', function() {
         if (!gameID) return;

         console.log(ConsoleColor.Bright + ConsoleColor.FgRed + '\nClient' + ConsoleColor.Reset);
         var game = games[gameID];
         if (game == undefined)
         {
            console.log('\t' + ConsoleColor.BgWhite + ConsoleColor.FgRed + 'game undefined' + ConsoleColor.Reset);
            return;
         }
         console.log('\tclient ' + ConsoleColor.BgWhite + ConsoleColor.FgGreen + 'disconnected' + ConsoleColor.Reset);

         game.players.forEach(function(player, index) {
             if (player != undefined && player.id == socketId) {
                 this.splice(index, 1);

                 console.log('\tplayer name: ' + player.name);
                 console.log('\tgame id: ' + player.id);

                 client.broadcast.to(gameID).emit('left', client.id, player.name);
             }
         }, game.players);
     });

     client.on('messages', function(data) {
         console.log(ConsoleColor.Bright + ConsoleColor.FgCyan + '\nClient' + ConsoleColor.Reset);
         console.log('\tclient ' + ConsoleColor.BgWhite + ConsoleColor.FgGreen + 'message' + ConsoleColor.Reset);
         console.log('\tclient game: ' + gameID);
         var game = games[gameID];
         if (!game) {
             console.log('\tclient has no game sesion, not broadcasting message');
             return;
         }

         var playername;

         game.players.forEach(function(player, index) {
             console.log('\tPlayer ID: %s', player.id);
             if (player.id == socketId) {
                 playername = player.name
             }
         }, game.players);

         console.log('\tPlayer name: %s', playername);
         console.log('\tMessage: %s', data.message);
         console.log('\ttime: ' + data.time);
         console.log('\tbroadcasting to gameID: ' + gameID);

         client.broadcast.to(gameID).emit('player-message', data, playername);
     });
 });

 server.listen(port_to_listen, function() {
     var host = server.address().address;
     var port = server.address().port;

     console.log('\n-- Server listening --');
     console.log(datetime);
     console.log('\nApp listening at http://%s:%s', host, port);
 });

 /////////////
 // functions

 function pickAvatar(game) {

     var avatar = avatars[Math.floor(Math.random() * avatars.length)];

     game.players.forEach(function(player) {
         if (player.avatar == avatar) {
             avatar = pickAvatar(game);
         }
     });

     return avatar;
 }

 function pickIndex(game) {
     var index = 0;

     game.players.forEach(function(player) {
         if (player.index == index) {
             index++;
         }

     });

     return index;
 }

 function createMatrix() {
     var matrix = {},
         matrixSize = 9;

     var upperLimit = matrixSize - 1,
         upperLimitMinusOne = upperLimit - 1,
         empty = ['0 0', upperLimit + ' 0', '0 ' + upperLimit, upperLimit + ' ' + upperLimit, '1 0', upperLimitMinusOne + ' 0', '0 ' + upperLimitMinusOne, upperLimit + ' ' + upperLimitMinusOne, '0 1', upperLimit + ' 1', '1 ' + upperLimit, upperLimitMinusOne + ' ' + upperLimit];

     for (var x = 0; x < matrixSize; x++) {
         matrix[x] = {};

         for (var y = 0; y < matrixSize; y++) {
             var type;

             if (x % 2 == 1 && y % 2 == 1) {
                 type = 'pillar';
             } else {
                 type = Math.floor(Math.random() * 10) > 1 ? 'normal' : 'empty';
             }

             if (empty.indexOf(x + ' ' + y) > -1) {
                 type = 'empty';
             }

             matrix[x][y] = { type: type };
         }
     }

     return matrix;
}

 function canExplode(matrix, x, y) {
     if (!matrix[x]) return;

     var tile = matrix[x][y];

     return tile && (tile.type == 'pillar' ? false : true);
 }

 function getTotalReadyPlayers (game) {
    var totalReady = 0;

    game.players.forEach(function(player, index) {
        if (player.ready) totalReady++;
    });

    return totalReady;
 }

 //	cleanup

 setInterval(function() {
     for (id in games) {
         var created = games[id].created + (1000 * 60 * 60)

         if (created > Date.now()) {
             delete games[id];
         }
     }
 }, 1000 * 60 * 10);