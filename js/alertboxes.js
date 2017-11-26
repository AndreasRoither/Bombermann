// Alerts //
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

// Snackbar Alert //
function myFunction() {
  var x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function() {
    x.className = x.className.replace("show", "");
  }, 5000);
}
