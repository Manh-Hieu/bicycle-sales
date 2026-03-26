const gameContainer = document.getElementById('gameContainer');
const menuScreen = document.getElementById('menuScreen');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const shotsDisplay = document.getElementById('shots');
const levelDisplay = document.getElementById('levelDisplay');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreDisplay = document.getElementById('finalScore');
const messageDisplay = document.getElementById('message');
const gameOverTitle = document.getElementById('gameOverTitle');

let score = 0;
let timeLeft = 30;
let shots = 5;
let gameActive = true;
let targetOnScreen = false;
let currentLevel = 1;
let timerInterval = null;

const levelConfig = {
  1: {
    time: 30,
    shots: 5,
    targetSize: 50,
    spawnDelay: 2000,
    displayName: '⭐ DỄ'
  },
  2: {
    time: 25,
    shots: 5,
    targetSize: 45,
    spawnDelay: 1500,
    displayName: '⭐⭐ BÌNH THƯỜNG'
  },
  3: {
    time: 20,
    shots: 5,
    targetSize: 40,
    spawnDelay: 1000,
    displayName: '⭐⭐⭐ KHÓ'
  },
  4: {
    time: 15,
    shots: 5,
    targetSize: 35,
    spawnDelay: 800,
    displayName: '⭐⭐⭐⭐ SIÊU KHÓ'
  }
};

function startGame(level) {
  currentLevel = level;
  const config = levelConfig[level];

  score = 0;
  timeLeft = config.time;
  shots = config.shots;
  gameActive = true;
  targetOnScreen = false;

  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  shotsDisplay.textContent = shots;
  levelDisplay.textContent = level;

  menuScreen.style.display = 'none';
  gameContainer.style.display = 'block';
  gameOverScreen.style.display = 'none';

  createTarget();
  startTimer();
}

function createTarget() {
  if (!gameActive || targetOnScreen) return;

  const config = levelConfig[currentLevel];
  const size = config.targetSize;

  const target = document.createElement('div');
  target.className = 'target';
  target.style.width = size + 'px';
  target.style.height = size + 'px';

  const x = Math.random() * (gameContainer.clientWidth - size);
  const y = Math.random() * (gameContainer.clientHeight - size);

  target.style.left = x + 'px';
  target.style.top = y + 'px';

  target.addEventListener('click', (e) => {
    e.stopPropagation();
    hitTarget(target);
  });

  gameContainer.appendChild(target);
  targetOnScreen = true;

  setTimeout(() => {
    if (target.parentNode) {
      target.remove();
      targetOnScreen = false;
      createTarget();
    }
  }, config.spawnDelay);
}

function hitTarget(target) {
  if (!gameActive) return;

  score += 10;
  shots--;
  scoreDisplay.textContent = score;
  shotsDisplay.textContent = shots;

  const hitEffect = document.createElement('div');
  hitEffect.className = 'hit-effect';
  hitEffect.textContent = '+10';
  hitEffect.style.left = target.style.left;
  hitEffect.style.top = target.style.top;
  gameContainer.appendChild(hitEffect);

  setTimeout(() => hitEffect.remove(), 1000);

  target.remove();
  targetOnScreen = false;

  if (shots > 0) {
    createTarget();
  } else {
    endGame();
  }
}

gameContainer.addEventListener('click', (e) => {
  if (gameActive && shots > 0) {
    shots--;
    shotsDisplay.textContent = shots;

    if (shots === 0) {
      endGame();
    }
  }
});

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      if (gameActive) {
        endGame();
      }
    }
  }, 1000);
}

function endGame() {
  gameActive = false;
  clearInterval(timerInterval);
  gameOverScreen.style.display = 'block';
  finalScoreDisplay.textContent = score;

  let message = '';
  if (score >= 80) {
    message = '🏆 SIÊU XUẤT SẮC! Bạn là xạ thủ hạng nhất!';
    gameOverTitle.textContent = '🎉 CHIẾN THẮNG! 🎉';
  } else if (score >= 60) {
    message = '⭐ Tuyệt vời! Bạn xứng đáng lên level tiếp!';
  } else if (score >= 40) {
    message = '👍 Tốt lắm! Cố gắng thêm một chút nữa!';
  } else if (score >= 20) {
    message = '💪 Không tệ! Luyện tập thêm nào!';
  } else {
    message = '🎯 Bắt đầu lại! Bạn sẽ tốt hơn!';
  }
  messageDisplay.textContent = message;
}

function backToMenu() {
  clearInterval(timerInterval);
  gameContainer.style.display = 'none';
  menuScreen.style.display = 'flex';
  gameOverScreen.style.display = 'none';
}
