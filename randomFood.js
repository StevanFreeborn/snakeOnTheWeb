import { GRID_SIZE } from './shared/constants.js';

const generateRandomGridPosition = () => {
  return Math.floor(Math.random() * GRID_SIZE);
};

export const randomFood = state => {
  const food = {
    x: generateRandomGridPosition(),
    y: generateRandomGridPosition(),
  };

  let foodIsOnSnake = false;
  
  for (const player of state.players) {
    for (const segment of player.snake) {
      if (segment.x === food.x && segment.y === food.y) {
        foodIsOnSnake = true;
        break;
      }
    }
  }

  if (foodIsOnSnake) {
    return randomFood(state);
  }

  state.food = food;
};
