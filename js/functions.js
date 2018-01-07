// game
var difficulty;
var mode;

String.prototype.hashCode = function () {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function createGame() {
  if (currentlyConnected) {
    var playerName = encodeURIComponent($("#playerName1").val());
    difficulty = $("#difficulty").val();
    mode = parseInt($("#mode").val());
    var hashcode = socket.id.hashCode();

    socket.emit("create", hashcode, playerName, "Test", difficulty, mode);
  }
  else {
    $("#createErrorMsg").text("Not connected to the Server!");
  }
}

function joinGame() {
  if (currentlyConnected) {
    var data = {
      name: encodeURIComponent($("#playerName2").val()),
      id: encodeURIComponent($("#gameId").val())
    };
    socket.emit("join", data);
  }
  else {
    $("#joinErrorMsg").text("Not connected to the Server!");
  }
}

function copyGameId() {
  var aux = document.createElement("input");
  aux.setAttribute("value", gameId);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);

  change_infobar("Game Id " + gameId + " copied");
}

function resetGameArea() {
  if (myGameArea.gameStartedUp && !gameStarted) {
    myBackground.resetMap();
  }
}

function setAllDirty() {
  myBackground.layerDirty = true;
}

function addPlayerToBox(player) {
  var player_container = "<li id=\"" + player.id + "\"><div id=\"playercontainer" + player.id + "\" class=\"msg-container player-container\"><img src=\"img/Bomberman/Front/Bman_F_f00.png\" alt=\"Avatar\" style=\"width:10%;\">";
  player_container += "<p><span id=\"" + player.id + "playerReady\" class=\"player-status not-ready\">not ready</span></p>" + "<p>" + decodeURIComponent(player.name) + "</div></li>";
  $("#players").append(player_container).load();
}

function arrayClone( arr ) {
  var i, copy;

  if( Array.isArray(arr) ) {
      copy = arr.slice( 0 );
      for( i = 0; i < copy.length; i++ ) {
          copy[ i ] = arrayClone( copy[ i ] );
      }
      return copy;
  }
  else if( typeof arr === 'object' ) {
      throw 'Cannot clone array containing an object!';
  }
  else {
      return arr;
  }
}

// players

function sendChatMsg() {
  var createdAt = new Date().toLocaleTimeString();

  chatmsg = {
    message: encodeURIComponent($("#text_msg").val()),
    time: createdAt
  };

  socket.emit("messages", chatmsg);
  $("#text_msg").val("");

  var message_container = "<li><div class=\"msg-container darker\"><img src=\"img/Bomb/Bomb_f02.png\" alt=\"Avatar\" class=\"right\" style=\"width:10%;\">";
  message_container += "<p class=\"ellipses\">" + decodeURIComponent(chatmsg.message) + "</p><span class=\"time-left\">" + chatmsg.time + "</span></div></li>";

  $("#playermsgcontainer").prepend(message_container).load();
}

function playerReady(isReady) {
  if (isReady) {
    socket.emit("ready", gameId, true);
  }
  else {
    socket.emit("ready", gameId, false);
  }
}

function playerMoved(position, imageCounter, currentDirection) {
  socket.emit("move", gameId, socket.id, position, imageCounter, currentDirection);
}

function playerBombSet(bomb) {
  socket.emit("bomb",gameId, bomb);
}

function playerDead (id, bombId) {
  $("#playercontainer" + id).addClass("stripe-1").load();
  change_infobar("You died");
  socket.emit("death", gameId, socket.id, bombId);
}

function playerNotDead (id) {
  $("#playercontainer" + id).removeClass("stripe-1").load();
  $("#checkbox").prop("checked", false);
  $("#playerReady").removeClass("ready").addClass("not-ready").text("not ready");
  playerRdy = false;
  gameStarted = false;
}

function sendPoints(points) {
  socket.emit("points", gameId, socket.id, points);
}

function gameFinished() {
  socket.emit("game-finished ",gameId);
}