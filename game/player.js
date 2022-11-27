import { GRID_SIZE } from '../shared/constants.js';

export default class Player {
  constructor(position) {
    if(!position) {
      throw new Error('position is undefined');
    }

    this.position = {
      x: position.x,
      y: position.y,
    };

    this.velocity = {
      x: 0,
      y: 0,
    };

    this.snake = new Array(3)
      .fill(null)
      .map((obj, index) => ({
        x: this.position.x - index,
        y: this.position.y,
      }))
      .reverse();
  }

  updatePosition = () => {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  };

  isOffGrid = () => {
    return (
      this.position.x < 0 ||
      this.position.x >= GRID_SIZE ||
      this.position.y < 0 ||
      this.position.y >= GRID_SIZE
    );
  };

  hasEatenFood = food => {
    return food.x === this.position.x && food.y === this.position.y;
  };

  lengthenSnake = () => {
    this.snake.push({ ...this.position });
  };

  shortenSnake = () => {
    this.snake.shift();
  };

  hasVelocity = () => {
    return this.velocity.x != 0 || this.velocity.y != 0;
  };

  hasEatenSelf = () => {
    return this.snake.some(
      segment => segment.x === this.position.x && segment.y === this.position.y
    );
  };

  snakeIsFacingRight = () => {
    const tail = this.snake[0];
    const head = this.snake[this.snake.length - 1];
    return head.x > tail.x && head.y == tail.y;
  };

  snakeIsFacingLeft = () => {
    const tail = this.snake[0];
    const head = this.snake[this.snake.length - 1];
    return head.x < tail.x && head.y == tail.y;
  };
}
