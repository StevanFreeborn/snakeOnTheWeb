import { FRAME_RATE } from './shared/constants.js';
import { gameLoop } from './gameLoop.js';
import SocketEvents from './shared/socketEvents.js';

export const createGameInterval = (io, socket, globalState, gameId) => {
  const intervalId = setInterval(() => {
    const gameState = globalState[gameId];
    const winner = gameLoop(gameState);

    if (!winner) {
      io.sockets.in(gameId).emit(SocketEvents.gameState, gameState);
      return;
    }
    
    io.sockets.in(gameId).emit(SocketEvents.gameOver, { winner });
    globalState[gameId] = null;
    clearInterval(intervalId);
  }, 1000 / FRAME_RATE);
};
