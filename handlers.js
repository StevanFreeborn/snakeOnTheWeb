import keyMappings from './keyMappings.js';
import { createGameId } from './gameId.js';
import SocketEvents from './public/scripts/socketEvents.js';
import { initializeGameState } from './gameState.js';
import GameModes from './public/scripts/gameModes.js';
import { createGameInterval } from './gameInterval.js';

export const handleKeydown = (socket, key, globalState, games) => {
  const game = games[socket.id];

  if (!game) {
    return;
  }

  const newVelocity = keyMappings[key];

  if (newVelocity) {
    globalState[game].players[socket.number - 1].velocity = newVelocity;
  }
};

export const handleNewGame = (io, socket, mode, globalState, games) => {
  const gameId = createGameId();
  games[socket.id] = gameId;
  
  const state = initializeGameState(mode);
  globalState[gameId] = state;

  socket.join(gameId);
  socket.number = 1;
  socket.emit(SocketEvents.initialize, 1);

  if (mode == GameModes.TwoPlayer) {
    socket.emit(SocketEvents.gameCode, gameId);
    return;
  }

  createGameInterval(io, socket, globalState, gameId);
};

export const handleJoinGame = async (io, socket, gameId, globalState, games) => {
  const game = await io.in(gameId).fetchSockets();

  if (game.length === 0) {
    socket.emit(SocketEvents.gameNotFound);
    return;
  }

  if (game.length > 1) {
    socket.emit(SocketEvents.gameFull);
    return;
  }

  games[socket.id] = gameId;
  socket.join(gameId);
  socket.number = 2;
  socket.emit(SocketEvents.initialize, 2);

  createGameInterval(io, socket, globalState, gameId);
};
