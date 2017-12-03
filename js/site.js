/* ******************** */
/*         Site         */
/* ******************** */

$(document).ready(function() {
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
  $("#text_msg").on("keyup", function(e) {
    if (e.keyCode == 13) {
      $( "#chatform" ).submit().preventDefault;
    }
  });

  $("#chatform").submit(function(e) {
    e.preventDefault();
});
}

/* ******************** */
/*        Popup         */
/* ******************** */

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

/* ******************** */
/*         Alert        */
/* ******************** */

$(document).ready(update_alerts());

function update_alerts() {
  var close = document.getElementsByClassName("closebtn");
  var i;

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;
      div.style.opacity = "0";
      setTimeout(function() {
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
  setTimeout(function() {
    x.className = x.className.replace("show", "");
  }, 5000);
}

function change_infobar(msg) {
  $("#infopopup").text(msg);
  show_infobar();
}

function add_left_list(msg) {
  $("#left-list").append(
    "<li><div class=alert><span class=closebtn>&times;</span>" +
      msg +
      "</div></li> "
  );
  update_alerts();
}

/* ******************** */
/* Keyboard recognition */
/* ******************** */

var movLeft = 0;
var movRight = 0;
var movUp = 0;
var movDown = 0;

window.addEventListener("keydown", function(event) {
  if (event.repeat) return;
  if (event.which == 13) {
    // Enter Key
    event.preventDefault();
  }
  if (event.which == 97 || event.which == 65) {
    // a || A Key
    movLeft = 1;
  }
  if (event.which == 115 || event.which == 83) {
    // s || S Key
    movDown = 1;
  }
  if (event.which == 100 || event.which == 68) {
    // d || D Key
    movRight = 1;
  }
  if (event.which == 119 || event.which == 87) {
    // w || W Key
    movUp = 1;
  }
  if (event.which == 32) {
    // space Key
    lay_bomb();
    event.preventDefault();
  }
  //Arrow Keys
  if (event.which == 37) {
    // left key
    movLeft = 1;
    event.preventDefault();
  }
  if (event.which == 39) {
    // right key
    movRight = 1;
    event.preventDefault();
  }
  if (event.which == 38) {
    // up key
    movUp = 1;
    event.preventDefault();
  }
  if (event.which == 40) {
    // down key
    movDown = 1;
    event.preventDefault();
  }
  //console.log( event.type + ": " +  event.keyCode ); //debug
});

window.addEventListener("keyup", function(event) {
  if (event.which == 13) {
    // Enter Key
    event.preventDefault();
  }
  if (event.which == 97 || event.which == 65) {
    // a || A Key
    movLeft = 0;
  }
  if (event.which == 115 || event.which == 83) {
    // s || S Key
    movDown = 0;
  }
  if (event.which == 100 || event.which == 68) {
    // d || D Key
    movRight = 0;
  }
  if (event.which == 119 || event.which == 87) {
    // w || W Key
    movUp = 0;
  }
  if (event.which == 32) {
    // space Key
    event.preventDefault();
  }
  //Arrow Keys
  if (event.which == 37) {
    // left key
    movLeft = 0;
    event.preventDefault();
  }
  if (event.which == 39) {
    // right key
    movRight = 0;
    event.preventDefault();
  }
  if (event.which == 38) {
    // up key
    movUp = 0;
    event.preventDefault();
  }
  if (event.which == 40) {
    // down key
    movDown = 0;
    event.preventDefault();
  }
  //console.log( event.type + ": " +  event.keyCode ); //debug
});
