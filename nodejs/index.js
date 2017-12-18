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

var position = {
    x: 0,
    y: 0
};

var maxMatrixDimensions = {
    width: 19,
    height: 13
};

var tileBlocks = {
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
    destroytheblock: 5
}

const ConsoleColor = require('./colorcodes.js');

app.use(express.static(__dirname + '/node_modules'));

app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (client) {
    console.log(ConsoleColor.Bright + ConsoleColor.FgGreen + '\r\nServer' + ConsoleColor.Reset);
    console.log('\r\n\tClient connected...\r\n\r\n\tid: %s', client.id);

    // socket id for connecting player
    var socketId = client.id;
    var gameID,
        userName;

    client.on('create', function (id, name, avatar, difficulty, mode) {
        console.log(ConsoleColor.Bright + ConsoleColor.FgCyan + '\r\nClient' + ConsoleColor.Reset);
        console.log('\r\n\t' + ConsoleColor.BgWhite + ConsoleColor.FgGreen + 'request to create game server' + ConsoleColor.Reset);
        console.log('\r\n\tplayer name ' + name);
        console.log('\r\n\tGame Server ID ' + id);

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

        console.log('\r\n\tmode: ' + mode);

        var generatedBlocks = 0;

        games[id] = {
            id: id,
            players: [player],
            matrix: createMatrix(mode, generatedBlocks),
            started: false,
            created: Date.now(),
            difficulty: difficulty,
            gameMode: mode,
            explodeableBlocks: generatedBlocks
        };

        console.log("GeneratedBlocks " + generatedBlocks);

        gameID = id;
        userName = name;

        client.join(id);
        client.emit('game-server-created', id, player, games[id]);
    });

    client.on('join', function (data) {
        console.log(ConsoleColor.Bright + ConsoleColor.FgCyan + '\r\nClient' + ConsoleColor.Reset);
        console.log('\r\n\t' + ConsoleColor.BgWhite + ConsoleColor.FgGreen + 'request to join game server' + ConsoleColor.Reset);
        console.log('\r\n\tplayer name: ' + data.name);
        console.log('\r\n\tgame id: ' + data.id);

        var game = games[data.id];

        if (!game) return client.emit('game-not-found');
        if (game.started) return client.emit('game-started');

        var playerIndex = pickIndex(game);

        if (game && game.players.length <= 4) {
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
        }
    });

    client.on('ready', function (id, isReady) {
        console.log(ConsoleColor.Bright + ConsoleColor.FgCyan + '\r\nClient' + ConsoleColor.Reset);
        console.log('\r\n\t' + ConsoleColor.BgWhite + ConsoleColor.FgGreen + 'player ready call' + ConsoleColor.Reset);

        var game = games[id];

        if (!game) {
            console.log('\r\n\tgame not found');
            console.log('\r\n\tgameId: ' + id);
            return;
        }

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
            console.log('\r\n\tgame started');
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
        var highestPoints = game.players[0];

        game.players.forEach(function (player) {
            if (player.id == socketId) {
                player.points = points;
            }

            if (player.points > highestPoints.points) {
                highestPoints = player;
            }

            sumPoints += player.points;
        });

        if (sumPoints >= game.generatedBlocks) {
            client.emit('dtb-win', game.matrix);
            client.broadcast.to(gameId).emit('dtb-win', highestPoints.id, points);
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
            if (player.id == socketId) {
                player.isAlive = false;
                deadPlayers++;
                playerName = player.name;
            }

            if (player.isAlive) {
                winner = player;
            }

            if (player.id == bombId) {
                player.kills++;
            }
        });

        console.log(winner.name);

        if (deadPlayers >= totalPlayers - 1) {
            client.emit('win', winner);
            client.broadcast.to(gameId).emit('win', winner);
        }

        client.broadcast.to(gameId).emit('player-death', playerId, playerName);
    });

    client.on('bomb', function (id, bomb) {
        var game = games[id];
        if (!game) return;
        if (!game.started) return;

        client.to(id).emit('bomb', bomb); /*

        var bombTimer = 2000,
            strength = 1;

        setTimeout(function () {
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

            blown.forEach(function (spot) {
                if (canExplode(game.matrix, spot.x, spot.y)) {
                    game.players.forEach(function (player) {
                        if (player.position.x == spot.x && player.position.y == spot.y) {
                            player.alive = false;
                            client.to(id).emit('death', player.id);
                        }
                    });
                }
            });

            var totalAlive = 0,
                winner;

            game.players.forEach(function (player) {
                if (player.alive) {
                    totalAlive++;

                    winner = player;
                }
            });

            if (totalAlive == 1) {
                client.to(id).emit('win', winner);
            }
        }, bombTimer); */
    });

    client.on('disconnect', function () {
        if (!gameID) return;
        console.log(ConsoleColor.Bright + ConsoleColor.FgRed + '\r\nClient' + ConsoleColor.Reset);

        var game = games[gameID];
        if (game == undefined) {
            console.log('\r\n\t' + ConsoleColor.BgWhite + ConsoleColor.FgRed + 'game undefined' + ConsoleColor.Reset);
            return;
        }
        console.log('\r\n\tclient ' + ConsoleColor.BgWhite + ConsoleColor.FgGreen + 'disconnected' + ConsoleColor.Reset);

        game.players.forEach(function (player, index) {
            if (player != undefined && player.id == socketId) {
                this.splice(index, 1);

                console.log('\r\n\tplayer name: ' + player.name);
                console.log('\r\n\tgame id: ' + player.id);

                client.broadcast.to(gameID).emit('left', client.id, player.name);
            }
        }, game.players);
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

server.listen(port_to_listen, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('\r\n-- Server listening --');
    console.log(datetime);
    console.log('\r\nApp listening at http://%s:%s', host, port);
});

/////////////
// functions

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

function createMatrix(gamemode, generatedBlocks) {
    
    var dimensions = {
        width: 19,
        height: 13
    };

    var matrix = new Array();
    
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
    for (var i = 2; i < dimensions.height-2; i+=2) {
        for (var j = 2; j < dimensions.width-2; j+=2) {
            matrix[i][j] = tileBlocks.solid;
        }
    }

    var bomb  = 0;
    var flame = 0;
    var speed = 0;
    var explo = 0;
    var empty = 0;
    var virus = 0;
    var blockSet = false;

    //Chances for Deathmatch
    var bombChance  = 0.08;
    var flameChance = 0.08;
    var speedChance = 0.08;
    var virusChance = 0.02;
    var emptyChance = 0.1;

    // random blocks
    for (var i = 1; i < dimensions.height-1; i++) {
        for (var j = 1; j < dimensions.width-1; j++) {
            if (matrix[i][j] != 0){
                var block = Math.random();

                if (gamemode == modeTypes.virusonly) {
                    if (block > 0.70) {
                        matrix[i][j] = tileBlocks.hiddenVirus;
                        virus++;
                        blockSet = true;
                    }
                }
                else {
                    if (block > 1 - speedChance) {
                        matrix[i][j] = tileBlocks.hiddenSpeedUp;
                        speed++;
                        blockSet = true;
                    }
                    else if (block > (1 - speedChance) - virusChance) {
                        matrix[i][j] = tileBlocks.hiddenVirus;
                        virus++;
                        blockSet = true;
                    }
                    else if (block > ((1 - speedChance) - virusChance) - flameChance) {
                        matrix[i][j] = tileBlocks.hiddenFlameUp;
                        flame++;
                        blockSet = true;
                    }
                    else if (block > (((1 - speedChance) - virusChance) - flameChance) - bombChance) {
                        matrix[i][j] = tileBlocks.hiddenBombUp;
                        bomb++;
                        blockSet = true;
                    }
                }

                if (!blockSet) {
                    if (block > emptyChance) {
                        matrix[i][j] = tileBlocks.explodeable;
                        explo++;
                    }
                    else {
                        matrix[i][j] = tileBlocks.background;
                        empty++;
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

    console.log('\nrandomly generated:\nbombs: ', bomb, '\nflame: ', flame, '\nspeed: ', speed, '\nexplo: ', explo, '\nvirus: ', virus, '\nempty: ', empty);
    generatedBlocks = explo;
    return matrix;
}

function canExplode(matrix, x, y) {
    if (!matrix[x]) return;

    var tile = matrix[x][y];

    return tile && (tile.type == 'pillar' ? false : true);
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

//	cleanup

setInterval(function () {
    for (id in games) {
        var created = games[id].created + (1000 * 60 * 60)

        if (created > Date.now()) {
            delete games[id];
        }
    }
}, 1000 * 60 * 10);