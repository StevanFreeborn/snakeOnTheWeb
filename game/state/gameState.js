import { GRID_SIZE } from '../../shared/constants.js';
import GameModes from '../../shared/gameModes.js';
import { randomFood } from './randomFood.js';

const createGameState = mode => {
  const gameState = {
    players: [{
      position: {
        x: 3,
        y: 10,
      },
      velocity: {
        x: 0,
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
    }],
    food: {},
    gridSize: GRID_SIZE,
  };

  if (mode == GameModes.TwoPlayer) {
    const secondPlayer = {
      position: {
        x: 18,
        y: 10,
      },
      velocity: {
        x: 0,
        y: 0,
      },
      snake: [
        {
          x: 20,
          y: 10,
        },
        {
          x: 19,
          y: 10,
        },
        {
          x: 18,
          y: 10,
        },
      ],
    };

    gameState.players.push(secondPlayer);
  }

  return gameState;
};

export const initializeGameState = (mode) => {
  const state = createGameState(mode);
  randomFood(state);
  return state;
}


