import { io as Client } from 'socket.io-client';

import { expect } from 'chai';
import SocketEvents from '../../../shared/socketEvents.js';
import { DEFAULT_PLAYER_ONE_POSITION, GRID_SIZE } from '../../../shared/constants.js';
import setupApp from '../../../startup/setupApp.js';
import setupServer from '../../../startup/setupServer.js';

describe('socket server', function () {
  let server;
  let clientSocket;

  before(function (done) {
    const app = setupApp();
    server = setupServer(app);
    server = server.listen(process.env.PORT || 8000, done);
  });

  after(function (done) {
    server.close();
    done();
  });

  beforeEach(function (done) {
    clientSocket = new Client(`http://localhost:${server.address().port}`);
    clientSocket.on('connect', done);
  });

  afterEach(function () {
    clientSocket.close();
  });

  it('should emit initialize event with player number back to client when client emits new game with mode set to one player', function (done) {
    clientSocket.emit(SocketEvents.newGame, 'one');

    clientSocket.on(SocketEvents.initialize, playerNumber => {
      expect(playerNumber).to.be.a('number');
      expect(playerNumber).to.be.equal(1);
      done();
    });
  });

  it('should emit game state event with game state back to client when client emits new game with mode set to one player', function (done) {
    clientSocket.emit(SocketEvents.newGame, 'one');

    clientSocket.on(SocketEvents.gameState, game => {
      expect(game).to.be.an('object');

      expect(game).to.have.property('id');
      expect(game.id).to.be.a('string');

      expect(game).to.have.property('players');
      expect(game.players).to.be.an('array');
      expect(game.players.length).to.be.equal(1);

      const player = game.players[0];
      expect(player).to.have.property('position');
      expect(player.position).to.have.property('x', DEFAULT_PLAYER_ONE_POSITION.x);
      expect(player.position.x).to.be.a('number');
      expect(player.position).to.have.property('y', DEFAULT_PLAYER_ONE_POSITION.y);
      expect(player.position.y).to.be.a('number');
      expect(player).to.have.property('velocity');
      expect(player.velocity).to.have.property('x', 0);
      expect(player.velocity.x).to.be.a('number');
      expect(player.velocity).to.have.property('y', 0);
      expect(player.velocity.y).to.be.a('number');
      expect(player).to.have.property('snake');
      expect(player.snake).to.be.an('array');
      expect(player.snake.length).to.be.equal(3);

      const snake = player.snake;
      snake.forEach(segment => {
        expect(segment).to.be.an('object');
        expect(segment).to.have.property('x');
        expect(segment).to.have.property('y');
      });

      expect(game).to.have.property('food');
      expect(game.food).to.be.an('object');
      expect(game.food).to.have.property('x');
      expect(game.food).to.have.property('y');

      expect(game).to.have.property('gridSize');
      expect(game.gridSize).to.be.a('number');
      expect(game.gridSize).to.be.equal(GRID_SIZE);

      expect(game).to.have.property('interval');
      expect(game.interval).to.be.an('object');

      done();
    });
  });

  it('should emit game state with updated player velocity back to client when client emits keydown event', function (done) {
    clientSocket.emit(SocketEvents.newGame, 'one');
    clientSocket.emit(SocketEvents.keyDown, 'ArrowRight');

    clientSocket.on(SocketEvents.gameState, game => {
      expect(game).to.be.an('object');

      expect(game).to.have.property('id');
      expect(game.id).to.be.a('string');

      expect(game).to.have.property('players');
      expect(game.players).to.be.an('array');
      expect(game.players.length).to.be.equal(1);

      const player = game.players[0];
      expect(player).to.have.property('position');
      expect(player.position).to.have.property('x');
      expect(player.position.x).to.be.a('number');
      expect(player.position).to.have.property('y');
      expect(player.position.y).to.be.a('number');
      expect(player).to.have.property('velocity');
      expect(player.velocity).to.have.property('x', 1);
      expect(player.velocity.x).to.be.a('number');
      expect(player.velocity).to.have.property('y', 0);
      expect(player.velocity.y).to.be.a('number');
      expect(player).to.have.property('snake');
      expect(player.snake).to.be.an('array');

      const snake = player.snake;
      snake.forEach(segment => {
        expect(segment).to.be.an('object');
        expect(segment).to.have.property('x');
        expect(segment).to.have.property('y');
      });

      expect(game).to.have.property('food');
      expect(game.food).to.be.an('object');
      expect(game.food).to.have.property('x');
      expect(game.food).to.have.property('y');

      expect(game).to.have.property('gridSize');
      expect(game.gridSize).to.be.a('number');
      expect(game.gridSize).to.be.equal(GRID_SIZE);

      expect(game).to.have.property('interval');
      expect(game.interval).to.be.an('object');

      done();
    });
  });
});
