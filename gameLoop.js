import { GRID_SIZE } from './constants.js';
import { randomFood } from './randomFood.js';

const updatePlayerPosition = player => {
  player.position.x += player.velocity.x;
  player.position.y += player.velocity.y;
};

const isOffGrid = player => {
  return (
    player.position.x < 0 ||
    player.position.x > GRID_SIZE ||
    player.position.y < 0 ||
    player.position.y > GRID_SIZE
  );
};

const hasEatenFood = (player, food) => {
  return food.x === player.position.x && food.y === player.position.y;
};

const hasVelocity = player => {
  return player.velocity.x || player.velocity.y;
};

const hasEatenSelf = player => {
  return player.snake.some(
    segment =>
      segment.x === player.position.x && segment.y === player.position.y
  );
};

export const gameLoop = state => {
  if (!state) {
    return;
  }

  const playerOne = state.player;

  updatePlayerPosition(playerOne);

  if (isOffGrid(playerOne)) {
    return 2;
  }

  if (hasEatenFood(playerOne, state.food)) {
    playerOne.snake.push({ ...playerOne.position });
    updatePlayerPosition(playerOne);
    randomFood(state);
  }

  if (hasVelocity(playerOne) && hasEatenSelf(playerOne)) {
    return 2;
  }

  playerOne.snake.push({ ...playerOne.position });
  playerOne.snake.shift();
};
