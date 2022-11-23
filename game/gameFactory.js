import GameModes from '../shared/gameModes.js';
import Game from './game.js';
import Player from './player.js';
import SocketEvents from '../shared/socketEvents.js';
import {
  DEFAULT_PLAYER_ONE_POSITION,
  DEFAULT_PLAYER_TWO_POSITION,
  FRAME_RATE
} from '../shared/constants.js';

export default class GameFactory {
  static createGame(mode) {
    if (!mode) {
      return;
    }
    const game = new Game([
      new Player(DEFAULT_PLAYER_ONE_POSITION),
    ]);

    if (mode == GameModes.TwoPlayer) {
      game.players.push(
        new Player(DEFAULT_PLAYER_TWO_POSITION)
      );
    }

    return game;
  }

  static createGameInterval = (io, clientToGameMap, games, gameId) => {
    const intervalId = setInterval(async () => {
      const game = games[gameId];
      game.interval = intervalId;
      const winner = game.getWinner();
  
      if (!winner) {
        io.sockets.in(game.id).emit(SocketEvents.gameState, game);
        return;
      }
      
      io.in(game.id).emit(SocketEvents.gameOver, winner);
  
      const clients = await io.in(game.id).fetchSockets();
      
      clients.forEach(client => delete clientToGameMap[client.id]);
      delete games[game.id];
  
      clearInterval(intervalId);
    }, 1000 / FRAME_RATE);
  };
}
