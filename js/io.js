// connect

var socket = io.connect('http://localhost:4200');
var gameId = 0;

// event listeners

socket.on('game-server-created', function(id, playerInfo) {

    // set game id
    gameId = id;

    var player_container = "<li><div class=\"msg-container player-container\"><img src=\"img/Bomberman/Front/Bman_F_f00_blue.png\" alt=\"Avatar\" style=\"width:10%;\">";
    player_container += "<label class=\"switch\" style=\"float:right; margin-top:10px; margin-left: 10px;\"><input id=\"checkbox\" type=\"checkbox\" onclick=\"onSwitchToggle()\"><span class=\"slider round\"></span></label>";
    player_container += "<p><span id=\"playerReady\" class=\"player-status not-ready\">not ready</span></p>" + "<p>" + encodeURIComponent(playerInfo.name) + "</div></li>";
    $("#players").append(player_container).load();

    botmsg = {
        message: "Your game server has been created, have fun playing!",
        message2: "Game Server ID: " + id
    };

    var bot_message_container = "<li><div class=\"msg-container player-container\"><img src=\"img/Bomberman/Front/Bman_F_f00.png\" alt=\"Avatar\" class=\"left\" style=\"width:10%;\">";
    bot_message_container += "<p>" + botmsg.message + "</p><p>" + botmsg.message2 + "</p></div></li>";

    $("#playermsgcontainer").append(bot_message_container).load();

    change_infobar("Created Game Server, Game ID: " + id);
    show_infobar();
});

socket.on('game-not-found', function(id, playerInfo) {
    change_infobar("Game not found");
    show_infobar();
});

socket.on('game-started', function(id, playerInfo) {
    change_infobar("Game started");
    show_infobar();
});

socket.on('player-joined', function(playerInfo) {
    addPlayerToBox(playerInfo);
    change_infobar("Player " + playerInfo.name + " joined");
    show_infobar();
});

socket.on('joined', function(player, game) {

    var player_container = "<li><div class=\"msg-container player-container\"><img src=\"img/Bomberman/Front/Bman_F_f00_blue.png\" alt=\"Avatar\" style=\"width:10%;\">";
    player_container += "<label class=\"switch\" style=\"float:right; margin-top:10px; margin-left: 10px;\"><input id=\"checkbox\" type=\"checkbox\" onclick=\"onSwitchToggle()\"><span class=\"slider round\"></span></label>";
    player_container += "<p><span id=\"playerReady\" class=\"player-status not-ready\">not ready</span></p>" + "<p>" + encodeURIComponent(player.name) + "</div></li>";
    $("#players").append(player_container);

    game.players.forEach(element => {
        if (player.id != element.id)
            addPlayerToBox(element);
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

socket.on('ready', function(id, ready) {
    alert("ready");
    var id = id + "playerReady";

    if (ready) {
        $('#' + id).removeClass("ready").addClass("not-ready").text("not ready");
        playerRdy = false;
      }
      else {
        $('#' + id).removeClass("not-ready").addClass("ready").text("ready");
        playerRdy = true;
      }
});

socket.on('start', function(id, playerInfo) {

});

socket.on('stop', function(id, playerInfo) {

});

socket.on('move', function(id, playerInfo) {

});

socket.on('bomb', function(id, playerInfo) {

});

socket.on('death', function(id, playerInfo) {

});

socket.on('win', function(id, playerInfo) {

});

socket.on('left', function(playerId, playerName) {
    $("#" + playerId).remove();
    change_infobar("Player " + playerName + " left");
    show_infobar();
});

socket.on('player-message', function(data, playerName) {
    var message_container = "<li><div class=\"msg-container\"><img src=\"img/Bomb/Bomb_f01.png\" alt=\"Avatar\" class=\"left\" style=\"width:10%;\">";
    message_container += "<p>" + playerName + "</p><p>" + decodeURIComponent(data.message) + "</p><span class=\"time-right\">" + data.time + "</span></div></li>";

    $("#playermsgcontainer").prepend(message_container).load();

});

function addPlayerToBox(player) {
    var player_container = "<li id=\"" + player.id + "\"><div class=\"msg-container player-container\"><img src=\"img/Bomberman/Front/Bman_F_f00_blue.png\" alt=\"Avatar\" style=\"width:10%;\">";
    player_container += "<p><span id=\"" + player.id + "playerReady\" class=\"player-status not-ready\">not ready</span></p>" + "<p>" + encodeURIComponent(player.name) + "</div></li>";
    $("#players").append(player_container).load();
}