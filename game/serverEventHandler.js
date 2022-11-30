import keyMappings from '../shared/keyMappings.js';
import SocketEvents from '../shared/socketEvents.js';
import GameModes from '../shared/gameModes.js';
import snakeVelocities from '../shared/snakeVelocities.js';
import GameFactory from './gameFactory.js';
import logger from '../logging/logger.js';

export default class ServerEventHandler {
  static handleKeydown = (socket, key, games, clientToGameMap) => {
    logger.info('Handling keydown event');

    const gameId = clientToGameMap[socket.id];

    if (!gameId) {
      logger.info(
        `Could not move player because no game was found mapped to player ${socket.id}`
      );
      return;
    }

    const player = games[gameId].players[socket.number - 1];
    const newVelocity = keyMappings[key];

    if (!newVelocity) {
      logger.info(
        'Could not move player because a velocity could not be found for the key entered',
        key
      );
      return;
    }

    // if snake is moving don't allow it to move in the opposite y direction.
    // This is to prevent a player losing the game because they moved backwards on to themselves.
    if (player.velocity.x != 0 && player.velocity.x * -1 == newVelocity.x) {
      logger.info('Prevented player from moving in the opposite y direction', {
        currentVelocity: player.velocity,
        newVelocity,
      });
      return;
    }

    // if snake is moving don't allow it to move in the opposite x direction.
    // This is to prevent a player losing the game because they moved backwards on to themselves.
    if (player.velocity.y != 0 && player.velocity.y * -1 == newVelocity.y) {
      logger.info('Prevented player from moving in the opposite x direction', {
        currentVelocity: player.velocity,
        newVelocity,
      });
      return;
    }

    // if snake is not moving and is facing left and player tries to move snake to the right don't allow it.
    // this is to prevent the layer losing the game immediately by moving it's head back on to it's body
    // at the start o the game.
    if (
      player.velocity.x == 0 &&
      player.snakeIsFacingLeft() &&
      newVelocity.x == snakeVelocities.right.x &&
      newVelocity.y == snakeVelocities.right.y
    ) {
      logger.info('Prevented player from moving back on itself', {
        currentVelocity: player.velocity,
        currentSnake: player.snake,
        newVelocity,
      });
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
      logger.info('Prevented player from moving back on itself', {
        currentVelocity: player.velocity,
        currentSnake: player.snake,
        newVelocity,
      });
      return;
    }

    logger.info('Updating player velocity', {
      currentVelocity: player.velocity,
      newVelocity,
    });
    games[gameId].players[socket.number - 1].velocity = newVelocity;
  };

  static handleNewGame = (io, socket, mode, games, clientToGameMap) => {
    logger.info('Handling new game event');

    const game = GameFactory.createGame(mode);
    clientToGameMap[socket.id] = game.id;
    games[game.id] = game;

    logger.info(`Created new game ${game.id}`);

    socket.join(game.id);
    socket.number = 1;

    logger.info(`Emiting initialize event to player ${socket.id}`);

    socket.emit(SocketEvents.initialize, 1);

    if (mode == GameModes.TwoPlayer) {
      logger.info(`Emiting game code event to player ${socket.id}`);

      socket.emit(SocketEvents.gameCode, {
        message: 'Game code is ',
        gameCode: game.id,
      });
      return;
    }

    logger.info(`Creating game loop for game ${game.id}`);

    GameFactory.createGameLoop(io, clientToGameMap, games, game.id);
  };

  static handleJoinGame = async (
    io,
    socket,
    gameId,
    games,
    clientToGameMap
  ) => {
    logger.info('Handling join game event');

    const players = await io.in(gameId).fetchSockets();

    if (players.length === 0) {
      logger.info(
        `Prevented player ${socket.id} from joining game ${gameId} because it could not be found`
      );
      socket.emit(SocketEvents.gameNotFound);
      return;
    }

    if (players.length > 1) {
      logger.info(
        `Prevented player ${socket.id} from joining game ${gameId} because game was full`,
        { players }
      );
      socket.emit(SocketEvents.gameFull);
      return;
    }

    logger.info(`Adding player ${socket.id} to game ${gameId}`);

    clientToGameMap[socket.id] = gameId;
    socket.join(gameId);
    socket.number = 2;

    logger.info(`Emiting initialize event to player ${socket.id}`);

    socket.emit(SocketEvents.initialize, 2);

    logger.info(`Emiting game code event to player ${socket.id}`);

    socket.emit(SocketEvents.gameCode, {
      message: "You've joined game ",
      gameCode: gameId,
    });

    logger.info(`Creating game loop for game ${gameId}`);

    GameFactory.createGameLoop(io, clientToGameMap, games, gameId);
  };

  static handleClientError = (socket, clientToGameMap, error) => {
    logger.info('Handling client error event');

    const gameId = clientToGameMap[socket.id];

    logger.error(
      `Player ${socket.id} in game ${gameId} encountered an error`,
      error
    );
  };

  static handleDisconnect = async (io, socket, games, clientToGameMap) => {
    logger.info('Handling disconnect event');
    logger.info(`Player ${socket.id} disconnected`);

    const clientGameId = clientToGameMap[socket.id];
    const clientGame = games[clientGameId];

    if (clientGame) {
      logger.info(`Clearing game loop for game ${clientGameId}`);
      clearInterval(clientGame.interval);
    }

    logger.info(`Emitting player quit event to remaining players in ${clientGameId}`);

    io.in(clientGameId).emit(SocketEvents.playerQuit, socket.number);

    const clients = await io.in(clientGameId).fetchSockets();

    clients.forEach(client => {
      logger.info(`Removing player ${client.id} from clientToGameMap`);
      delete clientToGameMap[client.id]
    });

    logger.info(`Removing game ${clientGameId} from games`);

    delete games[clientGameId];
  };
}
