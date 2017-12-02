// Keyboard recognition

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