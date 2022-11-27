import { expect } from 'chai';
import Player from '../../game/player.js';
import { DEFAULT_PLAYER_ONE_POSITION, GRID_SIZE } from '../../shared/constants.js';

describe('player', function () {
  it('should be able to construct a new player instance with given position', function () {
    const player = new Player(DEFAULT_PLAYER_ONE_POSITION);
    expect(player).to.be.a('object');
    expect(player).to.have.property('position');
    expect(player.position).to.have.property(
      'x',
      DEFAULT_PLAYER_ONE_POSITION.x
    );
    expect(player.position.x).to.be.a('number');
    expect(player.position).to.have.property(
      'y',
      DEFAULT_PLAYER_ONE_POSITION.y
    );
    expect(player.position.y).to.be.a('number');
    expect(player).to.have.property('velocity');
    expect(player.velocity).to.have.property('x', 0);
    expect(player.velocity.x).to.be.a('number');
    expect(player.velocity).to.have.property('y', 0);
    expect(player.velocity.y).to.be.a('number');
    expect(player).to.have.property('snake');
    expect(player.snake).to.be.an('array');
    expect(player.snake.length).to.be.equal(3);

    const snakeOne = player.snake;
    snakeOne.forEach(segment => {
      expect(segment).to.be.an('object');
      expect(segment).to.have.property('x');
      expect(segment).to.have.property('y');
    });
  });

  it("should be able to update it's position by it's velocity", function () {
    const player = new Player(DEFAULT_PLAYER_ONE_POSITION);
    const playerOriginalPos = Object.assign({}, player.position);

    player.velocity = {
        x: 1,
        y: 0,
    }

    player.updatePosition();

    expect(player.position.x).to.be.equal(playerOriginalPos.x + 1);
    expect(player.position.y).to.be.equal(playerOriginalPos.y);
  });

  it("should be able to tell that it's position is on the grid", function () {
    const player = new Player(DEFAULT_PLAYER_ONE_POSITION);
    expect(player.isOffGrid()).to.be.equal(false);
  });

  it("should be able to tell that it's position is off the left side of the grid", function () {
    const player = new Player(DEFAULT_PLAYER_ONE_POSITION);
    player.position.x = -1;
    expect(player.isOffGrid()).to.be.equal(true);
  });

  it("should be able to tell that it's position is off the top side of the grid", function () {
    const player = new Player(DEFAULT_PLAYER_ONE_POSITION);
    player.position.y = -1;
    expect(player.isOffGrid()).to.be.equal(true);
  });

  it("should be able to tell that it's position is off the right side of the grid", function () {
    const player = new Player(DEFAULT_PLAYER_ONE_POSITION);
    player.position.x = GRID_SIZE + 1;
    expect(player.isOffGrid()).to.be.equal(true);
  });

  it("should be able to tell that it's position is off the bottom side of the grid", function () {
    const player = new Player(DEFAULT_PLAYER_ONE_POSITION);
    player.position.x = GRID_SIZE + 1;
    expect(player.isOffGrid()).to.be.equal(true);
  });

  it('should be able to tell if it has eaten the currently placed food', function () {
    const player = new Player(DEFAULT_PLAYER_ONE_POSITION);
    expect(player.hasEatenFood({ x: 3, y: 10 })).to.be.equal(true);
  });

  it('should be able to tell if it has not eaten the currently placed food', function () {
    const player = new Player(DEFAULT_PLAYER_ONE_POSITION);
    expect(player.hasEatenFood({ x: 4, y: 11 })).to.be.equal(false);
  });

  it('should be able to determine if it has velocity', function () {
    const player = new Player(DEFAULT_PLAYER_ONE_POSITION);
    player.velocity = { x: 1, y: 0 };
    expect(player.hasVelocity()).to.be.equal(true);
  });

  it("should be able to determine if it doesn't have velocity", function () {
    const player = new Player(DEFAULT_PLAYER_ONE_POSITION);
    expect(player.hasVelocity()).to.be.equal(false);
  });

  it('should be able to determine if it has eaten itself', function () {
    const player = new Player(DEFAULT_PLAYER_ONE_POSITION);
    player.snake = [
      { x: 3, y: 10 },
      { x: 4, y: 10 },
      { x: 5, y: 10 },
      { x: 5, y: 9 },
      { x: 5, y: 8 },
      { x: 4, y: 8 },
      { x: 4, y: 9 },
      { x: 4, y: 10},
    ];

    expect(player.hasEatenSelf()).to.be.equal(true);
  });

  it('should be able to determine if it has not eaten itself', function () {
    const player = new Player(DEFAULT_PLAYER_ONE_POSITION);
    expect(player.hasEatenSelf()).to.be.equal(true);
  });

  it("should be able to determine if it's snake is facing right", function () {
    const player = new Player(DEFAULT_PLAYER_ONE_POSITION);
    expect(player.snakeIsFacingRight()).to.be.equal(true);
  });

  it("should be able to determine if it's snake is not facing right", function () {
    const player = new Player(DEFAULT_PLAYER_ONE_POSITION);
    player.snake.reverse();
    expect(player.snakeIsFacingRight()).to.be.equal(false);
  });

  it("should be able to determine if it's snake is facing left", function () {
    const player = new Player(DEFAULT_PLAYER_ONE_POSITION);
    player.snake.reverse();
    expect(player.snakeIsFacingLeft()).to.be.equal(true);
  });

  it("should be able to determine if it's snake is not facing left", function () {
    const player = new Player(DEFAULT_PLAYER_ONE_POSITION);
    expect(player.snakeIsFacingLeft()).to.be.equal(false);
  });

  it("should be able to lengthen it's snake", function () {
    const player = new Player(DEFAULT_PLAYER_ONE_POSITION);
    const playerSnakeOrgLength = player.snake.length;
    player.lengthenSnake();
    expect(player.snake.length).to.be.equal(playerSnakeOrgLength + 1);
  });

  it("should be able to shorten it's snake", function () {
    const player = new Player(DEFAULT_PLAYER_ONE_POSITION);
    const playerSnakeOrgLength = player.snake.length;
    player.shortenSnake();
    expect(player.snake.length).to.be.equal(playerSnakeOrgLength - 1);
  });
});
