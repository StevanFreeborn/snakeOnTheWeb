import { GRID_SIZE } from './constants.js';

export const createGameState = () => {
  return {
    player: {
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
    },
    food: {
      x: 7,
      y: 7,
    },
    gridSize: GRID_SIZE,
  };
};
