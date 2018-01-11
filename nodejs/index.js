/********************
*     Examples      *
*********************/

/*
// sending to sender-client only
socket.emit('message', 'this is a test');

// sending to all clients, include sender
io.emit('message', 'this is a test');

// sending to all clients except sender
socket.broadcast.emit('message', 'this is a test');

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


/********************
*  Declarations &   *
*    setting up     *
*********************/

var debug = false;
var currentOpenGameSessions = 0;
var currentConnectedSockets = 0;
var currentConnectedPlayers = 0;

const ConsoleColor = require('./colorcodes.js');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path = require('path');
var port_to_listen = 4200;

// set log interval
var logInterval = setInterval(function () {
    var tempcurrentdate = new Date();
    var tempdatetime = 'Server check at: ' + tempcurrentdate.getDate() + '/' +
    (tempcurrentdate.getMonth() + 1) + '/' +
    tempcurrentdate.getFullYear() + ' @ ' +
    tempcurrentdate.getHours() + ':' +
    tempcurrentdate.getMinutes() + ':' +
    tempcurrentdate.getSeconds();

    console.log('-- ' + tempdatetime + ' --');
    console.log(ConsoleColor.Bright + ConsoleColor.FgGreen + '\r\nServer' + ConsoleColor.Reset);
    console.log('\r\tCurrent connected sockets:  ' + currentConnectedSockets);
    console.log('\r\tCurrent open game sessions: ' + currentOpenGameSessions);
    console.log('\r\tCurrent connected players:  ' + currentConnectedPlayers + '\n\r');
}, 30000);

var currentdate = new Date();
var datetime = 'Start time: ' + currentdate.getDate() + '/' +
    (currentdate.getMonth() + 1) + '/' +
    currentdate.getFullYear() + ' @ ' +
    currentdate.getHours() + ':' +
    currentdate.getMinutes() + ':' +
    currentdate.getSeconds();

// game vars
var games = {},
    avatars = ['BombermanBlue', 'BombermanYellow', 'BombermanGreen', 'BombermanRed', 'BombermanBlack', 'BombermanMagenta', 'BombermanShiny'];

var position = {
    x: 0,
    y: 0
};

var maxMatrixDimensions = {
    width: 19,
    height: 13
};

var tileBlocks = {
    numberOfHiddenBlocks: 4,
    solid: 0,
    background: 1,
    explodeable: 2,
    BombUp: 3,
    FlameUp: 4,
    SpeedUp: 5,
    Virus: 6,
    hiddenBombUp: 7,
    hiddenFlameUp: 8,
    hiddenSpeedUp: 9,
    hiddenVirus: 10
};

var difficulty = {
    normal: 1,
    hardmode: 2
};

var modeTypes = {
    deathmatch: 1,
    closingin: 2,
    fogofwar: 3,
    virusonly: 4,
    destroytheblock: 5,
    test: 6
}

// set express folder to one above, where index.html is located
app.use(express.static(__dirname + '/../'));

/*
app.get('/', function (req, res, next) {
    res.sendFile(path.resolve(__dirname + '/../index.html'));
});*/

io.on('connection', function (client) {
    currentConnectedSockets++;

    if (debug) {
        console.log(ConsoleColor.Bright + ConsoleColor.FgGreen + '\r\nServer' + ConsoleColor.Reset);
        console.log('\r\n\tClient connected...\r\n\r\n\tid: %s', client.id);
    }

    // socket id for connecting player
    var socketId = client.id;
    var gameID,
        userName;

    client.on('create', function (id, name, avatar, difficulty, mode) {
        currentOpenGameSessions++;
        if (debug) {
            console.log(ConsoleColor.Bright + ConsoleColor.FgCyan + '\r\nClient' + ConsoleColor.Reset);
            console.log('\r\n\t' + ConsoleColor.BgWhite + ConsoleColor.FgGreen + 'request to create game server' + ConsoleColor.Reset);
            console.log('\r\n\tplayer name ' + name);
            console.log('\r\n\tGame Server ID ' + id);
            console.log('\r\n\tmode: ' + mode);
        }

        var player = {
            id: socketId,
            name: name,
            avatar: avatar,
            index: 0,
            ready: false,
            alive: true,
            startPosition: playerStartPosition(0),
            position: { x: 0, y: 0 },
            points: 0,
            kills: 0
        };

        var Blocks = {
            generatedBlocks: 0
        };

        games[id] = {
            id: id,
            players: [player],
            matrix: createMatrix(mode, Blocks),
            started: false,
            created: Date.now(),
            difficulty: difficulty,
            gameMode: mode,
            explodeableBlocks: Blocks.generatedBlocks
        };

        if (debug) console.log('\r\n\tGeneratedBlocks ' + Blocks.generatedBlocks);

        gameID = id;
        userName = name;

        client.join(id);
        client.emit('game-server-created', id, player, games[id]);
    });

    client.on('join', function (data) {
        if (debug) {
            console.log(ConsoleColor.Bright + ConsoleColor.FgCyan + '\r\nClient' + ConsoleColor.Reset);
            console.log('\r\n\t' + ConsoleColor.BgWhite + ConsoleColor.FgGreen + 'request to join game server' + ConsoleColor.Reset);
            console.log('\r\n\tplayer name: ' + data.name);
            console.log('\r\n\tgame id: ' + data.id);
            console.log('\r\n\tsocket id: ' + socketId);
        }

        var game = games[data.id];

        if (!game) return client.emit('game-not-found');
        if (game.started) return client.emit('game-started');

        var playerIndex = pickIndex(game);

        if (game && game.players.length < 4) {
            var avatar = pickAvatar(game),
                player = {
                    id: socketId,
                    name: data.name,
                    avatar: avatar,
                    index: playerIndex,
                    ready: false,
                    alive: true,
                    startPosition: playerStartPosition(playerIndex),
                    position: { x: 0, y: 0 },
                    points: 0,
                    kills: 0
                };

            game.players.push(player);

            gameID = data.id;
            userName = data.name;

            client.join(data.id);
            client.emit('joined', player, game);
            client.broadcast.to(data.id).emit('player-joined', player);
            currentConnectedPlayers++;
        }
    });

    client.on('game-finished', function(id){
        var game = games[data.id];
        if (!game) return;
        game.started = false;
    });

    client.on('player-reset', function(gameId, playerId){
        var game = games[gameId];
        if (!game) return;

        game.players.forEach(function (player, index) {
            player.kills = 0;
            player.points = 0;
            player.position.x = player.startPosition.x;
            player.position.y = player.startPosition.y;
            player.ready = false;
            player.alive = true;
        });
    });

    client.on('ready', function (id, isReady) {
        if (debug) {
            console.log(ConsoleColor.Bright + ConsoleColor.FgCyan + '\r\nClient' + ConsoleColor.Reset);
            console.log('\r\n\t' + ConsoleColor.BgWhite + ConsoleColor.FgGreen + 'player ready call' + ConsoleColor.Reset);
        }

        var game = games[id];

        if (!game) return;

        var totalReady = 0;

        game.players.forEach(function (player, index) {
            if (player.id == socketId) {
                player.ready = isReady ? true : false;

                client.to(id).emit('ready', player.id, player.ready);
            }

            if (player.ready) totalReady++;
        });

        if (totalReady >= 1 && totalReady == game.players.length) {
            game.started = true;

            client.emit('game-start', game.matrix);
            client.broadcast.to(id).emit('game-start', game.matrix);
            if (debug) console.log('\r\n\tgame started');
        }
    });

    client.on('move', function (gameId, playerId, position, imageCounter, currentDirection) {
        var game = games[gameId];
        var thePlayer;

        if (!game) return;

        game.players.forEach(function (player) {
            if (player.id == socketId) {
                player.position = position;
                thePlayer = player;
            }
        });

        client.broadcast.to(gameId).emit('player-move', thePlayer, position, imageCounter, currentDirection);
    });

    client.on('points', function(gameId, playerId, points) {
        var game = games[gameId];

        if (!game) return;
        var sumPoints = 0;
        var highestPlayer = game.players[0];

        game.players.forEach(function (player) {
            if (player.id == playerId)
                player.points = points;

            if (player.points > highestPlayer.points)
                highestPlayer = player;

            sumPoints += player.points;
        });

        if (sumPoints >= game.explodeableBlocks) {
            client.emit('dtb-win', highestPlayer);
            client.broadcast.to(gameId).emit('dtb-win', highestPlayer);
        }

        client.broadcast.to(gameId).emit('player-points', playerId, points);
    });

    client.on('death', function(gameId, playerId, bombId) {
        var game = games[gameId];

        if (!game) return;
        var totalPlayers = game.players.length;
        var deadPlayers = 0;
        var winner = game.players[0];
        var playerName;

        game.players.forEach(function (player) {
            if (player.id == playerId) {
                player.alive = false;
                playerName = player.name;
                if (debug) console.log(player.name);
            }

            if (player.alive) {
                winner = player;
            }

            if (player.id == bombId) {
                player.kills++;
                if (debug) console.log('Player Id ' + player.name + ' Player Kills' + player.kills);
            }

            if (!player.alive) {
                deadPlayers++;
            }
        });

        if (deadPlayers >= totalPlayers - 1) {
            client.emit('win', winner);
            client.broadcast.to(gameId).emit('win', winner);

            game.players.forEach(function (player, index) {
                player.kills = 0;
                player.points = 0;
                player.position.x = player.startPosition.x;
                player.position.y = player.startPosition.y;
                player.ready = false;
                player.alive = true;
            });

            game.started = false;
        }

        client.broadcast.to(gameId).emit('player-death', playerId, playerName, bombId);
    });

    client.on('bomb', function (id, bomb) {
        var game = games[id];
        if (!game) return;
        if (!game.started) return;

        client.to(id).emit('bomb', bomb);
    });

    client.on('disconnect', function () {
        if (currentConnectedPlayers > 0) currentConnectedPlayers--;
        if (currentConnectedSockets > 0) currentConnectedSockets--;

        if (!gameID) return;
        if (debug) console.log(ConsoleColor.Bright + ConsoleColor.FgRed + '\r\nClient' + ConsoleColor.Reset);

        var game = games[gameID];
        if (game == undefined) {
            if (debug) console.log('\r\n\t' + ConsoleColor.BgWhite + ConsoleColor.FgRed + 'game undefined' + ConsoleColor.Reset);
            return;
        }
        if (debug) console.log('\r\n\tclient ' + ConsoleColor.BgWhite + ConsoleColor.FgGreen + 'disconnected' + ConsoleColor.Reset);

        game.players.forEach(function (player, index) {
            if (player != undefined && player.id == socketId) {
                this.splice(index, 1);

                if (debug) {
                    console.log('\r\n\tplayer name: ' + player.name);
                    console.log('\r\n\tgame id: ' + player.id);
                }

                client.broadcast.to(gameID).emit('left', client.id, player.name);
            }
        }, game.players);

        if (debug) console.log('\r\nConnected players: ' + game.players.length);

        if (game.players.length == 0) {
            if (currentOpenGameSessions > 0) currentOpenGameSessions--;
        }
    });

    client.on('messages', function (data) {
        var game = games[gameID];
        if (!game) {
            return;
        }

        var playername;

        game.players.forEach(function (player, index) {
            if (player.id == socketId) {
                playername = player.name
            }
        }, game.players);

        client.broadcast.to(gameID).emit('player-message', data, playername);
    });
});

/********************
*  Helper functions *
*********************/

function pickAvatar(game) {

    var avatar = avatars[Math.floor(Math.random() * avatars.length)];

    game.players.forEach(function (player) {
        if (player.avatar == avatar) {
            avatar = pickAvatar(game);
        }
    });

    return avatar;
}

function pickIndex(game) {
    var index = 0;

    game.players.forEach(function (player) {
        if (player.index == index) {
            index++;
        }
    });
    return index;
}

function createMatrix(gamemode, Blocks) {

    var dimensions = {
        width: 19,
        height: 13
    };

    var matrix = new Array();
    var blockSet = false;

    //Chances for Deathmatch
    var bombChance  = 0.08;
    var flameChance = 0.08;
    var speedChance = 0.08;
    var virusChance = 0.02;
    var emptyChance = 0.3;

    switch(gamemode) {
        case modeTypes.destroytheblock:
            emptyChance = 0.9;
            bombChance  = 0.01;
            flameChance = 0.01;
            speedChance = 0.01;
            virusChance = 0.01;
            break;
        case modeTypes.test:
            emptyChance = 0.99;
            bombChance  = 0.01;
            flameChance = 0.01;
            speedChance = 0.01;
            virusChance = 0.01;
            break;
    }
    
    for (var i = 0; i < dimensions.height; i++) {
        matrix[i] = new Array();
        for (var j = 0; j < dimensions.width; j++) {
            matrix[i][j] = tileBlocks.background;
        }
    }

    // top & bottom wall
    for (var i = 0; i < dimensions.width; i++) {
        matrix[0][i] = 0;
        matrix[dimensions.height-1][i] = tileBlocks.solid;
    }

    // side wall
    for (var i = 0; i < dimensions.height; i++) {
        matrix[i][0] = 0;
        matrix[i][dimensions.width-1] = tileBlocks.solid;
    }

    // wall every two pos
    for (var i = 2; i < dimensions.height - 2; i += 2) {
        for (var j = 2; j < dimensions.width - 2; j += 2) {
            matrix[i][j] = tileBlocks.solid;
        }
    }

    // random blocks
    for (var i = 1; i < dimensions.height - 1; i++) {
        for (var j = 1; j < dimensions.width - 1; j++) {
            if (matrix[i][j] != 0){
                var block = Math.random();

                if (gamemode == modeTypes.virusonly) {
                    if (block > 0.70) {
                        matrix[i][j] = tileBlocks.hiddenVirus;
                        blockSet = true;
                    }
                }
                else {
                    if (block > (1 - speedChance)) {
                        matrix[i][j] = tileBlocks.hiddenSpeedUp;
                        blockSet = true;
                    }
                    else if (block > (1 - speedChance - virusChance)) {
                        matrix[i][j] = tileBlocks.hiddenVirus;
                        blockSet = true;
                    }
                    else if (block > (1 - speedChance - virusChance - flameChance)) {
                        matrix[i][j] = tileBlocks.hiddenFlameUp;
                        blockSet = true;
                    }
                    else if (block > (1 - speedChance - virusChance - flameChance - bombChance)) {
                        matrix[i][j] = tileBlocks.hiddenBombUp;
                        blockSet = true;
                    }
                }

                if (!blockSet) {
                    if (block > emptyChance) {
                        matrix[i][j] = tileBlocks.explodeable;
                    }
                    else {
                        matrix[i][j] = tileBlocks.background;
                    }
                }
                blockSet = false;
            }
        }
    }

    // make sure players can actually move
    // player 1
    matrix[1][1]=1;
    matrix[1][2]=1;
    matrix[2][1]=1;

    // player 2
    matrix[1][16]=1;
    matrix[1][17]=1;
    matrix[2][17]=1;

    // player 3
    matrix[10][1]=1;
    matrix[11][1]=1;
    matrix[11][2]=1;

    // player 4
    matrix[11][16]=1;
    matrix[11][17]=1;
    matrix[10][17]=1;

    var count = 0;
    var sum = 0;

    for (var i = 1; i < dimensions.height; i++) {
        for (var j = 1; j < dimensions.width; j++) {
            if (!(matrix[i][j] == 1 || matrix[i][j] == 0))
                count++;
        }
        sum += count;
        count = 0;
    }

    Blocks.generatedBlocks = sum;
    if (debug) console.log('\r\n\tGenereated Blocks' + Blocks.generatedBlocks);
    return matrix;
}

function getTotalReadyPlayers(game) {
    var totalReady = 0;

    game.players.forEach(function (player, index) {
        if (player.ready) totalReady++;
    });

    return totalReady;
}

function playerStartPosition(index) {
    var pos = {
        x: 0,
        y: 0
    };

    switch (index) {
        case 0:
            pos.x = 1;
            pos.y = 1;
            break;
        case 1:
            pos.x = maxMatrixDimensions.width - 2;
            pos.y = 1;
            break;
        case 2:
            pos.x = 1;
            pos.y = maxMatrixDimensions.height - 2;
            break
        case 3:
            pos.x = maxMatrixDimensions.width - 2;
            pos.y = maxMatrixDimensions.height - 2;
            break
        case 4:
            pos.x = (maxMatrixDimensions.width - 2) / 2;
            pos.y = (maxMatrixDimensions.height - 2) / 2;
            break;
        case 5:
            pos.x = (maxMatrixDimensions.width - 2) / 4;
            pos.y = (maxMatrixDimensions.height - 2) / 2;
            break;
    }
    return pos;
}

// delete game sessions
setInterval(function () {
    for (id in games) {
        var created = games[id].created + (1000 * 60 * 60)

        if (created > Date.now()) {
            delete games[id];
        }
    }
}, 1000 * 60 * 10);

/********************
*   Start Server    *
*********************/

server.listen(port_to_listen, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('\r\n-- Server listening --');
    console.log(datetime);
    console.log('\r\nApp listening at http://%s:%s', host, port + '\n\r');
});