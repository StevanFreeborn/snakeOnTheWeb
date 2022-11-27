import { expect } from 'chai';
import Game from '../../game/game.js';
import Player from '../../game/player.js';
import { DEFAULT_PLAYER_ONE_POSITION, GRID_SIZE } from '../../shared/constants.js';

describe('game', function () {
  it('should be able to contruct a new game instance with given players', function () {
    const game = new Game([new Player(DEFAULT_PLAYER_ONE_POSITION)]);
    expect(game).to.be.an('object');
    
    expect(game).to.have.property('id');
    expect(game.id).to.be.a('string');
    
    expect(game).to.have.property('players');
    expect(game.players).to.be.an('array');
    expect(game.players.length).to.be.greaterThan(0);
    
    expect(game).to.have.property('food');
    expect(game.food).to.be.an('object');
    expect(game.food).to.have.property('x');
    expect(game.food.x).to.be.a('number');
    expect(game.food.x).to.be.greaterThanOrEqual(0).and.lessThanOrEqual(GRID_SIZE);
    expect(game.food).to.have.property('y');
    expect(game.food.y).to.be.a('number');
    expect(game.food.y).to.be.greaterThanOrEqual(0).and.lessThanOrEqual(GRID_SIZE);
    
    expect(game).to.have.property('gridSize', GRID_SIZE);
    expect(game.gridSize).to.be.a('number');
    
    expect(game).to.have.property('interval', null);
  });

  it('should throw an error if no players are provided to constructor', function () {
    expect(() => new Game()).to.throw('players is undefined');
  });

  it('should be able to generate a random grid position', function () {
    const game = new Game([new Player(DEFAULT_PLAYER_ONE_POSITION)]);
    const position = game.generateRandomGridPosition();
    expect(position).to.be.a('number');
    expect(position).to.be.greaterThanOrEqual(0).and.lessThanOrEqual(GRID_SIZE);
  });

  it('should be able to generate a random food position not on any players snake', function () {
    const game = new Game([new Player(DEFAULT_PLAYER_ONE_POSITION)]);
    const food = game.getRandomFoodPosition();
    expect(food).to.be.an('object');
    expect(food).to.have.property('x');
    expect(food.x).to.be.a('number');
    expect(food.x).to.be.greaterThanOrEqual(0).and.lessThanOrEqual(GRID_SIZE);
    expect(food).to.have.property('y');
    expect(food.y).to.be.a('number');
    expect(food.y).to.be.greaterThanOrEqual(0).and.lessThanOrEqual(GRID_SIZE);

    game.players.forEach(player => {
        player.snake.forEach(segment => {
            expect(food.x).to.not.equal(segment.x);
            expect(food.y).to.not.equal(segment.y);
        });
    });
  });

  it("should be able to update each players position by it's velocity", function () {
    expect.fail('not yet implemented');
  });

  it('should be able to get the winner of the game if a player has gone off the grid', function () {
    expect.fail('not yet implemented');
  });

  it("should be able to lengthen a player's snake and update the player's position if the snake has eaten the food", function () {
    expect.fail('not yet implemented');
  });

  it('should be able to generate a new random food postion if a player has eaten the food', function () {
    expect.fail('not yet implemented');
  });

  it('should be able to get the winner of the game if a player has eaten itself', function () {
    expect.fail('not yet implemented');
  });

  it("should maintain all player's snake's length who have velocity and have not eaten the food", function () {
    expect.fail('not yet implemented');
  });
});
