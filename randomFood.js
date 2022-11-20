import { GRID_SIZE } from './constants.js';

const generateRandomGridPosition = () => {
  return Math.floor(Math.random() * GRID_SIZE);
};

export const randomFood = state => {
  const food = {
    x: generateRandomGridPosition(),
    y: generateRandomGridPosition(),
  };

  const foodIsOnSnake = state.player.snake.some(
    segment => segment.x === food.x && segment.y === food.y
  );

  if (foodIsOnSnake) {
    return randomFood(state);
  }

  state.food = food;
};
