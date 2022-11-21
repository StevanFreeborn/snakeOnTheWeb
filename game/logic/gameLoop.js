import { GRID_SIZE } from '../../shared/constants.js';
import { randomFood } from '../state/randomFood.js';

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

  const players = state.players;

  players.forEach(player => updatePlayerPosition(player));

  for (const [index, player] of players.entries()) {
    if (isOffGrid(player)) {
      return index == 0 ? 2 : 1;
    }
  }

  players.forEach(player => {
    if (hasEatenFood(player, state.food)) {
      player.snake.push({ ...player.position });
      updatePlayerPosition(player);
      randomFood(state);
    }
  });

  for (const [index, player] of players.entries()) {
    if (hasVelocity(player) && hasEatenSelf(player)) {
      return index == 0 ? 2 : 1;
    }

    if (hasVelocity(player)) {
      player.snake.push({ ...player.position });
      player.snake.shift();
    }
  }
};
