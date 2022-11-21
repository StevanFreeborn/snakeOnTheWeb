import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import views from './routes/views.js';
import SocketEvents from './shared/socketEvents.js';
import {
  handleKeydown,
  handleNewGame,
  handleJoinGame,
  handleClientError,
} from './handlers.js';
dotenv.config();

const globalState = {};
const games = {};

const app = express();
app.disable('x-powered-by');
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/shared', express.static(process.cwd() + '/shared'));
app.use(cors({ origin: '*' }));

views(app);

const server = createServer(app);
const io = new Server(server);

io.on(SocketEvents.connection, socket => {
  socket.on(SocketEvents.keyDown, key =>
    handleKeydown(socket, key, globalState, games)
  );

  socket.on(SocketEvents.newGame, mode =>
    handleNewGame(io, socket, mode, globalState, games)
  );

  socket.on(SocketEvents.joinGame, gameId =>
    handleJoinGame(io, socket, gameId, globalState, games)
  );

  socket.on(SocketEvents.clientError, error => handleClientError(socket, games, error));
});

const listener = server.listen(process.env.PORT || 8000, () => {
  console.log(`Server listening on port ${listener.address().port}`);
});
