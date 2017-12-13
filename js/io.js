
// connect
var socket = io.connect('http://localhost:4200');

socket.io.on("connect_error", function () {
    closePopup();
    change_infobar("Server not available");
});

var gameId = 0;
var gameStarted = false;

// event listeners

socket.on('game-server-created', function (id, player) {

    gameId = id;

    var player_container = "<li><div class=\"msg-container player-container\"><img src=\"img/Bomberman/Front/Bman_F_f00_blue.png\" alt=\"Avatar\" style=\"width:10%;\">";
    player_container += "<label class=\"switch\" style=\"float:right; margin-top:10px; margin-left: 10px;\"><input id=\"checkbox\" type=\"checkbox\" onclick=\"onSwitchToggle()\"><span class=\"slider round\"></span></label>";
    player_container += "<p><span id=\"playerReady\" class=\"player-status not-ready\">not ready</span></p>" + "<p>" + encodeURIComponent(player.name) + "</div></li>";
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

    startGame(player.startPosition);

    change_infobar("Created Game Server, Game ID: " + id);
    show_infobar();
});

socket.on('game-not-found', function (id, playerInfo) {
    change_infobar("Game not found");
    show_infobar();
});

socket.on('player-joined', function (player) {
    addPlayerToBox(player);
    change_infobar("Player " + player.name + " joined");
    show_infobar();

    var newPlayer = new playerObject(player.startPosition, player.id);
    players.players.push(newPlayer);
    players.playerCount += 1;

    myPlayer.layerDirty = true;
});

socket.on('joined', function (player, game) {

    var player_container = "<li><div class=\"msg-container player-container\"><img src=\"img/Bomberman/Front/Bman_F_f00_blue.png\" alt=\"Avatar\" style=\"width:10%;\">";
    player_container += "<label class=\"switch\" style=\"float:right; margin-top:10px; margin-left: 10px;\"><input id=\"checkbox\" type=\"checkbox\" onclick=\"onSwitchToggle()\"><span class=\"slider round\"></span></label>";
    player_container += "<p><span id=\"playerReady\" class=\"player-status not-ready\">not ready</span></p>" + "<p>" + encodeURIComponent(player.name) + "</div></li>";
    $("#players").append(player_container);

    startGame(player.startPosition);

    gameId = game.id;

    game.players.forEach(element => {
        if (player.id != element.id) {
            addPlayerToBox(element);
            var newPlayer = new playerObject(element.startPosition, element.id);
            players.players.push(newPlayer);
            players.playerCount += 1;
        }
    });

    botmsg = {
        message: "You successfully joined the game server, have fun playing!",
        message2: "Game Server ID: " + game.id
    };

    var bot_message_container = "<li><div class=\"msg-container player-container\"><img src=\"img/Bomberman/Front/Bman_F_f00.png\" alt=\"Avatar\" class=\"left\" style=\"width:10%;\">";
    bot_message_container += "<p>" + botmsg.message + "</p><p>" + botmsg.message2 + "</p></div></li>";

    $("#playermsgcontainer").append(bot_message_container).load();

    change_infobar("Sucessfully joined the game");
    show_infobar();
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
    show_infobar();
});

socket.on('game-started', function () {
    change_infobar("Sorry, Game already started");
    show_infobar();
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

socket.on('bomb', function (id, playerInfo) {

});

socket.on('death', function (id, playerInfo) {

});

socket.on('win', function (id, playerInfo) {

});

socket.on('left', function (playerId, playerName) {
    $("#" + playerId).remove();
    change_infobar("Player " + playerName + " left");
    show_infobar();

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
    var player_container = "<li id=\"" + player.id + "\"><div class=\"msg-container player-container\"><img src=\"img/Bomberman/Front/Bman_F_f00_blue.png\" alt=\"Avatar\" style=\"width:10%;\">";
    player_container += "<p><span id=\"" + player.id + "playerReady\" class=\"player-status not-ready\">not ready</span></p>" + "<p>" + encodeURIComponent(player.name) + "</div></li>";
    $("#players").append(player_container).load();
}
