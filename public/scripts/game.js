import GameModes from '../../shared/gameModes.js';
import SocketEvents from '../../shared/socketEvents.js';
import ClientEventHandler from './clientEventHandler.js';
import { BG_COLOR } from '../../shared/constants.js';
import errorCatcher from './errorCatcher.js';

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

  document.addEventListener('keydown', e =>
    errorCatcher(socket, () =>
      ClientEventHandler.handleKeydown(e, socket, clientState)
    )
  );

  clientState.isGameActive = true;
};

socket.on(SocketEvents.initialize, number =>
  errorCatcher(socket, () =>
    ClientEventHandler.handleInitialize(clientState, number)
  )
);

socket.on(SocketEvents.gameState, gameState =>
  errorCatcher(socket, () =>
    ClientEventHandler.handleGameState(clientState, gameState)
  )
);

socket.on(SocketEvents.gameOver, data =>
  errorCatcher(socket, () =>
    ClientEventHandler.handleGameOver(clientState, data)
  )
);

socket.on(SocketEvents.gameCode, data =>
  errorCatcher(socket, () =>
    ClientEventHandler.handleGameCode(clientState, data)
  )
);

socket.on(SocketEvents.gameNotFound, () =>
  errorCatcher(socket, () => ClientEventHandler.handleGameNotFound(clientState))
);

socket.on(SocketEvents.gameFull, () =>
  errorCatcher(socket, () => ClientEventHandler.handleFullGame(clientState))
);

if (clientState.mode == GameModes.TwoPlayer && clientState.gameId) {
  socket.emit(SocketEvents.joinGame, clientState.gameId);
  initialize();
} else {
  socket.emit(SocketEvents.newGame, clientState.mode);
  initialize();
}
