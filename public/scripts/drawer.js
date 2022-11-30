import {
  BG_COLOR,
  FOOD_COLOR,
  SNAKE_COLOR_1,
  SNAKE_COLOR_2,
} from '../../shared/constants.js';

export default class Drawer {
  static drawPlayer = (context, playerState, size, color) => {
    const snake = playerState.snake;
    snake.forEach((segment, index, snake) => {
      const fillColor = index == snake.length - 1 ? 'white' : color;
      context.fillStyle = fillColor;
      context.fillRect(segment.x * size, segment.y * size, size, size);
    });
  };

  static drawGame = (clientState, gameState) => {
    clientState.context.clearRect(0, 0, clientState.canvas.width, clientState.canvas.height);
    clientState.context.fillStyle = BG_COLOR;
    clientState.context.fillRect(0, 0, clientState.canvas.width, clientState.canvas.height);

    const food = gameState.food;
    const gridSize = gameState.gridSize;
    const size = clientState.canvas.width / gridSize;

    clientState.context.fillStyle = FOOD_COLOR;
    clientState.context.fillRect(food.x * size, food.y * size, size, size);

    gameState.players.forEach((player, index) => {
      const color = index == 0 ? SNAKE_COLOR_1 : SNAKE_COLOR_2;
      this.drawPlayer(clientState.context, player, size, color);
    });
  };
}
