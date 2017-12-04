// connect

var socket = io.connect('http://localhost:4200');

// event listeners

socket.on('game-server-created', function(id, playerInfo) {

    var player_container = "<li><div class=\"msg-container player-container\"><img src=\"img/Bomberman/Front/Bman_F_f00_blue.png\" alt=\"Avatar\" style=\"width:10%;\">";
    player_container += "<p>" + encodeURIComponent(playerInfo.name) + "<p><span class=\"player-status not-ready\">not ready</span></div></li>";
    $("#players").append(player_container).load();

    botmsg = {
        message: "Your game server has been created, have fun playing!",
        message2: "Game Server ID: " + id
    };

    var bot_message_container = "<li><div class=\"msg-container player-container\"><img src=\"img/Bomberman/Front/Bman_F_f00_yellow.png\" alt=\"Avatar\" class=\"left\" style=\"width:10%;\">";
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
    game.players.forEach(element => {
        addPlayerToBox(element);
    });

    botmsg = {
        message: "You successfully joined the game server, have fun playing!",
        message2: "Game Server ID: " + game.id
    };

    var bot_message_container = "<li><div class=\"msg-container player-container\"><img src=\"img/Bomberman/Front/Bman_F_f00_yellow.png\" alt=\"Avatar\" class=\"left\" style=\"width:10%;\">";
    bot_message_container += "<p>" + botmsg.message + "</p><p>" + botmsg.message2 + "</p></div></li>";

    $("#playermsgcontainer").append(bot_message_container).load();

    change_infobar("Sucessfully joined the game");
    show_infobar();
});

socket.on('ready', function(id, playerInfo) {

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
    message_container += "<p>" + playerName + "</p><p>" + data.message + "</p><span class=\"time-right\">" + data.time + "</span></div></li>";

    $("#playermsgcontainer").prepend(message_container).load();

});

function addPlayerToBox(player) {
    var player_container = "<li id=\"" + player.id + "\"><div class=\"msg-container player-container\"><img src=\"img/Bomberman/Front/Bman_F_f00_blue.png\" alt=\"Avatar\" style=\"width:10%;\">";
    player_container += "<p>" + player.name + "<p><span class=\"player-status not-ready\">not ready</span></div></li>";
    $("#players").append(player_container).load();
}