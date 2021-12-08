let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");

const gridSize = canvas.width / 40;

// -------------- Multi Player Class --------------- //

class MultiplayerSnake {
  constructor(){
    this.client = new SnakeClient();
    this.players = {}
    // ------------- Multiplayer Engine --------------    //
    this.client.socket.emit("get_online_players", (data) => {
      this.players = data;
      // TODO: Code clean up, rapih-rapih kode belum beres
      this.client.socket.on("receive_stream", (data) => {
        if (Object.keys(this.players).indexOf(data.who) && data.who != this.client.socket.id) {
          try {
            this.players[data.who].body = data.body;
            this.players[data.who].bodyLength = data.bodyLength;
          } catch (e) {}
        }
      })
      this.client.socket.on("receive_disconnect", (who) => {
        delete this.players[who];
      })
      this.client.socket.on("new_player", (data) => {
        this.players[data.who] = {}
        this.players[data.who].body = data.body;
        this.players[data.who].bodyLength = data.bodyLength;
      });
    });
  }
  multiplayers_head(player) {
    return this.players[player].body[0];
  }
  multiplayers_draw() {
    ctx.fillStyle = "white";
    try {
      for (player of Object.keys(snake.players)) {
          for(let i = 0; i < this.players[player] .body.length; i++) {
            ctx.fillRect(this.players[player].body[i][0]  * gridSize, this.players[player].body[i][1]  * gridSize, gridSize, gridSize);
          }
      }
    } catch (e) {}
  }
}
// ------------------------------------------------- //

// ----------------- Player's Snake Class ---------- //
class Snake extends MultiplayerSnake {
  constructor(){
    super();
    this.body = [[5, 5]];
    this.bodyLength = 5;
    this.velocityX = 0;
    this.velocityY = 0;
  }
  head(){
    return this.body[0];
  }
  draw(){
    ctx.fillStyle = "white";
    for(let i = 0; i < this.body.length; i++) {
      ctx.fillRect(this.body[i][0] * gridSize, this.body[i][1] * gridSize, gridSize, gridSize);
    }
  }
  movement(){
    let head = [this.body[0][0], this.body[0][1]];
    console.log("Isi dari this.body: ", this.body);
    console.log("Array yang mau dipotong: ", head);
    head[0] += this.velocityX;
    head[1] += this.velocityY;
    this.body.unshift(head);
    console.log("this.body setelah dipotong oleh head: ", this.body);
    let tail = this.body.pop();
    console.log("Isi dari tail: ", tail)
    if (this.body.length < this.bodyLength) {
      this.body.push(tail);
    }
    this.client.stream_move({
       body: this.body,
       bodyLength: this.bodyLength
    })
  }
}
//---------------------------------------------------//

// ------------------------------ Food Class ---------------------------- //
class Food{
  constructor(x, y){
    this.x = Math.floor(Math.random() * 25);
    this.y = Math.floor(Math.random() * 25);
  }
  drawOrange(){
    ctx.fillStyle = "orange";
    ctx.fillRect(this.x * gridSize, this.y * gridSize, gridSize, gridSize);
  }
  drawApple(){
    ctx.fillStyle = "red";
    ctx.fillRect(this.x * gridSize, this.y * gridSize, gridSize, gridSize);
  }
  drawGrape(){
    ctx.fillStyle = "purple";
    ctx.fillRect(this.x * gridSize, this.y * gridSize, gridSize, gridSize);
  }
  drawPear(){
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x * gridSize, this.y * gridSize, gridSize, gridSize);
  }
  regenerate() {
    this.x = Math.floor(Math.random() * 30);
    this.y = Math.floor(Math.random() * 25);
  }
}
// ------------------------------------------------------------------------- //

// ------------ Call The Blueprint ------------ //
let snake = new Snake();
let apple = new Food();
let grape = new Food();
let orange = new Food();
let pear = new Food();
// ------------------------------------------- //


// ------------ Object Draw ------------ //
function drawObject(){
  snake.draw();
  snake.movement();
  snake.client.stream_move({
    body: snake.body,
    bodyLength: snake.bodyLength
  })
  snake.multiplayers_draw()
}
// ------------------------------------- //

// --------- To Make New Body ---------- //
function eat(){
  let head = snake.head();
  if (head[0] == apple.x && head[1] == apple.y) {
    snake.bodyLength++;
    apple.regenerate();
  }
  if (head[0] == grape.x && head[1] == grape.y) {
    snake.bodyLength++;
    grape.regenerate();
  }
  if (head[0] == pear.x && head[1] == pear.y) {
    snake.bodyLength++;
    pear.regenerate();
  }
  if (head[0] == orange.x && head[1] == orange.y) {
    snake.bodyLength++;
    orange.regenerate();
  }
}
// ------------------------------------- //

// -------- Draw Score ----------------- //
let score = 0;
function drawScore(){
  ctx.fillStyle = "white";
  ctx.font = "10px Verdana";
  ctx.fillText("Score " + score, canvas.width - 50, 100);
}
// ------------------------------------- //

// ------- Draw Food ------------------- //
function drawFood() {
  orange.drawOrange();
  apple.drawApple();
  grape.drawGrape();
  pear.drawPear();
}
// ------------------------------------- //

// ---------- Background --------------- //
function background() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.height, canvas.width);
}
// ------------------------------------ //


// ------- Map Generator ( from server ) ------ // 
//  TODO: Data ukuran map dari server.
//  function setMapSize(width, height) {
//    mapHeight = height;
//    mapWidth = width;
//    console.log("Map size set to ", mapHeight, mapWidth)
// }
//
// snake.client.socket.emit("get_map_size", (data) => {
//  setMapSize(data.width, data.height);
// }); 
// ------------------------------------------- // 



// ----------------- Keyboard Control ------------ //
document.body.addEventListener("keydown", keyDown);
function keyDown(e) {
  if (e.keyCode == 38) {
    snake.velocityY = -1;
    snake.velocityX = 0;
  }
  if (e.keyCode == 40) {
    snake.velocityY = 1;
    snake.velocityX = 0;
  }
  if (e.keyCode == 37) {
    snake.velocityX = -1;
    snake.velocityY = 0;
  }
  if (e.keyCode == 39) {
    snake.velocityX = 1;
    snake.velocityY = 0;
  }
}
// ----------------------------------------------- //

function gameLoop() {
  let speed = 1000;
  background();
  drawFood();
  drawScore();
  drawObject();
  eat();
  setTimeout(gameLoop, speed);
}

gameLoop();
