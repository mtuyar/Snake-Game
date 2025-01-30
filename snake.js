const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas dimensions
canvas.width = 400;
canvas.height = 400;

// Game variables
let snake = [{ x: 200, y: 200 }];
let dx = 10;
let dy = 0;
let food = { x: 300, y: 300 };
let score = 0;
let gameLoopInterval;

// Key press event listener
document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  if (keyPressed === 37 && !goingRight) {
    dx = -10;
    dy = 0;
  }

  if (keyPressed === 38 && !goingDown) {
    dx = 0;
    dy = -10;
  }

  if (keyPressed === 39 && !goingLeft) {
    dx = 10;
    dy = 0;
  }

  if (keyPressed === 40 && !goingUp) {
    dx = 0;
    dy = 10;
  }
}

function drawRect(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 10, 10);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawFood() {
  drawRect(food.x, food.y, 'red');
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  const didEatFood = snake[0].x === food.x && snake[0].y === food.y;
  if (didEatFood) {
    score += 10;
    document.getElementById('score').textContent = score;
    createFood();
  } else {
    snake.pop();
  }
}

function createFood() {
  food.x = Math.floor(Math.random() * 40) * 10;
  food.y = Math.floor(Math.random() * 40) * 10;
}

function checkCollision() {
  const hitWall =
    snake[0].x < 0 ||
    snake[0].x >= canvas.width ||
    snake[0].y < 0 ||
    snake[0].y >= canvas.height;

  const hitSelf = snake.slice(1).some(segment => segment.x === snake[0].x && segment.y === snake[0].y);

  return hitWall || hitSelf;
}

function gameOver() {
  clearInterval(gameLoopInterval);
  alert('Game Over! Your Score: ' + score);
}

function gameLoop() {
  if (checkCollision()) {
    gameOver();
    return;
  }

  clearCanvas();
  drawFood();
  moveSnake();

  snake.forEach(segment => drawRect(segment.x, segment.y, 'green'));
}

// Restart button functionality
document.getElementById('restartButton').addEventListener('click', () => {
  snake = [{ x: 200, y: 200 }];
  dx = 10;
  dy = 0;
  score = 0;
  document.getElementById('score').textContent = score;
  createFood();
  clearInterval(gameLoopInterval);
  gameLoopInterval = setInterval(gameLoop, 100);
});

// Start the game
gameLoopInterval = setInterval(gameLoop, 100);
createFood();