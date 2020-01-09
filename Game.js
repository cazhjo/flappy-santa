let canv, ctx;
var start = false;
//Position- och spel fysik variabler
var x, y,
  velocity = 0,
  speed = 5,
  friction = 0.98,
  isDead = false;
score = 0;

var playerImg = new Image();
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

  playerImg = inactive;

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

var imgInt;

function game() {
  document.addEventListener('keydown', function (event) {
    if (event.keyCode == "32") {
      if (velocity > -speed && !isDead) {
        velocity = -12;
        playerImg = active;
        imgInt = setInterval(test, 5)
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
    ctx.drawImage(active, x, canv.height - 50, 70, 60);
    isDead = true;
    deathScreen();
  }
  else {
    ctx.drawImage(playerImg, x, y, 70, 60);
    //ctx.strokeRect(x, y, 70, 60);
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
    if (obs.x < -300) {
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
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();


  }

  for (const obs of bottomRects) {
    //Tar bort onödiga hinder som inte längre visas på skärmen
    if (obs.x < -300) {
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
    ctx.fillStyle = "black";
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

function increaseScore() {
  if (scoreArray.length > 0) {
    if (x > scoreArray[0].x + scoreArray[0].width && !isDead) {
      score++;
      scoreArray.shift();
    }
  }
}

var gameInterval;
var obsactleInterval;

function startGame() {
  document.addEventListener('keydown', function (event) {
    if (event.keyCode == "32") {
      start = true;
    }
  }, false);

  if (start) {
    clearInterval(pause);
    gameInterval = setInterval(game, 1000 / 60);
    obstacleInterval = setInterval(createObstacles, 1500);
  }
}

function deathScreen() {
  highScore();   
}
function reset() {
  start = false;
  isDead = false;
  score = 0;
  clearInterval(gameInterval);
  clearInterval(obstacleInterval);
  ctx.clearRect(0, 0, canv.width, canv.height);
  scoreArray = [];
  topRects = [];
  bottomRects = [];
}

var i = 0;
function test() {
  i++;
  if (i == 15) {
    i = 0;
    playerImg = inactive;
    clearInterval(imgInt);
  }
}
var highScoreList = [];
highScoreList.push(200);
highScoreList.push(250);
highScoreList.push(200);
highScoreList.push(234);
highScoreList.push(200000);
highScoreList.push(2002);
function highScore() {
  highScoreList.sort((a,b) => b - a);
  var width = 175;
  var height = 138;
  ctx.beginPath();
  ctx.rect(canv.width / 2 -width/2, canv.height / 2.26 -height/2,  width, height);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
  var temp = 225;
  for(let j = 0; j < 5; j++) {
    ctx.beginPath();
    ctx.font = "25px arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "start";
    ctx.fillText(j + 1 + ". " + highScoreList[j], canv.width/2.7, temp)
    ctx.closePath();
    temp += 25;
  }
  ctx.rect(canv.width /2 -width/2, 343, width /2.07, 25);
  ctx.fillStyle="black";
  ctx.fill();
  ctx.beginPath();
  ctx.font = "bold 17px arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "start";
  ctx.fillText("Restart", canv.width/2.75,361)
  ctx.closePath();
  ctx.beginPath();
  ctx.rect(canv.width / 2 + width/2, 343, -width/2.07, 25);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
  ctx.beginPath();
  ctx.font = "bold 16px arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "start";
  ctx.fillText("Add Score", canv.width/1.96,361)
  ctx.closePath();
}
function restart(event) {
  if(isDead){
  var rect = canv.getBoundingClientRect();
  var mouseX = event.clientX - rect.left;
  var mouseY = event.clientY - rect.top;
  if(mouseX > canv.width/2 - 175/2 && mouseY > 343 && mouseY < 343 + 25 && mouseX < (canv.width/2 - 175/2) + (175 / 2.07)){
    reset();
    init();
  }
}
}
document.addEventListener("click",restart)
function addScore() {
  if(isDead){
  var rect = canv.getBoundingClientRect();
  var mouseX = event.clientX - rect.left;
  var mouseY = event.clientY - rect.top;
  if( mouseX > (canv.width / 2 + 175/2) - (175/2.07) && mouseY > 343 && mouseY < 343 + 25 && mouseX < canv.width / 2 + 175/2){
    console.log("hej");
  }
  }
}
document.addEventListener("click", addScore);