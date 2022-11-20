import keyMappings from './public/scripts/keyMappings.js';
import { createGameId } from './gameId.js';
import SocketEvents from './public/scripts/socketEvents.js';
import { initializeGameState } from './gameState.js';
import GameModes from './public/scripts/gameModes.js';
import { createGameInterval } from './gameInterval.js';
import snakeVelocities from './public/scripts/snakeVelocities.js';

export const handleKeydown = (socket, key, globalState, games) => {
  const game = games[socket.id];

  if (!game) {
    return;
  }

  const playerSnake = globalState[game].players[socket.number - 1].snake;
  const playerSnakeTail = playerSnake[0];
  const playerSnakeHead = playerSnake[playerSnake.length - 1];
  const currentVelocity = globalState[game].players[socket.number - 1].velocity;
  const newVelocity = keyMappings[key];

  const isFacingRight = (head, tail) => {
    return head.x > tail.x
  }

  const isFacingLeft = (head, tail) => {
    return head.x < tail.x;
  }

  if (!newVelocity) {
    return;
  }

  // if snake is moving don't allow it to move in the opposite y direction.
  // This is to prevent a player losing the game because they moved backwards on to themselves.
  if (currentVelocity.x != 0 && currentVelocity.x * -1 == newVelocity.x) {
    return;
  }

  // if snake is moving don't allow it to move in the opposite x direction.
  // This is to prevent a player losing the game because they moved backwards on to themselves.
  if (currentVelocity.y != 0 && currentVelocity.y * -1 == newVelocity.y) {
    return;
  }

  // if snake is not moving and is facing left and player tries to move snake to the right don't allow it.
  // this is to prevent the layer losing the game immediately by moving it's head back on to it's body
  // at the start ot he game.
  if (
    currentVelocity.x == 0 &&
    isFacingLeft(playerSnakeHead, playerSnakeTail) &&
    newVelocity.x == snakeVelocities.right.x &&
    newVelocity.y == snakeVelocities.right.y
  ) {
    return;
  }

  // if snake is not moving and is facing right and player tries to move snake to the left don't allow it.
  // this is to prevent the player losing the game immediately by moving it's head back on to it's body
  // at the start of the game.
  if (
    currentVelocity.x == 0 &&
    isFacingRight(playerSnakeHead, playerSnakeTail) &&
    newVelocity.x == snakeVelocities.left.x &&
    newVelocity.y == snakeVelocities.left.y
  ) {
    return;
  }

  globalState[game].players[socket.number - 1].velocity = newVelocity;
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
    socket.emit(SocketEvents.gameCode, { message: 'Game code is ', gameCode: gameId });
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
  socket.emit(SocketEvents.gameCode, { message: 'You\'ve joined game ', gameCode: gameId });

  createGameInterval(io, socket, globalState, gameId);
};
