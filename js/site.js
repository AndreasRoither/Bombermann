/********************
 *       Site        *
 *********************/

var playerRdy = false;

$(document).ready(function () {
  showModalPopup();
  // Get the element with id="defaultOpen" and click on it
  document.getElementById("defaultOpen").click();
  addListeners();
});

function make_responsive() {
  var x = document.getElementById("topnav1");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

function openPage(pageName, elmnt, color) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }
  document.getElementById(pageName).style.display = "block";
  elmnt.style.backgroundColor = color;
}

function addListeners() {
  $("#text_msg").on("keyup", function (e) {
    if (e.keyCode == 13) {
      $("#chatform").submit().preventDefault;
    }
  });

  $("#chatform").submit(function (e) {
    e.preventDefault();
  });

  // check if tab is active
  $(window).on("blur focus", function(e) {
    var prevType = $(this).data("prevType");

    if (prevType != e.type) {   //  reduce double fire issues
        switch (e.type) {
            case "blur":
                // when tab is not focused, but seen
                break;
            case "focus":
                if (gameLoaded) setAllDirty();
                break;
        }
    }

    $(this).data("prevType", e.type);
  });
}

/********************
 *      Toogle       *
 *********************/

function onSwitchToggle() {
  if (!gameStarted) {
    if (playerRdy) {
      $("#playerReady").removeClass("ready").addClass("not-ready").text("not ready");
      playerRdy = false;
    } else {
      $("#playerReady").removeClass("not-ready").addClass("ready").text("ready");
      playerRdy = true;
    }

    playerReady(playerRdy);
  }
}

/********************
 *       Popup       *
 *********************/

function showModalPopup() {
  $(".popup").css({
    transform: "translateY(0)",
    "z-index": "999",
    visibility: "visible"
  });

  $("body").addClass("overlay");

  $(this).css({
    "z-index": "-1"
  });
}

function closePopup() {
  $("#startPopup").remove();
  $("body").removeClass("overlay");
}

/********************
 *       Alert       *
 *********************/

$(document).ready(update_alerts());

function update_alerts() {
  var close = document.getElementsByClassName("closebtn");
  var i;

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      var div = this.parentElement;
      div.style.opacity = "0";
      setTimeout(function () {
        div.style.display = "none";
      }, 600);
    };
  }
}

function showinfopopup() {
  var popup = document.getElementById("infoPopup");
  popup.classList.toggle("show");
}

// Snackbar Alert //
function show_infobar() {
  var x = document.getElementById("infopopup");
  x.className = "show";
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 4000);
}

function change_infobar(msg) {
  $("#infopopup").text(msg);
  show_infobar();
}

function add_left_list(msg) {
  $("#players").prepend(
    "<li><div class=alert><span class=closebtn>&times;</span>" +
    msg +
    "</div></li> "
  );
  update_alerts();
}

/***********************
 * Keyboard recognition *
 ************************/

var movLeft = false;
var movRight = false;
var movUp = false;
var movDown = false;

window.addEventListener("keydown", function (event) {
  var target = event.target || event.srcElement;
  var targetTagName = (target.nodeType == 1) ? target.nodeName.toUpperCase() : "";
  if (!/INPUT|SELECT|TEXTAREA/.test(targetTagName)) {
    if (event.repeat) return;
    if (event.which == 13) {
      // Enter Key
      event.preventDefault();
    }
    if (event.which == 97 || event.which == 65) {
      // a || A Key
      movLeft = true;
    }
    if (event.which == 115 || event.which == 83) {
      // s || S Key
      movDown = true;
    }
    if (event.which == 100 || event.which == 68) {
      // d || D Key
      movRight = true;
    }
    if (event.which == 119 || event.which == 87) {
      // w || W Key
      movUp = true;
    }
    if (event.which == 32) {
      // space Key
      myPlayer.layBomb();
    }
    //Arrow Keys
    if (event.which == 37) {
      // left key
      movLeft = true;
      event.preventDefault();
    }
    if (event.which == 39) {
      // right key
      movRight = true;
      event.preventDefault();
    }
    if (event.which == 38) {
      // up key
      movUp = true;
      event.preventDefault();
    }
    if (event.which == 40) {
      // down key
      movDown = true;
      event.preventDefault();
    }
  }
  //console.log( event.type + ": " +  event.keyCode ); //debug
});

window.addEventListener("keyup", function (event) {
  if (event.which == 13) {
    // Enter Key
    event.preventDefault();
  }
  if (event.which == 97 || event.which == 65) {
    // a || A Key
    movLeft = false;
  }
  if (event.which == 115 || event.which == 83) {
    // s || S Key
    movDown = false;
  }
  if (event.which == 100 || event.which == 68) {
    // d || D Key
    movRight = false;
  }
  if (event.which == 119 || event.which == 87) {
    // w || W Key
    movUp = false;
  }
  if (event.which == 32) {
    // space Key
    event.preventDefault();
  }
  //Arrow Keys
  if (event.which == 37) {
    // left key
    movLeft = false;
    event.preventDefault();
  }
  if (event.which == 39) {
    // right key
    movRight = false;
    event.preventDefault();
  }
  if (event.which == 38) {
    // up key
    movUp = false;
    event.preventDefault();
  }
  if (event.which == 40) {
    // down key
    movDown = false;
    event.preventDefault();
  }
  //console.log( event.type + ": " +  event.keyCode ); //debug
});


/***********
 * Gamepad *
 ***********/

var padUp = false;
var padDown = false;
var padLeft = false;
var padRight = false;

var haveEvents = 'ongamepadconnected' in window;
var controllers = {};

function connecthandler(e) {
  addgamepad(e.gamepad);
}

function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad;

  var d = document.createElement("div");
  d.setAttribute("id", "controller" + gamepad.index);

  var start = document.getElementById("start");
  if (start) {
    start.style.display = "none";
  }

  document.body.appendChild(d);
}

function disconnecthandler(e) {
  removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
  var d = document.getElementById("controller" + gamepad.index);
  document.body.removeChild(d);
  delete controllers[gamepad.index];
}

function updateStatus() {
  if (!haveEvents) {
    scangamepads();
  }

  var i = 0;
  var j;
  var cooldown = 0;

  for (j in controllers) {
    var controller = controllers[j];
    var d = document.getElementById("controller" + j);
    var buttons = d.getElementsByClassName("button");

    for (i = 0; i < controller.buttons.length; i++) {
      var b = buttons[i];
      var val = controller.buttons[i];
      var pressed = val == 1.0;
      if (typeof(val) == "object") {
        pressed = val.pressed;
        val = val.value;
      }

        // 0 = A
      if (pressed) {
        if (i==0 && cooldown == 0) {
          cooldown = 10;
          myPlayer.layBomb();
        }
      }
    }
    if (cooldown>0) cooldown -=1;

      if (controller.axes[0] > 0.25) { //right
        padRight = true;
        movRight = true;
      }
      else if (controller.axes[0] < -0.25) { //left
        padLeft = true;
        movLeft = true;
      }
      else {
        if (padLeft) {
          padLeft = false;
          movLeft = false;
        }
        if (padRight) {
          padRight = false;
          movRight = false;
        }
      }
      if (controller.axes[1] > 0.25) { //down
        padDown = true;
        movDown = true;
      }
      else if (controller.axes[1] < -0.25) { //up
        padUp = true;
        movUp = true;
      }
      else {
        if (padDown) {
          padDown = false;
          movDown = false;
        }
        if (padUp) {
          padUp = false;
          movUp = false;
        }
      }
  }

}

function scangamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (gamepads[i].index in controllers) {
        controllers[gamepads[i].index] = gamepads[i];
      } else {
        addgamepad(gamepads[i]);
      }
    }
  }
}


window.addEventListener("gamepadconnected", connecthandler);
window.addEventListener("gamepaddisconnected", disconnecthandler);

if (!haveEvents) {
  setInterval(scangamepads, 500);
}