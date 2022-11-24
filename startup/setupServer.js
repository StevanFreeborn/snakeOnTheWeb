import { createServer } from 'http';
import { Server } from 'socket.io';
import SocketEvents from '../shared/socketEvents.js';
import ServerEventHandler from '../game/serverEventHandler.js';
import clientToGameMap from '../state/clientToGameMap.js';
import games from '../state/games.js';

export default function setupServer(app) {
  const server = createServer(app);
  const io = new Server(server);

  io.on(SocketEvents.connection, socket => {
    socket.on(SocketEvents.keyDown, key =>
      ServerEventHandler.handleKeydown(socket, key, games, clientToGameMap)
    );

    socket.on(SocketEvents.newGame, mode =>
      ServerEventHandler.handleNewGame(io, socket, mode, games, clientToGameMap)
    );

    socket.on(SocketEvents.joinGame, gameId =>
      ServerEventHandler.handleJoinGame(
        io,
        socket,
        gameId,
        games,
        clientToGameMap
      )
    );

    socket.on(SocketEvents.clientError, error =>
      ServerEventHandler.handleClientError(socket, clientToGameMap, error)
    );

    socket.on(SocketEvents.disconnect, () =>
      ServerEventHandler.handleDisconnect(io, socket, games, clientToGameMap)
    );
  });

  return server;
}
