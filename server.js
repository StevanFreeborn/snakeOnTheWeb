import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors'
import { createServer } from 'http';
import { Server } from 'socket.io';
import views from './routes/views.js';
import { createGameState } from './gameState.js';
import { createGameInterval } from './gameInterval.js';
import SocketEvents from './public/scripts/socketEvents.js';
import { handleKeydown } from './handlers.js';
dotenv.config();

const app = express();
app.disable('x-powered-by');
app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({ origin: '*' }));

views(app);

const server = createServer(app);
const io = new Server(server);

io.on(SocketEvents.connection, socket => {
    const state = createGameState();

    socket.on(SocketEvents.keyDown, key => handleKeydown(socket, key, state));

    createGameInterval(socket, state);
});

const listener = server.listen(process.env.PORT || 8000, () => {
    console.log(`Server listening on port ${listener.address().port}`)
});

