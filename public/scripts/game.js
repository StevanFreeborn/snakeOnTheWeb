import GameModes from './gameModes.js';
import SocketEvents from './socketEvents.js';

const BG_COLOR = '#231f20';
const SNAKE_COLOR = '#c2c2c2';
const FOOD_COLOR = '#e66916';

const socket = io();

const params = new URLSearchParams(window.location.search);
const mode = params.get('mode');
const gameId = params.get('gameId');

const gameScreen = document.getElementById('game-screen');
let canvas;
let context;

const initialize = () => {
  canvas = document.getElementById('canvas');
  canvas.width = 600;
  canvas.height = 600;

  context = canvas.getContext('2d');
  context.fillStyle = BG_COLOR;
  context.fillRect(0, 0, canvas.width, canvas.height);

  document.addEventListener('keydown', handleKeydown);
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

  drawPlayer(state.player, size, SNAKE_COLOR);
};

const drawPlayer = (playerState, size, color) => {
  const snake = playerState.snake;
  context.fillStyle = color;

  snake.forEach(segment =>
    context.fillRect(segment.x * size, segment.y * size, size, size)
  );
};

const handleInitialize = message => {
  console.log(message);
};

const handleGameState = gameState => {
  requestAnimationFrame(() => drawGame(gameState));
};

const handleGameOver = () => {
  // TODO: Display a game over message and provide options to quit or play again.
  alert('oh no you lost!');
}

socket.on(SocketEvents.initialize, handleInitialize);
socket.on(SocketEvents.gameState, handleGameState);
socket.on(SocketEvents.gameOver, handleGameOver);

if (mode == GameModes.TwoPlayer && gameId) {
    socket.emit(SocketEvents.joinGame, gameId);
}

if (mode == GameModes.TwoPlayer) {
    socket.emit(SocketEvents.newTwoPlayerGame);
}

if (mode == GameModes.OnePlayer) {
    socket.emit(SocketEvents.newOnePlayerGame)
}