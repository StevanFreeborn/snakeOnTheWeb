import PingController from '../controllers/api/pingController.js';
import ErrorHandler from '../errors/errorHandler.js';

export default function (app) {
  app.get('/api/ping', ErrorHandler.handleApiError(PingController.ping));
}
