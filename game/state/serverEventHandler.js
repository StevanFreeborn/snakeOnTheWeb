import keyMappings from '../../shared/keyMappings.js';
import { createGameId } from '../utils/gameId.js';
import SocketEvents from '../../shared/socketEvents.js';
import { initializeGameState } from './gameState.js';
import GameModes from '../../shared/gameModes.js';
import { createGameInterval } from '../logic/gameInterval.js';
import snakeVelocities from '../../shared/snakeVelocities.js';

export default class ServerEventHandler {
  static handleKeydown = (socket, key, games, clientToGameMap) => {
    const game = clientToGameMap[socket.id];
    
    if (!game) {
      return;
    }
  
    const playerSnake = games[game].players[socket.number - 1].snake;
    const playerSnakeTail = playerSnake[0];
    const playerSnakeHead = playerSnake[playerSnake.length - 1];
    const currentVelocity = games[game].players[socket.number - 1].velocity;
    const newVelocity = keyMappings[key];
  
    const isFacingRight = (head, tail) => {
      return head.x > tail.x && head.y == tail.y;
    };
  
    const isFacingLeft = (head, tail) => {
      return head.x < tail.x && head.y == tail.y;
    };
  
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
  
    games[game].players[socket.number - 1].velocity = newVelocity;
  };
  
  static handleNewGame = (io, socket, mode, games, clientToGameMap) => {
    const gameId = createGameId();
    clientToGameMap[socket.id] = gameId;
  
    const state = initializeGameState(mode);
    games[gameId] = state;
  
    socket.join(gameId);
    socket.number = 1;
    socket.emit(SocketEvents.initialize, 1);
  
    if (mode == GameModes.TwoPlayer) {
      socket.emit(SocketEvents.gameCode, {
        message: 'Game code is ',
        gameCode: gameId,
      });
      return;
    }
  
    createGameInterval(io, clientToGameMap, games, gameId);
  };
  
  static handleJoinGame = async (
    io,
    socket,
    gameId,
    games,
    clientToGameMap
  ) => {
    const players = await io.in(gameId).fetchSockets();
  
    if (players.length === 0) {
      socket.emit(SocketEvents.gameNotFound);
      return;
    }
  
    if (players.length > 1) {
      socket.emit(SocketEvents.gameFull);
      return;
    }
  
    clientToGameMap[socket.id] = gameId;
    socket.join(gameId);
    socket.number = 2;
  
    socket.emit(SocketEvents.initialize, 2);
  
    socket.emit(SocketEvents.gameCode, {
      message: "You've joined game ",
      gameCode: gameId,
    });
  
    createGameInterval(io, clientToGameMap, games, gameId);
  };
  
  static handleClientError = (socket, clientToGameMap, error) => {
    console.error(
      `Player ${socket.id} in game ${clientToGameMap[socket.id]} encountered an error`,
      error
    );
  };
  
  static handleDisconnect = async (io, socket, games, clientToGameMap) => {
    const clientGame = clientToGameMap[socket.id];
  
    io.in(clientGame).emit(SocketEvents.playerQuit, socket.number);
  
    const clients = await io.in(clientGame).fetchSockets();
  
    clients.forEach(client => delete clientToGameMap[client.id]);
    delete games[clientGame];
  };
}