import { expect } from 'chai';
import GameFactory from '../../game/gameFactory.js';
import { GRID_SIZE } from '../../shared/constants.js';
import GameModes from '../../shared/gameModes.js';

describe('gameFactory', function () {
    it('should be able to create a one player game', function () {
        const game = GameFactory.createGame(GameModes.OnePlayer);

        expect(game).to.be.an('object');
        
        expect(game).to.have.property('id');
        expect(game.id).to.be.a('string');
        
        expect(game).to.have.property('players');
        expect(game.players).to.be.an('array');
        expect(game.players.length).to.be.equal(1);
        
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
    })

    it('should be able to create a two player game', function () {
        const game = GameFactory.createGame(GameModes.TwoPlayer);

        expect(game).to.be.an('object');
        
        expect(game).to.have.property('id');
        expect(game.id).to.be.a('string');
        
        expect(game).to.have.property('players');
        expect(game.players).to.be.an('array');
        expect(game.players.length).to.be.equal(2);
        
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
});