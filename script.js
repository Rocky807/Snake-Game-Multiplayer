let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");

function background(){
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  let msg_1 = "Background Has Been Run";
  console.log(msg_1);
}

function gameLoop(){
  background();
  let msgf = "All Part Of The Game Is Ready To Run";
  console.log(msgf);
}

gameLoop();
