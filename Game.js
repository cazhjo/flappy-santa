let canv, ctx;

//Position- och spel fysik variabler
var x, y,
velocity = 0,
speed = 2.3,
friction = 0.98,
isDead = false;

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
      if (velocity > -speed) {
        velocity -= 13.5;
      }
      isActive = true;
    }
  }, false);

  if(velocity < speed){
    velocity++;
  }

  velocity *= friction;
  y += velocity;

  ctx.clearRect(0, 0, canv.width, canv.height);
  moveObstacles();

  if (y > canv.height - 50) {
    velocity = 0;
    ctx.drawImage(inactive, x, canv.height - 50, 70, 60);
  }
  else {
    ctx.drawImage(inactive, x, y, 70, 60);
    isActive = false;
  }
  
  
}

var topRects = [];
var bottomRects = [];

function moveObstacles(){
  for (const obs of topRects) {
    //Tar bort onödiga obstacles som inte längre visas på skärmen
    if(obs.x < -30){
      const index = topRects.indexOf(obs);
      ctx.clearRect(obs.x, obs.y, obs.width, obs.height);
      if(index > -1){
        topRects.splice(index, 1);
      }
      continue;
    }
    
    //Minskar x värdet så att blocket flyttas åt vänster
    obs.x -= 1;
    ctx.beginPath();
    ctx.rect(obs.x, obs.y, obs.width, obs.height)
    ctx.fill();
    ctx.closePath();
  }

  for (const obs of bottomRects) {
    //Tar bort onödiga hinder som inte längre visas på skärmen
    if(obs.x < -30){
      const index = bottomRects.indexOf(obs);
      ctx.clearRect(obs.x, obs.y, obs.width, obs.height);
      if(index > -1){
        bottomRects.splice(index, 1);
      }
      continue;
    }
    
    //Minskar x värdet så att hindrena flyttas åt vänster
    obs.x -= 1;
    ctx.beginPath();
    ctx.rect(obs.x, obs.y, obs.width, obs.height)
    ctx.fill();
    ctx.closePath();
  }
}

//skapar hinder och lägger in dom i varsin array
function createObstacles(){
  var topRect = {
    x: canv.width,
    y: 0,
    width: 50,
    height: Math.random() * (canv.height - 200 - 200) + 200
  };

  var gap = topRect.height + 175;

  var bottomRect = {
    x: canv.width,
    y: gap,
    width: 50,
    height: canv.height - gap
  };

  topRects.push(topRect);
  bottomRects.push(bottomRect);

}
setInterval(createObstacles, 2750);