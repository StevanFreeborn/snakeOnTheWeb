import { FRAME_RATE } from '../../shared/constants.js';
import { gameLoop } from './gameLoop.js';
import SocketEvents from '../../shared/socketEvents.js';

export const createGameInterval = (io, clientToGameMap, games, gameId) => {
  const intervalId = setInterval(async () => {
    const gameState = games[gameId];
    const winner = gameLoop(gameState);

    if (!winner) {
      io.sockets.in(gameId).emit(SocketEvents.gameState, gameState);
      return;
    }
    
    io.in(gameId).emit(SocketEvents.gameOver, winner);

    const clients = await io.in(gameId).fetchSockets();
    
    clients.forEach(client => delete clientToGameMap[client.id]);
    delete games[gameId];

    clearInterval(intervalId);
  }, 1000 / FRAME_RATE);
};
