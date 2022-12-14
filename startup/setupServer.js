import { createServer } from 'http';
import { Server } from 'socket.io';
import SocketEvents from '../shared/socketEvents.js';
import ServerEventHandler from '../game/serverEventHandler.js';
import clientToGameMap from '../state/clientToGameMap.js';
import games from '../state/games.js';
import ErrorHandler from '../errors/errorHandler.js';
import logger from '../logging/logger.js';

export default function setupServer(app) {
  logger.info('setting up server');

  const server = createServer(app);
  const io = new Server(server);

  io.on(SocketEvents.connection, socket => {
    logger.info(`Player ${socket.id} has connected`);

    socket.on(SocketEvents.keyDown, key =>
      ErrorHandler.handleSocketError(socket, () =>
        ServerEventHandler.handleKeydown(socket, key, games, clientToGameMap)
      )
    );

    socket.on(SocketEvents.newGame, mode =>
      ErrorHandler.handleSocketError(socket, () =>
        ServerEventHandler.handleNewGame(
          io,
          socket,
          mode,
          games,
          clientToGameMap
        )
      )
    );

    socket.on(SocketEvents.joinGame, gameId =>
      ErrorHandler.handleSocketError(socket, () =>
        ServerEventHandler.handleJoinGame(
          io,
          socket,
          gameId,
          games,
          clientToGameMap
        )
      )
    );

    socket.on(SocketEvents.clientError, error =>
      ErrorHandler.handleSocketError(socket, () =>
        ServerEventHandler.handleClientError(socket, clientToGameMap, error)
      )
    );

    socket.on(SocketEvents.disconnect, () =>
      ErrorHandler.handleSocketError(socket, () =>
        ServerEventHandler.handleDisconnect(io, socket, games, clientToGameMap)
      )
    );
  });

  return server;
}
