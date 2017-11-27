// Alerts //
$( document ).ready(update_alerts()
)

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

function add_left_list (msg) {
  $( '#left-list' ).append( "<li><div class=alert><span class=closebtn>&times;</span>" + msg + "</div></li> ");
  update_alerts();
}

function change_snackbar (msg) {
  $( '#snackbar' ).text(event.which);
  show_snackbar();
}