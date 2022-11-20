import { FRAME_RATE } from "./constants.js";
import { gameLoop } from "./gameLoop.js";
import SocketEvents from "./public/scripts/socketEvents.js";

export const createGameInterval = (socket, state) => {
    const intervalId = setInterval(() => {
        const winner = gameLoop(state);
        if (!winner) {
            socket.emit(SocketEvents.gameState, state);
            return;
        }

        socket.emit(SocketEvents.gameOver);
        clearInterval(intervalId);
    }, 1000 / FRAME_RATE);
}