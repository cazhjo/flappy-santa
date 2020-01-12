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

  inactive.onload = drawImg;
  inactive.src = pic1;
  active.src = pic2;
  ctx.imageSmoothingEnabled = true;

  playerImg = inactive;

  drawText(canv.width / 2, 150, "30px arial", "white", "center", "0");

  drawText(canv.width / 2, canv.height - 100, "30px arial", "white", "center", "Press space to start");

  pause = setInterval(startGame, 100);

  function drawImg() {
    x = canv.width / 2.26;
    y = canv.height / 2;
    ctx.drawImage(inactive, x, y, 70, 60);
  }
}

var playerPos = {
  y: 0,
  width: 70,
  height: 60
};

var imgInt;

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

function game() {

  if (velocity < speed) {
    velocity += 1;
  }

  velocity *= friction;
  y += velocity;
  playerPos.y = y;

  clearScreen();
  moveObstacles();
  collisionDetection();

  drawText(canv.width / 2, 150, "30px arial", "white", "center", score);

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

function moveObstacles() {
  var moveLeft = isDead ? 0 : 3;

  for (const obs of obstacles) {
    if (obs.x < -300) {
      const index = obstacles.indexOf(obs);
      if (index > -1) {
        obstacles.splice(index, 1);
      }
      //continue;
    }
    obs.move(moveLeft);
    obs.draw();
  }
}
var scoreArray = [];
var obstacles = [];

//skapar hinder och lägger in dom i varsin array
function createObstacles() {
  var obstacle = new Obstacle(canv.width, 50, 157);
  obstacles.push(obstacle);
  scoreArray.push(obstacle);
}

function collisionDetection() {
  for (const obs of obstacles) {
    if ((x + playerPos.width > obs.x) && (y < obs.Top.height)) {
      if (!(x > obs.x + obs.width))
        isDead = true;
    }

    if ((x + playerPos.width > obs.x) && (y + playerPos.height > obs.Bottom.y)) {
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
  clearScreen();
  scoreArray = [];
  obstacles = [];
}

var i = 0;
function test() {
  i++;
  if (i == 25) {
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
  highScoreList.sort((a, b) => b - a);
  var width = 175;
  var height = 138;

  drawRect(canv.width / 2 - width / 2, canv.height / 2.26 - height / 2, width, height, "black", true);

  var temp = 225;
  for (let j = 0; j < 5; j++) {
    drawText(canv.width / 2.7, temp, "25px arial", "white", "start", j + 1 + ". " + highScoreList[j]);
    temp += 25;
  }

  drawRect(canv.width / 2 - width / 2, 343, width / 2.07, 25, "black", true);
  drawText(canv.width / 2.75, 361, "bold 17px arial", "white", "start", "Restart");
  drawRect(canv.width / 2 + width / 2, 343, -width / 2.07, 25, "black", true);
  drawText(canv.width / 1.96, 361, "bold 16px arial", "white", "start", "Add Score");
}
function restart(event) {
  if (isDead) {
    var rect = canv.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;
    if (mouseX > canv.width / 2 - 175 / 2 && mouseY > 343 && mouseY < 343 + 25 && mouseX < (canv.width / 2 - 175 / 2) + (175 / 2.07)) {
      reset();
      init();
    }
  }
}
document.addEventListener("click", restart)

function addScore() {
  if (isDead) {
    var rect = canv.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;
    if (mouseX > (canv.width / 2 + 175 / 2) - (175 / 2.07) && mouseY > 343 && mouseY < 343 + 25 && mouseX < canv.width / 2 + 175 / 2) {
      console.log("hej");
    }
  }
}
document.addEventListener("click", addScore);

// document.addEventListener("click", function(evt){
//   var rect = canv.getBoundingClientRect();
//   var mouseX = evt.clientX - rect.left;
//   var mouseY = evt.clientY - rect.top;
//   drawRect(mouseX, mouseY, 5, 5, "white", true);
// }, false);

function drawRect(x, y, width, height, color, fill) {
  ctx.beginPath();
  ctx.rect(x, y, width, height)
  ctx.fillStyle = color;
  fill == true ? ctx.fill() : ctx.stroke();
  ctx.closePath();
}

function drawText(x, y, font, color, alignment, text) {
  ctx.beginPath();
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = alignment;
  ctx.fillText(text, x, y);
  ctx.closePath();
}

function clearScreen() {
  ctx.clearRect(0, 0, canv.width, canv.height);
}