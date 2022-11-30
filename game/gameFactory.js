import GameModes from '../shared/gameModes.js';
import Game from './game.js';
import Player from './player.js';
import SocketEvents from '../shared/socketEvents.js';
import {
  DEFAULT_PLAYER_ONE_POSITION,
  DEFAULT_PLAYER_TWO_POSITION,
  FRAME_RATE,
  GAME_RATE,
} from '../shared/constants.js';

export default class GameFactory {
  static createGame(mode) {
    if (!mode) {
      return;
    }
    const game = new Game([new Player(DEFAULT_PLAYER_ONE_POSITION)]);

    if (mode == GameModes.TwoPlayer) {
      game.players.push(new Player(DEFAULT_PLAYER_TWO_POSITION));
    }

    return game;
  }

  static createGameLoop = (io, clientToGameMap, games, gameId) => {
    let lastTime = Date.now();
    let gameUpdateTimer = 0;
    
    const intervalId = setInterval(async () => {
      const game = games[gameId];
      game.interval = intervalId;

      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      io.sockets.in(game.id).emit(SocketEvents.gameState, game);

      if (gameUpdateTimer >= 1000 / GAME_RATE) {
        game.updatePlayerPositions();
        const winner = game.getWinner();

        if (!winner) {
          game.checkIfAPlayerHasEatenFood();
          game.updatePlayersSnake();
          io.sockets.in(game.id).emit(SocketEvents.gameState, game);
          gameUpdateTimer = 0
          return;
        }

        io.in(game.id).emit(SocketEvents.gameOver, winner);

        const clients = await io.in(game.id).fetchSockets();

        clients.forEach(client => delete clientToGameMap[client.id]);
        delete games[game.id];

        clearInterval(intervalId);
      }
      else {
        gameUpdateTimer += deltaTime
      }
    }, 1000 / FRAME_RATE);
  };
}
