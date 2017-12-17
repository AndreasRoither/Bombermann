// game
var matrix = {},
  matrixSize = 9,
  brickSize = 64;

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
    var hashcode = playerName.hashCode();

    socket.emit("create", hashcode, playerName, "Test", matrix);
    closePopup();
  }
}

function joinGame() {
  if (currentlyConnected) {
    var data = {
      name: encodeURIComponent($("#playerName2").val()),
      id: encodeURIComponent($("#gameId").val())
    };

    socket.emit("join", data);
    closePopup();
  }
}

function newGame(player_name) { }

function endGame(player_name) { }

function copyGameId() {
  var aux = document.createElement("input");
  aux.setAttribute("value", gameId);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);

  change_infobar("Game Id " + gameId + " copied");
}

// menu

// loading

function setAllDirty() {
  myPlayer.layerDirty = true;
  myBackground.layerDirty = true;
  players.players.forEach(element => {
    element.layerDirty = true;
  });

  updateGameArea();
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
  message_container += "<p>" + decodeURIComponent(chatmsg.message) + "</p><span class=\"time-left\">" + chatmsg.time + "</span></div></li>";

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