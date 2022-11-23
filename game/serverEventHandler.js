import keyMappings from '../shared/keyMappings.js';
import SocketEvents from '../shared/socketEvents.js';
import GameModes from '../shared/gameModes.js';
import snakeVelocities from '../shared/snakeVelocities.js';
import GameFactory from './gameFactory.js';

export default class ServerEventHandler {
  static handleKeydown = (socket, key, games, clientToGameMap) => {
    const gameId = clientToGameMap[socket.id];
    
    if (!gameId) {
      return;
    }
  
    const player = games[gameId].players[socket.number - 1];
    const newVelocity = keyMappings[key];
    
    if (!newVelocity) {
      return;
    }
  
    // if snake is moving don't allow it to move in the opposite y direction.
    // This is to prevent a player losing the game because they moved backwards on to themselves.
    if (player.velocity.x != 0 && player.velocity.x * -1 == newVelocity.x) {
      return;
    }
  
    // if snake is moving don't allow it to move in the opposite x direction.
    // This is to prevent a player losing the game because they moved backwards on to themselves.
    if (player.velocity.y != 0 && player.velocity.y * -1 == newVelocity.y) {
      return;
    }
  
    // if snake is not moving and is facing left and player tries to move snake to the right don't allow it.
    // this is to prevent the layer losing the game immediately by moving it's head back on to it's body
    // at the start ot he game.
    if (
      player.velocity.x == 0 &&
      player.snakeIsFacingLeft() &&
      newVelocity.x == snakeVelocities.right.x &&
      newVelocity.y == snakeVelocities.right.y
    ) {
      return;
    }
  
    // if snake is not moving and is facing right and player tries to move snake to the left don't allow it.
    // this is to prevent the player losing the game immediately by moving it's head back on to it's body
    // at the start of the game.
    if (
      player.velocity.x == 0 &&
      player.snakeIsFacingRight() &&
      newVelocity.x == snakeVelocities.left.x &&
      newVelocity.y == snakeVelocities.left.y
    ) {
      return;
    }
  
    games[gameId].players[socket.number - 1].velocity = newVelocity;
  };
  
  static handleNewGame = (io, socket, mode, games, clientToGameMap) => {
    const game = GameFactory.createGame(mode);
    clientToGameMap[socket.id] = game.id;
  
    games[game.id] = game;
  
    socket.join(game.id);
    socket.number = 1;
    socket.emit(SocketEvents.initialize, 1);
  
    if (mode == GameModes.TwoPlayer) {
      socket.emit(SocketEvents.gameCode, {
        message: 'Game code is ',
        gameCode: game.id,
      });
      return;
    }
    
    GameFactory.createGameInterval(io, clientToGameMap, games, game.id);
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
  
    GameFactory.createGameInterval(io, clientToGameMap, games, gameId);
  };
  
  static handleClientError = (socket, clientToGameMap, error) => {
    console.error(
      `Player ${socket.id} in game ${clientToGameMap[socket.id]} encountered an error`,
      error
    );
  };
  
  static handleDisconnect = async (io, socket, games, clientToGameMap) => {
    const clientGameId = clientToGameMap[socket.id];
    const clientGame = games[clientGameId];
    
    if (clientGame) {
      clearInterval(clientGame.interval)
    }
  
    io.in(clientGameId).emit(SocketEvents.playerQuit, socket.number);
  
    const clients = await io.in(clientGameId).fetchSockets();
  
    clients.forEach(client => delete clientToGameMap[client.id]);
    delete games[clientGameId];
  };
}