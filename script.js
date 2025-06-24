
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let birdY = 200;
let birdVelocity = 0;
const gravity = 0.5;
let score = 0;
let pipes = [];
let gameRunning = true;

function drawBird() {
  ctx.fillStyle = "#ffcc00";
  ctx.beginPath();
  ctx.arc(80, birdY, 15, 0, Math.PI * 2);
  ctx.fill();
}

function drawPipes() {
  ctx.fillStyle = "#339966";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, 50, pipe.top);
    ctx.fillRect(pipe.x, pipe.top + 120, 50, canvas.height - pipe.top - 120);
  });
}

function updatePipes() {
  pipes.forEach(pipe => {
    pipe.x -= 2;
  });

  if (pipes.length === 0 || pipes[pipes.length - 1].x < 200) {
    const topHeight = Math.floor(Math.random() * 200) + 50;
    pipes.push({ x: canvas.width, top: topHeight });
  }

  if (pipes[0].x + 50 < 0) {
    pipes.shift();
    score++;
    document.getElementById("scoreDisplay").textContent = "คะแนน: " + score;
  }
}

function checkCollision() {
  if (birdY < 0 || birdY > canvas.height) return true;

  for (let pipe of pipes) {
    if (
      pipe.x < 95 &&
      pipe.x + 50 > 65 &&
      (birdY < pipe.top || birdY > pipe.top + 120)
    ) {
      return true;
    }
  }
  return false;
}

function showGameOver() {
  gameRunning = false;
  document.getElementById("gameOver").classList.remove("hidden");
  document.getElementById("finalScore").textContent = "คะแนนสุดท้าย: " + score;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
  updatePipes();

  birdY += birdVelocity;
  birdVelocity += gravity;

  if (checkCollision()) {
    showGameOver();
    return;
  }

  if (gameRunning) {
    requestAnimationFrame(gameLoop);
  }
}

function flap() {
  if (gameRunning) {
    birdVelocity = -8;
  }
}

function restartGame() {
  birdY = 200;
  birdVelocity = 0;
  score = 0;
  pipes = [];
  gameRunning = true;
  document.getElementById("scoreDisplay").textContent = "คะแนน: 0";
  document.getElementById("gameOver").classList.add("hidden");
  gameLoop();
}

canvas.addEventListener("click", flap);
document.addEventListener("keydown", flap);

gameLoop();
