import express from 'express';
import cors from 'cors';
import addRoutes from './addRoutes.js';
import loggingMiddleware from '../middleware/loggingMiddleware.js';
import requestIdMiddleware from '../middleware/requestIdMiddleware.js';
import logger from '../logging/logger.js';

export default function setupApp() {
  logger.info('setting up express app');
  
  const app = express();

  app.disable('x-powered-by');
  app.use('/public', express.static(process.cwd() + '/public'));
  app.use('/shared', express.static(process.cwd() + '/shared'));
  app.use(cors({ origin: '*' }));

  requestIdMiddleware(app);
  loggingMiddleware(app);
  addRoutes(app);

  return app;
}
