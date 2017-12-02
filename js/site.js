/* ******************** */
/*         Sitev        */
/* ******************** */

function make_responsive() {
    var x = document.getElementById("topnav1");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

/* ******************** */
/*         Alert        */
/* ******************** */

$(document).ready(update_alerts())

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

// Snackbar Alert //
function show_snackbar() {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function() {
        x.className = x.className.replace("show", "");
    }, 5000);
}

function add_left_list(msg) {
    $('#left-list').append("<li><div class=alert><span class=closebtn>&times;</span>" + msg + "</div></li> ");
    update_alerts();
}

function change_snackbar(msg) {
    $('#snackbar').text(event.which);
    show_snackbar();
}

/* ******************** */
/* Keyboard recognition */
/* ******************** */

var movLeft = 0;
var movRight = 0;
var movUp = 0;
var movDown = 0;

window.addEventListener("keydown", function(event) {

  if(event.repeat)
  return;
  if ( event.which == 13 ) { // Enter Key
    event.preventDefault();
  }
  if ( event.which == 97 || event.which == 65) { // a || A Key
    movLeft = 1;
  }
  if ( event.which == 115 || event.which == 83) { // s || S Key
    movDown = 1;
  }
  if ( event.which == 100 || event.which == 68) { // d || D Key
    movRight = 1;
  }
  if ( event.which == 119 || event.which == 87) { // w || W Key
    movUp = 1;
  }
  if ( event.which == 32) { // space Key
    lay_bomb();
    event.preventDefault();
  }
 //Arrow Keys
  if ( event.which == 37) { // left key
    movLeft = 1;
    event.preventDefault();
  }
  if ( event.which == 39) { // right key
    movRight = 1;
    event.preventDefault();
  }
  if ( event.which == 38) { // up key
    movUp = 1;
    event.preventDefault();
  }
  if ( event.which == 40) { // down key
    movDown = 1;
    event.preventDefault();
  }
  //console.log( event.type + ": " +  event.keyCode ); //debug
})

window.addEventListener("keyup", function(event) {
  if ( event.which == 13 ) { // Enter Key
    event.preventDefault();
  }
  if ( event.which == 97 || event.which == 65) { // a || A Key
    movLeft = 0;
  }
  if ( event.which == 115 || event.which == 83) { // s || S Key
    movDown = 0;
  }
  if ( event.which == 100 || event.which == 68) { // d || D Key
    movRight = 0;
  }
  if ( event.which == 119 || event.which == 87) { // w || W Key
    movUp = 0;
  }
  if ( event.which == 32) { // space Key
    event.preventDefault();
  }
 //Arrow Keys
  if ( event.which == 37) { // left key
    movLeft = 0;
    event.preventDefault();
  }
  if ( event.which == 39) { // right key
    movRight = 0;
    event.preventDefault();
  }
  if ( event.which == 38) { // up key
    movUp = 0;
    event.preventDefault();
  }
  if ( event.which == 40) { // down key
    movDown = 0;
    event.preventDefault();
  }
  //console.log( event.type + ": " +  event.keyCode ); //debug
})