import logger from '../logging/logger.js';
import SocketEvents from '../shared/socketEvents.js';

export default class ErrorHandler {
  static handleApiError = routeHandler => async (req, res, next) => {
    try {
      await routeHandler(req, res, next);
    } catch (err) {
      logger.error(err);

      if (res.headersSent) {
        return next(err);
      }

      res.status(500).json({
        error: "We've encountered an error",
      });
    }
  };

  static handleViewError = routeHandler => async (req, res, next) => {
    try {
      await routeHandler(req, res, next);
    } catch (err) {
      logger.error(err);

      if (res.headersSent) {
        return next(err);
      }

      res.status(500).sendFile(process.cwd() + '/views/error.html');
    }
  };

  static handleSocketError = (socket, socketEventHandler) => {
    try {
      socketEventHandler();
    } catch (err) {
      logger.error(err);
      socket.emit(SocketEvents.serverError, { message: 'Sorry we\'ve encountered an errror.' });
    }
  };
}
