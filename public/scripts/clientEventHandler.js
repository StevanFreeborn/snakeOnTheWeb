import keyMappings from '../../shared/keyMappings.js';
import SocketEvents from '../../shared/socketEvents.js';
import Drawer from './drawer.js';
import { SNAKE_COLOR_1, SNAKE_COLOR_2 } from '../../shared/constants.js';
import GameModes from '../../shared/gameModes.js';

export default class ClientEventHandler {
  static handleKeydown = (e, socket, clientState) => {
    const mappedKeys = Object.keys(keyMappings);

    if (mappedKeys.find(key => key == e.key)) {
      e.preventDefault();
    }

    if (clientState.isGameActive == false) {
      return;
    }

    socket.emit(SocketEvents.keyDown, e.key);
  };

  static handleInitialize = (clientState, number) => {
    clientState.playerNumber = number;
  };

  static handleGameState = (clientState, gameState) => {
    if (clientState.isGameActive == false) {
      return;
    }

    clientState.canvas.classList.remove('border-secondary');
    clientState.canvas.classList.add('border-info');
    clientState.gameStatus.innerText = 'Eat the food!';

    if (clientState.mode == GameModes.TwoPlayer) {
      const color =
        clientState.playerNumber == 1 ? SNAKE_COLOR_1 : SNAKE_COLOR_2;
      clientState.playerIdentification.innerHTML = `You are <span class="fw-bold fst-italic" style="color: ${color}">player ${clientState.playerNumber}</span>`;
    }

    requestAnimationFrame(() =>
      Drawer.drawGame(clientState, gameState)
    );
  };

  static handleGameOver = (clientState, winner) => {
    if (clientState.isGameActive == false) {
      return;
    }

    clientState.canvas.classList.toggle('border-info');

    if (winner === clientState.playerNumber) {
      clientState.gameStatus.innerHTML =
        '<span class="text-success fw-bold fst-italic">You won!</span> <a class="link-secondary" href="/">Play again?</a>';
      clientState.canvas.classList.toggle('border-success');
    } else {
      clientState.gameStatus.innerHTML =
        '<span class="text-danger fw-bold fst-italic">You lost!</span> <a class="link-secondary" href="/">Play again?</a>';
      clientState.canvas.classList.toggle('border-danger');
    }

    clientState.isGameActive = false;
  };

  static handleGameCode = (clientState, data) => {
    const html = `${data.message}<span id="gameCode" class="fw-bold fst-italic">${data.gameCode}</span>`;
    clientState.gameCodeMessage.innerHTML = html;
    clientState.gameStatus.innerText = 'Waiting for player 2...';
  };

  static handleGameNotFound = clientState => {
    clientState.gameStatus.innerHTML =
      'Sorry we couldn\'t find that game. Go back to the <a href="/" class="link-success">main menu</a>.';
  };

  static handleFullGame = clientState => {
    clientState.gameStatus.innerHTML =
      'Sorry this game is already full. Go back to the <a href="/" class="link-success">main menu</a>.';
  };

  static handlePlayerQuit = (clientState, quitter) => {
    if (clientState.isGameActive == false) {
      return;
    }

    clientState.canvas.classList.toggle('border-info');
    clientState.gameStatus.innerHTML = `<span class="text-success fw-bold fst-italic">Player ${quitter} quit. You won!</span> <a class="link-secondary" href="/">Play again?</a>`;
    clientState.canvas.classList.toggle('border-success');
    clientState.isGameActive = false;
  };
}
