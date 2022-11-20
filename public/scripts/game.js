import GameModes from './gameModes.js';
import keyMappings from './keyMappings.js';
import SocketEvents from './socketEvents.js';

const BG_COLOR = '#231f20';
const SNAKE_COLOR_1 = '#974fe0';
const SNAKE_COLOR_2 = '#4651eb';
const FOOD_COLOR = '#e66916';

const socket = io();

const params = new URLSearchParams(window.location.search);
const mode = params.get('mode');
const gameId = params.get('gameId');

const gameScreen = document.getElementById('game-screen');
const gameCodeMessage = document.getElementById('gameCodeMessage');
const gameStatus = document.getElementById('gameStatus');
const playerIdentification = document.getElementById('playerIdentification');
let canvas;
let context;
let playerNumber;
let isGameActive = false;

const initialize = () => {
  canvas = document.getElementById('canvas');
  canvas.height = 600;
  canvas.width = 600;

  context = canvas.getContext('2d');
  context.fillStyle = BG_COLOR;
  context.fillRect(0, 0, canvas.width, canvas.height);

  document.addEventListener('keydown', handleKeydown);
  isGameActive = true;
};

const handleKeydown = e => {
  const mappedKeys = Object.keys(keyMappings);
  if (mappedKeys.find(key => key == e.key)) {
    e.preventDefault();
  }

  if (isGameActive == false) {
    return;
  }

  socket.emit(SocketEvents.keyDown, e.key);
};

const drawGame = state => {
  context.fillStyle = BG_COLOR;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const food = state.food;
  const gridSize = state.gridSize;
  const size = canvas.width / gridSize;

  context.fillStyle = FOOD_COLOR;
  context.fillRect(food.x * size, food.y * size, size, size);

  state.players.forEach((player, index) => {
    const color = index == 0 ? SNAKE_COLOR_1 : SNAKE_COLOR_2;
    drawPlayer(player, size, color);
  });
};

const drawPlayer = (playerState, size, color) => {
  const snake = playerState.snake;
  snake.forEach((segment, index, snake) => {
    const fillColor = index == snake.length - 1 ? 'white' : color;
    context.fillStyle = fillColor;
    context.fillRect(segment.x * size, segment.y * size, size, size);
  });
};

const handleInitialize = number => {
  playerNumber = number;
};

const handleGameState = gameState => {
  if (isGameActive == false) {
    return;
  }

  canvas.classList.remove('border-secondary');
  canvas.classList.add('border-info');
  gameStatus.innerText = 'Eat the food!';

  if (mode == GameModes.TwoPlayer) {
    const color = playerNumber == 1 ? SNAKE_COLOR_1 : SNAKE_COLOR_2;
    playerIdentification.innerHTML = `You are <span class="fw-bold fst-italic" style="color: ${color}">player ${playerNumber}</span>`;
  }

  requestAnimationFrame(() => drawGame(gameState));
};

const handleGameOver = data => {
  if (isGameActive == false) {
    return;
  }

  canvas.classList.toggle('border-info');

  if (data.winner === playerNumber) {
    gameStatus.innerHTML =
      '<span class="text-success fw-bold fst-italic">You won!</span> <a class="link-secondary" href="/">Play again?</a>';
    canvas.classList.toggle('border-success');
  } else {
    gameStatus.innerHTML =
      '<span class="text-danger fw-bold fst-italic">You lost!</span> <a class="link-secondary" href="/">Play again?</a>';
    canvas.classList.toggle('border-danger');
  }

  isGameActive = false;
};

const handleGameCode = data => {
  const html = `${data.message}<span id="gameCode" class="fw-bold fst-italic">${data.gameCode}</span>`;
  gameCodeMessage.innerHTML = html;
  gameStatus.innerText = 'Waiting for player 2...';
};

const handleGameNotFound = () => {
  gameStatus.innerHTML =
    'Sorry we couldn\'t find that game. Go back to the <a href="/" class="link-success">main menu</a>.';
};

const handleFullGame = () => {
  gameStatus.innerHTML =
    'Sorry this game is already full. Go back to the <a href="/" class="link-success">main menu</a>.';
};

socket.on(SocketEvents.initialize, handleInitialize);
socket.on(SocketEvents.gameState, handleGameState);
socket.on(SocketEvents.gameOver, handleGameOver);
socket.on(SocketEvents.gameCode, handleGameCode);
socket.on(SocketEvents.gameNotFound, handleGameNotFound);
socket.on(SocketEvents.gameFull, handleFullGame);

if (mode == GameModes.TwoPlayer && gameId) {
  socket.emit(SocketEvents.joinGame, gameId);
  initialize();
} else {
  socket.emit(SocketEvents.newGame, mode);
  initialize();
}
