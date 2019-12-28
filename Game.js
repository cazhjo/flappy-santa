let canv, ctx;
var x;
var y;
var gravity = 1;
var inactive = new Image();
var active = new Image();

var pic1 = "Pics/inactive.png";
var pic2 = "Pics/active.png"
var isActive = false;


function init() {
  canv = document.getElementById("game");
  ctx = canv.getContext("2d");

  inactive.onload = drawImageActualSize;
  inactive.src = pic1;
  active.src = pic2;
  ctx.imageSmoothingEnabled = true;


  function drawImageActualSize() {
    // Use the intrinsic size of image in CSS pixels for the canvas element
    //canv.width = this.naturalWidth;
    //canv.height = this.naturalHeight;

    // Will draw the image as 300x227, ignoring the custom size of 60x45
    // given in the constructor

    x = canv.width / 2.26;
    y = canv.height / 2;
    ctx.drawImage(this, x, y, 70, 60);

    // To use the custom size we'll have to specify the scale parameters 
    // using the element's width and height properties - lets draw one 
    // on top in the corner:
    //ctx.drawImage(this, 0, 0, this.width, this.height);
  }
  setInterval(game, 1000 / 60);
}

function game() {
  document.addEventListener('keydown', function (event) {
    if (event.keyCode == "32") {
      gravity = -50;
      isActive = true;
    }
  }, false);

  ctx.clearRect(0, 0, canv.width, canv.height);
  y += gravity;
  if (y > canv.height - 50) {
    gravity = 0;
    ctx.drawImage(inactive, x, canv.height - 50, 70, 60);
  }
  else {
    if (isActive) {
      ctx.drawImage(active, x, y, 70, 60);
    }
    else {
      ctx.drawImage(inactive, x, y, 70, 60);
    }
    isActive = false;
    gravity = 1;
  }


}