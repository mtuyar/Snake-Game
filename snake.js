const gameBoard = document.getElementById("game-board");
const scoreElement = document.getElementById("score");
const restartBtn = document.getElementById("restart-btn");

const gridSize = 20; // Oyun tahtası boyutu (20x20)
let snake = [{ x: 10, y: 10 }]; // Yılanın başlangıç pozisyonu
let food = { x: 5, y: 5 }; // Yemin başlangıç pozisyonu
let direction = { x: 0, y: 0 }; // Yılanın başlangıç yönü
let score = 0; // Başlangıç skoru
let gameInterval; // Oyun döngüsü için interval
let isGameOver = false; // Oyunun bitip bitmediğini kontrol eder

// Oyun tahtasını oluştur
function createGameBoard() {
  gameBoard.innerHTML = ""; // Tahtayı temizle
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      gameBoard.appendChild(cell);
    }
  }
}

// Yılanı ve yemi çiz
function draw() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach(cell => {
    cell.classList.remove("snake", "food");
  });

  // Yılanı çiz
  snake.forEach(segment => {
    const index = segment.y * gridSize + segment.x;
    cells[index].classList.add("snake");
  });

  // Yemi çiz
  const foodIndex = food.y * gridSize + food.x;
  cells[foodIndex].classList.add("food");
}

// Yemi rastgele yerleştir
function placeFood() {
  food.x = Math.floor(Math.random() * gridSize);
  food.y = Math.floor(Math.random() * gridSize);

  // Yem yılanın üzerine gelirse yeniden yerleştir
  if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
    placeFood();
  }
}

// Yılanı hareket ettir
function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Duvar çarpması kontrolü
  if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
    gameOver();
    return;
  }

  // Kendine çarpması kontrolü
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  // Yem yendi mi?
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreElement.textContent = score;
    placeFood();
  } else {
    snake.pop();
  }
}

// Oyunu bitir
function gameOver() {
  isGameOver = true;
  clearInterval(gameInterval);
  alert(`Oyun Bitti! Skorunuz: ${score}`);
}

// Yeniden başlat
restartBtn.addEventListener("click", () => {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  score = 0;
  scoreElement.textContent = score;
  isGameOver = false;
  placeFood();
  gameInterval = setInterval(updateGame, 150);
});

// Klavye kontrolleri
window.addEventListener("keydown", e => {
  if (isGameOver) return;
  switch (e.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
});

// Oyunu güncelle
function updateGame() {
  if (isGameOver) return;
  moveSnake();
  draw();
}

// Oyunu başlat
function startGame() {
  createGameBoard();
  placeFood();
  gameInterval = setInterval(updateGame, 150);
}

// Sayfa yüklendiğinde oyunu başlat
window.addEventListener("load", startGame);