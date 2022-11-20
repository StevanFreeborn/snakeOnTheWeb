import GameModes from './gameModes.js';
import SocketEvents from './socketEvents.js';

const BG_COLOR = '#231f20';
const SNAKE_COLOR_1 = '#c2c2c2';
const SNAKE_COLOR_2 = '#4651eb'
const FOOD_COLOR = '#e66916';

const socket = io();

const params = new URLSearchParams(window.location.search);
const mode = params.get('mode');
const gameId = params.get('gameId');

const gameScreen = document.getElementById('game-screen');
const gameCodeDisplay = document.getElementById('gameCode');
let canvas;
let context;
let playerNumber;
let isGameActive = false;

const initialize = () => {
  canvas = document.getElementById('canvas');
  canvas.width = 600;
  canvas.height = 600;

  context = canvas.getContext('2d');
  context.fillStyle = BG_COLOR;
  context.fillRect(0, 0, canvas.width, canvas.height);

  document.addEventListener('keydown', handleKeydown);
  isGameActive = true;
};

const handleKeydown = e => {
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
  })
};

const drawPlayer = (playerState, size, color) => {
  const snake = playerState.snake;
  context.fillStyle = color;

  snake.forEach(segment =>
    context.fillRect(segment.x * size, segment.y * size, size, size)
  );
};

const handleInitialize = number => {
  playerNumber = number
};

const handleGameState = gameState => {
  if (isGameActive == false) {
    return;
  }

  requestAnimationFrame(() => drawGame(gameState));
};

const handleGameOver = data => {
  if (isGameActive == false) {
    return;
  }

  // TODO: Display a game over message and provide options to quit or play again.
  if (data.winner === playerNumber) {
    alert('You won!');
    return;
  }
  
  alert('You lost.');

  isGameActive = false;
}

const handleGameCode = gameId => {
  gameCodeDisplay.innerText = `Your game code is ${gameId}`;
}

const handleGameNotFound = () => {
  alert('Game id not found');
}

const handleFullGame = () => {
  alert('Game is already full');
}

socket.on(SocketEvents.initialize, handleInitialize);
socket.on(SocketEvents.gameState, handleGameState);
socket.on(SocketEvents.gameOver, handleGameOver);
socket.on(SocketEvents.gameCode, handleGameCode);
socket.on(SocketEvents.gameNotFound, handleGameNotFound);
socket.on(SocketEvents.gameFull, handleFullGame);

if (mode == GameModes.TwoPlayer && gameId) {
  socket.emit(SocketEvents.joinGame, gameId);
  initialize();
} 
else {
  socket.emit(SocketEvents.newGame, mode);
  initialize();
}