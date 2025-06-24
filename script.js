const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let birdY = 200;
let birdVelocity = 0;
let gravity = 0.5;
let jump = -8;
let pipes = [];
let score = 0;
let gameStarted = false;

const birdColor = "#003366"; // dark blue
const pipeWidth = 50;
const pipeGap = 120;

function drawBird() {
  ctx.beginPath();
  ctx.arc(80, birdY, 15, 0, Math.PI * 2);
  ctx.fillStyle = birdColor;
  ctx.fill();
}

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height);
  });
}

function updatePipes() {
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
    let topHeight = Math.random() * 200 + 50;
    pipes.push({ x: canvas.width, top: topHeight });
  }
  pipes.forEach(pipe => pipe.x -= 2);
  if (pipes[0].x + pipeWidth < 0) {
    pipes.shift();
    score++;
  }
}

function detectCollision() {
  for (let pipe of pipes) {
    if (
      80 + 15 > pipe.x && 80 - 15 < pipe.x + pipeWidth &&
      (birdY - 15 < pipe.top || birdY + 15 > pipe.top + pipeGap)
    ) {
      return true;
    }
  }
  return birdY + 15 > canvas.height || birdY - 15 < 0;
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

function resetGame() {
  birdY = 200;
  birdVelocity = 0;
  pipes = [];
  score = 0;
}

function gameLoop() {
  if (!gameStarted) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  birdVelocity += gravity;
  birdY += birdVelocity;

  updatePipes();
  drawPipes();
  drawBird();
  drawScore();

  if (detectCollision()) {
    gameStarted = false;
    setTimeout(() => {
      alert("Game Over! Score: " + score);
      resetGame();
      document.getElementById("countdown").innerText = "เริ่มใน 2...";
      startCountdown();
    }, 50);
    return;
  }

  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", () => {
  if (!gameStarted) return;
  birdVelocity = jump;
});

document.addEventListener("touchstart", () => {
  if (!gameStarted) return;
  birdVelocity = jump;
});

function startCountdown() {
  let counter = 2;
  const countdownEl = document.getElementById("countdown");
  countdownEl.style.display = "block";
  const interval = setInterval(() => {
    countdownEl.innerText = "เริ่มใน " + counter + "...";
    counter--;
    if (counter < 0) {
      clearInterval(interval);
      countdownEl.style.display = "none";
      gameStarted = true;
      gameLoop();
    }
  }, 1000);
}

startCountdown();
