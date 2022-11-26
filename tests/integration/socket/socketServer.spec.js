import { io as Client } from 'socket.io-client';

import { expect } from 'chai';
import SocketEvents from '../../../shared/socketEvents.js';
import {
  DEFAULT_PLAYER_ONE_POSITION,
  DEFAULT_PLAYER_TWO_POSITION,
  GRID_SIZE,
} from '../../../shared/constants.js';
import setupApp from '../../../startup/setupApp.js';
import setupServer from '../../../startup/setupServer.js';

describe('socket server', function () {
  let server;
  let playerOneSocket;
  let playerTwoSocket;

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
    playerOneSocket = new Client(`http://localhost:${server.address().port}`);
    playerOneSocket.on('connect', () => {
      playerTwoSocket = new Client(`http://localhost:${server.address().port}`);
      playerTwoSocket.on('connect', done);
    });
  });

  afterEach(function () {
    playerOneSocket.close();
    playerTwoSocket.close();
  });

  it('should emit initialize event with player number back to client when client emits new game with mode set to one player', function (done) {
    playerOneSocket.emit(SocketEvents.newGame, 'one');

    playerOneSocket.on(SocketEvents.initialize, playerNumber => {
      expect(playerNumber).to.be.a('number');
      expect(playerNumber).to.be.equal(1);
      done();
    });
  });

  it('should emit initialize event with player number back to client when client emits new game with mode set to two player', function (done) {
    playerOneSocket.emit(SocketEvents.newGame, 'two');

    playerOneSocket.on(SocketEvents.initialize, playerNumber => {
      expect(playerNumber).to.be.a('number');
      expect(playerNumber).to.be.equal(1);
      done();
    });
  });

  it('should emit game code event with game code back to client when client emits new game with mode set to two player', function (done) {
    playerOneSocket.emit(SocketEvents.newGame, 'two');

    playerOneSocket.on(SocketEvents.gameCode, data => {
      expect(data).to.be.an('object');
      expect(data).to.have.property('message', 'Game code is ');
      expect(data).to.have.property('gameCode');
      expect(data.gameCode).to.be.a('string');
      done();
    });
  });

  it('should emit initialize event with player number back to client when client joins a two player game', function (done) {
    playerOneSocket.emit(SocketEvents.newGame, 'two');

    playerOneSocket.on(SocketEvents.initialize, playerNumber => {
      expect(playerNumber).to.be.a('number');
      expect(playerNumber).to.be.equal(1);

      playerOneSocket.on(SocketEvents.gameCode, data => {
        expect(data).to.be.an('object');
        expect(data).to.have.property('message', 'Game code is ');
        expect(data).to.have.property('gameCode');
        expect(data.gameCode).to.be.a('string');

        playerTwoSocket.emit(SocketEvents.joinGame, data.gameCode);

        playerTwoSocket.on(SocketEvents.initialize, playerNumber => {
          expect(playerNumber).to.be.a('number');
          expect(playerNumber).to.be.equal(2);
          done();
        });
      });
    });
  });

  it('should emit game code event with game code back to client when client joins a two player game', function (done) {
    playerOneSocket.emit(SocketEvents.newGame, 'two');

    playerOneSocket.on(SocketEvents.gameCode, data => {
      expect(data).to.be.an('object');
      expect(data).to.have.property('message', 'Game code is ');
      expect(data).to.have.property('gameCode');
      expect(data.gameCode).to.be.a('string');

      playerTwoSocket.emit(SocketEvents.joinGame, data.gameCode);

      playerTwoSocket.on(SocketEvents.gameCode, data => {
        expect(data).to.be.an('object');
        expect(data).to.have.property('message', "You've joined game ");
        expect(data).to.have.property('gameCode');
        expect(data.gameCode).to.be.a('string');
        done();
      });
    });
  });

  it('should emit game state event with game state back to client when client emits new game with mode set to one player', function (done) {
    playerOneSocket.emit(SocketEvents.newGame, 'one');

    playerOneSocket.on(SocketEvents.gameState, game => {
      expect(game).to.be.an('object');

      expect(game).to.have.property('id');
      expect(game.id).to.be.a('string');

      expect(game).to.have.property('players');
      expect(game.players).to.be.an('array');
      expect(game.players.length).to.be.equal(1);

      const player = game.players[0];
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

  it('should emit game state event with game state back to client when player two joins two player game', function (done) {
    playerOneSocket.emit(SocketEvents.newGame, 'two');

    playerOneSocket.on(SocketEvents.gameCode, data => {
      expect(data).to.be.an('object');
      expect(data).to.have.property('message', 'Game code is ');
      expect(data).to.have.property('gameCode');
      expect(data.gameCode).to.be.a('string');

      playerTwoSocket.emit(SocketEvents.joinGame, data.gameCode);

      playerOneSocket.on(SocketEvents.gameState, game => {
        expect(game).to.be.an('object');

        expect(game).to.have.property('id');
        expect(game.id).to.be.a('string');

        expect(game).to.have.property('players');
        expect(game.players).to.be.an('array');
        expect(game.players.length).to.be.equal(2);

        const playerOne = game.players[0];
        expect(playerOne).to.have.property('position');
        expect(playerOne.position).to.have.property(
          'x',
          DEFAULT_PLAYER_ONE_POSITION.x
        );
        expect(playerOne.position.x).to.be.a('number');
        expect(playerOne.position).to.have.property(
          'y',
          DEFAULT_PLAYER_ONE_POSITION.y
        );
        expect(playerOne.position.y).to.be.a('number');
        expect(playerOne).to.have.property('velocity');
        expect(playerOne.velocity).to.have.property('x', 0);
        expect(playerOne.velocity.x).to.be.a('number');
        expect(playerOne.velocity).to.have.property('y', 0);
        expect(playerOne.velocity.y).to.be.a('number');
        expect(playerOne).to.have.property('snake');
        expect(playerOne.snake).to.be.an('array');
        expect(playerOne.snake.length).to.be.equal(3);

        const snakeOne = playerOne.snake;
        snakeOne.forEach(segment => {
          expect(segment).to.be.an('object');
          expect(segment).to.have.property('x');
          expect(segment).to.have.property('y');
        });

        const playerTwo = game.players[1];
        expect(playerTwo).to.have.property('position');
        expect(playerTwo.position).to.have.property(
          'x',
          DEFAULT_PLAYER_TWO_POSITION.x
        );
        expect(playerTwo.position.x).to.be.a('number');
        expect(playerTwo.position).to.have.property(
          'y',
          DEFAULT_PLAYER_TWO_POSITION.y
        );
        expect(playerTwo.position.y).to.be.a('number');
        expect(playerTwo).to.have.property('velocity');
        expect(playerTwo.velocity).to.have.property('x', 0);
        expect(playerTwo.velocity.x).to.be.a('number');
        expect(playerTwo.velocity).to.have.property('y', 0);
        expect(playerTwo.velocity.y).to.be.a('number');
        expect(playerTwo).to.have.property('snake');
        expect(playerTwo.snake).to.be.an('array');
        expect(playerTwo.snake.length).to.be.equal(3);

        const snakeTwo = playerTwo.snake;
        snakeTwo.forEach(segment => {
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

        playerTwoSocket.on(SocketEvents.gameState, game => {
          expect(game).to.be.an('object');

          expect(game).to.have.property('id');
          expect(game.id).to.be.a('string');

          expect(game).to.have.property('players');
          expect(game.players).to.be.an('array');
          expect(game.players.length).to.be.equal(2);

          const playerOne = game.players[0];
          expect(playerOne).to.have.property('position');
          expect(playerOne.position).to.have.property(
            'x',
            DEFAULT_PLAYER_ONE_POSITION.x
          );
          expect(playerOne.position.x).to.be.a('number');
          expect(playerOne.position).to.have.property(
            'y',
            DEFAULT_PLAYER_ONE_POSITION.y
          );
          expect(playerOne.position.y).to.be.a('number');
          expect(playerOne).to.have.property('velocity');
          expect(playerOne.velocity).to.have.property('x', 0);
          expect(playerOne.velocity.x).to.be.a('number');
          expect(playerOne.velocity).to.have.property('y', 0);
          expect(playerOne.velocity.y).to.be.a('number');
          expect(playerOne).to.have.property('snake');
          expect(playerOne.snake).to.be.an('array');
          expect(playerOne.snake.length).to.be.equal(3);

          const snakeOne = playerOne.snake;
          snakeOne.forEach(segment => {
            expect(segment).to.be.an('object');
            expect(segment).to.have.property('x');
            expect(segment).to.have.property('y');
          });

          const playerTwo = game.players[1];
          expect(playerTwo).to.have.property('position');
          expect(playerTwo.position).to.have.property(
            'x',
            DEFAULT_PLAYER_TWO_POSITION.x
          );
          expect(playerTwo.position.x).to.be.a('number');
          expect(playerTwo.position).to.have.property(
            'y',
            DEFAULT_PLAYER_TWO_POSITION.y
          );
          expect(playerTwo.position.y).to.be.a('number');
          expect(playerTwo).to.have.property('velocity');
          expect(playerTwo.velocity).to.have.property('x', 0);
          expect(playerTwo.velocity.x).to.be.a('number');
          expect(playerTwo.velocity).to.have.property('y', 0);
          expect(playerTwo.velocity.y).to.be.a('number');
          expect(playerTwo).to.have.property('snake');
          expect(playerTwo.snake).to.be.an('array');
          expect(playerTwo.snake.length).to.be.equal(3);

          const snakeTwo = playerTwo.snake;
          snakeTwo.forEach(segment => {
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
  });

  it('should emit game state with updated player velocity back to client when client emits keydown event', function (done) {
    playerOneSocket.emit(SocketEvents.newGame, 'one');
    playerOneSocket.emit(SocketEvents.keyDown, 'ArrowRight');

    playerOneSocket.on(SocketEvents.gameState, game => {
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

  it('should emit the winner of the game back to client when a one player game ends', function (done) {
    playerOneSocket.emit(SocketEvents.newGame, 'one');
    playerOneSocket.emit(SocketEvents.keyDown, 'ArrowRight');

    playerOneSocket.on(SocketEvents.gameOver, winner => {
      expect(winner).to.be.a('number');
      expect(winner).to.be.equal(2);
      done();
    });
  });

  it('should emit the winner of the game back to both clients when a two player game ends', function (done) {
    playerOneSocket.emit(SocketEvents.newGame, 'two');

    playerOneSocket.on(SocketEvents.gameCode, data => {
      expect(data).to.be.an('object');
      expect(data).to.have.property('message', 'Game code is ');
      expect(data).to.have.property('gameCode');
      expect(data.gameCode).to.be.a('string');

      playerTwoSocket.emit(SocketEvents.joinGame, data.gameCode);
      playerOneSocket.emit(SocketEvents.keyDown, 'ArrowRight');

      playerOneSocket.on(SocketEvents.gameOver, winner => {
        expect(winner).to.be.a('number');
        expect(winner).to.be.equal(2);

        playerTwoSocket.on(SocketEvents.gameOver, winner => {
          expect(winner).to.be.a('number');
          expect(winner).to.be.equal(2);
          done();
        });
      });
    });
  });

  it('should emit the quitter of the game back to the remaining client in a two player game when a player quits', function (done) {
    playerOneSocket.emit(SocketEvents.newGame, 'two');

    playerOneSocket.on(SocketEvents.gameCode, data => {
      expect(data).to.be.an('object');
      expect(data).to.have.property('message', 'Game code is ');
      expect(data).to.have.property('gameCode');
      expect(data.gameCode).to.be.a('string');

      playerTwoSocket.emit(SocketEvents.joinGame, data.gameCode);
      playerOneSocket.close();

      playerTwoSocket.on(SocketEvents.playerQuit, quitter => {
        expect(quitter).to.be.a('number');
        expect(quitter).to.be.equal(1);
        done();
      });
    });
  });
});
