import PublicController from '../controllers/publicController.js';
import ErrorHandler from '../errors/errorHandler.js';

export default function (app) {
  app.get('/', ErrorHandler.handleViewError(PublicController.index));
  app.get('/game', ErrorHandler.handleViewError(PublicController.game));
}
