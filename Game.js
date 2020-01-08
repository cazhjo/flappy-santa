let canv, ctx;
var start = false;
//Position- och spel fysik variabler
var x, y,
  velocity = 0,
  speed = 4.5,
  friction = 0.98,
  isDead = false,
  score = 0;

var inactive = new Image();
var active = new Image();

var pic1 = "Pics/inactive.png";
var pic2 = "Pics/active.png"
var isActive = false;

var pause;

function init() {
  canv = document.getElementById("game");
  ctx = canv.getContext("2d");
  
  inactive.onload = drawImageActualSize;
  inactive.src = pic1;
  active.src = pic2;
  ctx.imageSmoothingEnabled = true;
  
  ctx.font = "30px arial";
  ctx.textAlign = "center";
  ctx.fillText("0", canv.width / 2, 150);
  
  ctx.font = "30px arial";
  ctx.textAlign = "center";
  ctx.fillText("Press space to start", canv.width / 2, canv.height - 100);
  
  pause = setInterval(startGame, 100);

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

}

var playerPos = {
  y: 0,
  width: 70,
  height: 60
};

function game() {
  document.addEventListener('keydown', function (event) {
    if (event.keyCode == "32") {
      if (velocity > -speed && !isDead) {
        velocity -= 16;
      }
      isActive = true;
    }
  }, false);
  
  if (velocity < speed) {
    velocity += 1;
  }
  
  velocity *= friction;
  y += velocity;
  playerPos.y = y;
  
  ctx.clearRect(0, 0, canv.width, canv.height);
  moveObstacles();
  collisionDetection();
  
  ctx.font = "30px arial";
  ctx.textAlign = "center";
  ctx.fillText(score, canv.width / 2, 150);

  if (y > canv.height - 50) {
    velocity = 0;
    ctx.drawImage(inactive, x, canv.height - 50, 70, 60);
    isDead = true;
    deathScreen();
  }
  else {
    ctx.drawImage(inactive, x, y, 70, 60);
    ctx.strokeRect(x, y, 70, 60);
    isActive = false;
  }
  
  increaseScore();
}

var topRects = [];
var bottomRects = [];

function moveObstacles() {
  var moveLeft = 3;
  if (isDead) {
    moveLeft = 0;
  }
  for (const obs of topRects) {
    //Tar bort onödiga obstacles som inte längre visas på skärmen
    if (obs.x < -30) {
      const index = topRects.indexOf(obs);
      ctx.clearRect(obs.x, obs.y, obs.width, obs.height);
      if (index > -1) {
        topRects.splice(index, 1);
      }
      //continue;
    }

    //Minskar x värdet så att blocket flyttas åt vänster
    obs.x -= moveLeft;
    ctx.beginPath();
    ctx.rect(obs.x, obs.y, obs.width, obs.height)
    ctx.fill();
    ctx.closePath();
    
    
  }
  
  for (const obs of bottomRects) {
    //Tar bort onödiga hinder som inte längre visas på skärmen
    if (obs.x < -30) {
      const index = bottomRects.indexOf(obs);
      //ctx.clearRect(obs.x, obs.y, obs.width, obs.height);
      if (index > -1) {
        bottomRects.splice(index, 1);
      }
      //continue;
    }
    
    //Minskar x värdet så att hindrena flyttas åt vänster
    obs.x -= moveLeft;
    ctx.beginPath();
    ctx.rect(obs.x, obs.y, obs.width, obs.height)
    ctx.fill();
    ctx.closePath();
  }
}
var scoreArray = [];
//skapar hinder och lägger in dom i varsin array
function createObstacles() {
  var topRect = {
    x: canv.width,
    y: 0,
    width: 50,
    height: Math.random() * (canv.height - 150 - 150) + 150
  };
  
  var gap = topRect.height + 157;
  
  var bottomRect = {
    x: canv.width,
    y: gap,
    width: 50,
    height: canv.height - gap
  };
  
  topRects.push(topRect);
  bottomRects.push(bottomRect);
  scoreArray.push(topRect)
  
}

function collisionDetection() {
  for (const obs of topRects) {
    if ((x + playerPos.width > obs.x) && (y < obs.height)) {
      if (!(x > obs.x + obs.width))
      isDead = true;
    }
  }

  for (const obs of bottomRects) {
    if ((x + playerPos.width > obs.x) && (y + playerPos.height > obs.y)) {
      if (!(x > obs.x + obs.width))
      isDead = true;
    }
  }
}

function increaseScore(){
  if(x > scoreArray[0].x + scoreArray[0].width && !isDead){
    score++;
    scoreArray.shift();
  }
}

var gameInterval;
var obsactleInterval;

function startGame(){
  document.addEventListener('keydown', function (event) {
    if (event.keyCode == "32") {
      start = true;
    }
  }, false);
  
  if(start){
    clearInterval(pause);
    gameInterval = setInterval(game, 1000 / 60);
    obstacleInterval = setInterval(createObstacles, 1500);
  }
}

function deathScreen(){
  reset();
  init();
}
function reset(){
  start = false;
  isDead = false;
  score = 0;
  clearInterval(gameInterval);
  clearInterval(obstacleInterval);
  ctx.clearRect(0,0,canv.width,canv.height);
  scoreArray = [];
  topRects = [];
  bottomRects = [];
}