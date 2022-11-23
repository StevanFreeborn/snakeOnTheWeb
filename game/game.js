import { nanoid } from 'nanoid';
import { GRID_SIZE } from '../shared/constants.js';

export default class Game {
  constructor(players) {
    this.id = nanoid(10);
    this.players = players;
    this.food = this.getRandomFoodPosition();
    this.gridSize = GRID_SIZE;
    this.interval = null;
  }

  generateRandomGridPosition = () => {
    return Math.floor(Math.random() * GRID_SIZE);
  };

  getRandomFoodPosition = () => {
    const food = {
      x: this.generateRandomGridPosition(),
      y: this.generateRandomGridPosition(),
    };

    let foodIsOnSnake = false;

    for (const player of this.players) {
      for (const segment of player.snake) {
        if (segment.x === food.x && segment.y === food.y) {
          foodIsOnSnake = true;
          break;
        }
      }
    }

    if (foodIsOnSnake) {
      return this.getRandomFoodPosition();
    }

    return food;
  };

  getWinner = () => {
    const players = this.players;

    players.forEach(player => player.updatePosition());

    for (const [index, player] of players.entries()) {
      if (player.isOffGrid()) {
        return index == 0 ? 2 : 1;
      }
    }

    players.forEach(player => {
      if (player.hasEatenFood(this.food)) {
        player.lengthenSnake();
        player.updatePosition();
        this.food = this.getRandomFoodPosition();
      }
    });

    for (const [index, player] of players.entries()) {
      if (player.hasVelocity() && player.hasEatenSelf()) {
        return index == 0 ? 2 : 1;
      }

      if (player.hasVelocity()) {
        player.lengthenSnake();
        player.shortenSnake();
      }
    }
  };
}
