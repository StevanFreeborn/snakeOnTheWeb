const BG_COLOR = '#231f20';
const SNAKE_COLOR = '#c2c2c2';
const FOOD_COLOR = '#e66916';

const gameScreen = document.getElementById('gam-screen');
let canvas;
let context;

const gameState = {
  player: {
    position: {
      x: 3,
      y: 10,
    },
    velocity: {
      x: 1,
      y: 0,
    },
    snake: [
      {
        x: 1,
        y: 10,
      },
      {
        x: 2,
        y: 10,
      },
      {
        x: 3,
        y: 10,
      },
    ],
  },
  food: {
    x: 7,
    y: 7,
  },
  gridSize: 20,
};

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
  console.log(e.key);
};

initialize();

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

drawGame(gameState);
