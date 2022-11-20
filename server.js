import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors'
import { createServer } from 'http';
import { Server } from 'socket.io';
dotenv.config();

const app = express();
app.disable('x-powered-by');
app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({ origin: '*' }));

const server = createServer(app);
const io = new Server(server);

server.listen(8000 || process.env.PORT);

