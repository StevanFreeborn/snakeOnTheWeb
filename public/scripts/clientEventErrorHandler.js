import SocketEvents from "../../shared/socketEvents.js";

export default class clientEventErrorHandler {
  static handle = (socket, eventHandler) => {
    try {
      eventHandler();
    } catch (err) {
      console.error(err);
      socket.emit(SocketEvents.clientError, {
        message: err.message,
        stack: err.stack,
      });
    }
  };
}
