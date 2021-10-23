let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");

let tileCount = 10;
let score = 0;

let head = {
  x: Math.floor(Math.random() * 20),
  y: Math.floor(Math.random() * 20)
}

let body = {
  x: Math.floor(Math.random()),
  y: Math.floor(Math.random())
}

function drawObject(){
  ctx.fillStyle = "orange";
  ctx.fillRect(head.x * 25, head.y * 25, 25, 25);
}

function drawFood(){
  ctx.fillStyle = "red";
  ctx.fillRect(body.x * 25, body.y * 25, 25, 25);
}

function drawScore(){
  ctx.fillStyle = "white";
  ctx.font = "20px Verdana";
  ctx.fillText("Score " + score, canvas.width - 90, 25);
}

function background(){
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
let msg_1 = "Background Has Been Run";
console.log(msg_1);

document.body.addEventListener("keydown", keyDown);
function keyDown(e){
  if(e.keyCode == 38 || e.keyCode == 87){
    head.y --;
  }
  if(e.keyCode == 40 || e.keyCode == 83){ 
    head.y ++;
  }
  if(e.keyCode == 37 || e.keyCode == 65){ 
    head.x --;
  }
  if(e.keyCode == 39 || e.keyCode == 68){
    head.x ++;
  }
}

function gameLoop(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  requestAnimationFrame(gameLoop);
  background();
  drawScore();
  drawObject();
  drawFood();
}

let msgf = "All Part Of The Game Is Ready To Run";
console.log(msgf);

gameLoop();
