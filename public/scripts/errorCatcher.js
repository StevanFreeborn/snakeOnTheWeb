import SocketEvents from "../../shared/socketEvents.js";

export default function (socket, eventHandler) {
  try {
    eventHandler();
  } catch (err) {
    console.error(err)
    socket.emit(SocketEvents.clientError, { message: err.message, stack: err.stack });
  }
}
