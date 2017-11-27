// Keyboard recognition



$(document).on('keypress', function(e) {
  if ( event.which == 13 ) { // Enter Key
    //console.log( event.type + ": " +  event.which );
    add_left_list('Enter pressed');
  }
  if ( event.which == 97 || event.which == 65) { // a || A Key
    //console.log( event.type + ": " +  event.which );
    add_left_list('a pressed');
  }
  if ( event.which == 115 || event.which == 83) { // s || S Key
    //console.log( event.type + ": " +  event.which );
    add_left_list('s pressed');
  }
  if ( event.which == 100 || event.which == 68) { // d || D Key
    //console.log( event.type + ": " +  event.which );
    add_left_list('d pressed');
  }
  if ( event.which == 119 || event.which == 87) { // w || W Key
    //console.log( event.type + ": " +  event.which );
    add_left_list('w pressed');
  }
  if ( event.which == 32) { // space Key
    //console.log( event.type + ": " +  event.which );
    add_left_list('space pressed');
  }
  var close = document.getElementsByClassName("closebtn");
})

