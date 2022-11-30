import GameModes from '../../shared/gameModes.js';
import SocketEvents from '../../shared/socketEvents.js';
import ClientEventHandler from './clientEventHandler.js';
import { BG_COLOR } from '../../shared/constants.js';
import ClientEventErrorHandler from './clientEventErrorHandler.js';

const socket = io();
const params = new URLSearchParams(window.location.search);

const clientState = {
  mode: params.get('mode'),
  gameId: params.get('gameId'),
  gameCodeMessage: document.getElementById('gameCodeMessage'),
  gameStatus: document.getElementById('gameStatus'),
  playerIdentification: document.getElementById('playerIdentification'),
  canvas: null,
  context: null,
  playerNumber: null,
  isGameActive: false,
};

const initialize = () => {
  clientState.canvas = document.getElementById('canvas');
  clientState.canvas.height = 600;
  clientState.canvas.width = 600;

  clientState.context = clientState.canvas.getContext('2d');
  clientState.context.fillStyle = BG_COLOR;
  clientState.context.fillRect(
    0,
    0,
    clientState.canvas.width,
    clientState.canvas.height
  );

  document.getElementById('game-screen').classList.remove('visually-hidden');

  document.addEventListener('keydown', e =>
    ClientEventErrorHandler.handle(socket, () =>
      ClientEventHandler.handleKeydown(e, socket, clientState)
    )
  );

  clientState.isGameActive = true;
};

socket.on(SocketEvents.initialize, number =>
  ClientEventErrorHandler.handle(socket, () =>
    ClientEventHandler.handleInitialize(clientState, number)
  )
);

socket.on(SocketEvents.gameState, gameState =>
  ClientEventErrorHandler.handle(socket, () =>
    ClientEventHandler.handleGameState(clientState, gameState)
  )
);

socket.on(SocketEvents.gameOver, winner =>
  ClientEventErrorHandler.handle(socket, () =>
    ClientEventHandler.handleGameOver(clientState, winner)
  )
);

socket.on(SocketEvents.gameCode, data =>
  ClientEventErrorHandler.handle(socket, () =>
    ClientEventHandler.handleGameCode(clientState, data)
  )
);

socket.on(SocketEvents.gameNotFound, () =>
  ClientEventErrorHandler.handle(socket, () =>
    ClientEventHandler.handleGameNotFound(clientState)
  )
);

socket.on(SocketEvents.gameFull, () =>
  ClientEventErrorHandler.handle(socket, () =>
    ClientEventHandler.handleFullGame(clientState)
  )
);

socket.on(SocketEvents.playerQuit, quitter =>
  ClientEventErrorHandler.handle(socket, () =>
    ClientEventHandler.handlePlayerQuit(clientState, quitter)
  )
);

if (clientState.mode == GameModes.TwoPlayer && clientState.gameId) {
  socket.emit(SocketEvents.joinGame, clientState.gameId);
  initialize();
} else {
  socket.emit(SocketEvents.newGame, clientState.mode);
  initialize();
}
