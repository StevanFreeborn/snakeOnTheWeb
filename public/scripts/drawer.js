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

  static drawGame = (context, state) => {
    context.fillStyle = BG_COLOR;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const food = state.food;
    const gridSize = state.gridSize;
    const size = canvas.width / gridSize;

    context.fillStyle = FOOD_COLOR;
    context.fillRect(food.x * size, food.y * size, size, size);

    state.players.forEach((player, index) => {
      const color = index == 0 ? SNAKE_COLOR_1 : SNAKE_COLOR_2;
      this.drawPlayer(context, player, size, color);
    });
  };
}
