
// connect
var socket = io.connect('http://localhost:4200/');
var currentlyConnected = false;
var gameId = 0;

socket.on('connect', function() {
    currentlyConnected = true;
    change_infobar("Connected to the Server");
});

socket.on('disconnect', function() {
    currentlyConnected = false;
    change_infobar("You are disconnected");
});

socket.on('connect_failed', function() {
    currentlyConnected = false;
    change_infobar("Connection failed");
});

socket.on('error', function() {
    currentlyConnected = false;
    change_infobar("Connection error");
});

socket.io.on("connect_error", function () {
    currentlyConnected = false;
    change_infobar("Server not available");
});

socket.on('game-server-created', function (id, player, game) {
    closePopup();
    gameId = id;

    var player_container = "<li><div id=\"playercontainer" + player.id + "\" class=\"msg-container player-container\"><img src=\"img/Bomberman/Front/Bman_F_f00.png\" alt=\"Avatar\" style=\"width:10%;\">";
    player_container += "<label class=\"switch\" style=\"float:right; margin-top:10px; margin-left: 10px;\"><input id=\"checkbox\" type=\"checkbox\" onclick=\"onSwitchToggle()\"><span class=\"slider round\"></span></label>";
    player_container += "<p><span id=\"playerReady\" class=\"player-status not-ready\">not ready</span></p>" + "<p>" + decodeURIComponent(player.name) + "</div></li>";
    $("#players").append(player_container).load();

    botmsg = {
        message: "Your game server has been created, have fun playing!",
        message2: "Game Server ID: " + id,
        message3: "Every player has to be ready in order for the game to start ;)"
    };

    var bot_message_container = "<li><div class=\"msg-container player-container\"><img src=\"img/Bomberman/Front/Bman_F_f00.png\" alt=\"Avatar\" class=\"left\" style=\"width:10%;\">";
    bot_message_container += "<p>" + botmsg.message + "</p><p>" + botmsg.message2 + "</p></div></li>";

    var bot_message_container2 = "<li><div class=\"msg-container player-container\"><img src=\"img/Bomberman/Front/Bman_F_f00.png\" alt=\"Avatar\" class=\"left\" style=\"width:10%;\">";
    bot_message_container2 += "<p>" + botmsg.message3 + "</p></div></li>";

    $("#playermsgcontainer").append(bot_message_container).append(bot_message_container2).load();

    startGame(player.startPosition, game.difficulty, game.gameMode);
    myBackground.map = game.matrix;
    myBackground.startMap = game.matrix;

    change_infobar("Created Game Server");
});

socket.on('game-not-found', function (id, playerInfo) {
    $("#joinErrorMsg").text("Game server not found");
});

socket.on('player-joined', function (player) {
    addPlayerToBox(player);
    change_infobar("Player " + player.name + " joined");

    var newPlayer = new playerObject(player.startPosition, player.id);
    players.players.push(newPlayer);
    players.playerCount += 1;

});

socket.on('joined', function (player, game) {
    closePopup();
    var player_container = "<li><div id=\"playercontainer" + player.id + "\" class=\"msg-container player-container\"><img src=\"img/Bomberman/Front/Bman_F_f00.png\" alt=\"Avatar\" style=\"width:10%;\">";
    player_container += "<label class=\"switch\" style=\"float:right; margin-top:10px; margin-left: 10px;\"><input id=\"checkbox\" type=\"checkbox\" onclick=\"onSwitchToggle()\"><span class=\"slider round\"></span></label>";
    player_container += "<p><span id=\"playerReady\" class=\"player-status not-ready\">not ready</span></p>" + "<p>" + decodeURIComponent(player.name) + "</div></li>";
    $("#players").append(player_container);

    botmsg = {
        message: "You successfully joined the game server, have fun playing!",
        message2: "Game Server ID: " + game.id
    };

    var bot_message_container = "<li><div class=\"msg-container player-container\"><img src=\"img/Bomberman/Front/Bman_F_f00.png\" alt=\"Avatar\" class=\"left\" style=\"width:10%;\">";
    bot_message_container += "<p>" + botmsg.message + "</p><p>" + botmsg.message2 + "</p></div></li>";

    $("#playermsgcontainer").append(bot_message_container).load();

    startGame(player.startPosition);

    myBackground.map = game.matrix;

    game.players.forEach(element => {
        if (player.id != element.id) {
            addPlayerToBox(element);
            var newPlayer = new playerObject(element.startPosition, element.id);
            players.players.push(newPlayer);
            players.playerCount += 1;
        }
    });

    gameId = game.id;

    change_infobar("Sucessfully joined the game");
});

socket.on('ready', function (id, ready) {
    var id = id + "playerReady";

    if (ready) {
        $('#' + id).removeClass("not-ready").addClass("ready").text("ready");
    }
    else {
        $('#' + id).removeClass("ready").addClass("not-ready").text("not-ready");
    }
});

socket.on('game-start', function (id, matrix) {
    gameStarted = true;
    change_infobar("Game started");

    $('#players > li > div').each(function () { 
        $(this).removeClass("stripe-1").load();
    });
});

socket.on('game-started', function () {
    change_infobar("Sorry, Game already started");
});

socket.on('game-stop', function (id, playerInfo) {

});

socket.on('player-move', function (player, position, imageCounter, currentDirection) {
    players.players.forEach(element => {
        if (element.id == player.id) {
            element.pos = position;
            element.imageCounter = imageCounter;
            element.currentDirection = currentDirection;
            element.layerDirty = true;
        }
    });
});

socket.on('player-points', function(playerId, points) {
    players.players.forEach(element => {
        if (element.id == playerId) {
            element.stats.points = points;
        }
    });
});

// destroy the block
socket.on('dtb-win', function (winner) {
    botmsg = {
        message: "And the winner is: " + winner.name,
        message2: "Points: " + winner.points
    };

    var bot_message_container = "<li><div class=\"msg-container player-container\"><img src=\"img/Bomberman/Front/Bman_F_f00.png\" alt=\"Avatar\" class=\"left\" style=\"width:10%;\">";
    bot_message_container += "<p>" + botmsg.message + "</p><p>" + botmsg.message2 + "</p></div></li>";
    $("#playermsgcontainer").prepend(bot_message_container).load();

    change_infobar("And the winner is: " + winner.name + " Points: " + winner.points);
});

socket.on('bomb', function (enemyBomb) {
    myBombHandler.addBombEnemy(enemyBomb);
});

socket.on('player-death', function ( playerId, playerName, killerId) {
    $("#playercontainer" + playerId).addClass("stripe-1").load();

    var i = 0;
    var index = -1;
    players.players.forEach(element => {
        if (element.id == playerId) {
            index = i;
        }
        i++;
    });

    if (index > -1) {
        players.players.splice(index, 1);
    }

    if (myPlayer.playerId == killerId) {
        myPlayer.stats.kills++;
    }
});

socket.on('win', function (winner) {
    botmsg = {
        message: "And the winner is: " + winner.name,
        message2: "Kills: " + winner.kills
    };

    var bot_message_container = "<li><div class=\"msg-container player-container\"><img src=\"img/Bomberman/Front/Bman_F_f00.png\" alt=\"Avatar\" class=\"left\" style=\"width:10%;\">";
    bot_message_container += "<p>" + botmsg.message + "</p><p>" + botmsg.message2 + "</p></div></li>";

    botmsg = {
        message: "To start the game anew, every player has to be ready again ;)",
    };

    var bot_message_container = "<li><div class=\"msg-container player-container\"><img src=\"img/Bomberman/Front/Bman_F_f00.png\" alt=\"Avatar\" class=\"left\" style=\"width:10%;\">";
    bot_message_container += "<p>" + botmsg.message + "</p></div></li>";
    $("#playermsgcontainer").prepend(bot_message_container).load();

    change_infobar("And the winner is: " + winner.name + " Kills: " + winner.kills);

    $("#checkbox").prop("checked", false);
    $("#playerReady").removeClass("ready").addClass("not-ready").text("not ready");
    $('#players > li > div > p > span').each(function () { 
        $(this).removeClass("ready").addClass("not-ready").text("not ready");
    });
    playerRdy = false;
    gameStarted = false;

});

socket.on('left', function (playerId, playerName) {
    $("#" + playerId).remove();
    change_infobar("Player " + playerName + " left");

    var i = 0;
    var index = -1;
    players.players.forEach(element => {
        if (element.id == playerId) {
            index = i;
        }
        i++;
    });

    if (index > -1) {
        players.players.splice(index, 1);
    }

    players.players.playerCount -= 1;
    myBackground.layerDirty = true;
});

socket.on('player-message', function (data, playerName) {
    var message_container = "<li><div class=\"msg-container\"><img src=\"img/Bomb/Bomb_f01.png\" alt=\"Avatar\" class=\"left\" style=\"width:10%;\">";
    message_container += "<p>" + playerName + "</p><p>" + decodeURIComponent(data.message) + "</p><span class=\"time-right\">" + data.time + "</span></div></li>";

    $("#playermsgcontainer").prepend(message_container).load();

});

function addPlayerToBox(player) {
    var player_container = "<li id=\"" + player.id + "\"><div id=\"playercontainer" + player.id + "\" class=\"msg-container player-container\"><img src=\"img/Bomberman/Front/Bman_F_f00.png\" alt=\"Avatar\" style=\"width:10%;\">";
    player_container += "<p><span id=\"" + player.id + "playerReady\" class=\"player-status not-ready\">not ready</span></p>" + "<p>" + decodeURIComponent(player.name) + "</div></li>";
    $("#players").append(player_container).load();
}
