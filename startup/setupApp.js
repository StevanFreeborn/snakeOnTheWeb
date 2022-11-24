import express from 'express';
import cors from 'cors';
import addRoutes from './addRoutes.js';

export default function setupApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use('/public', express.static(process.cwd() + '/public'));
  app.use('/shared', express.static(process.cwd() + '/shared'));
  app.use(cors({ origin: '*' }));
  
  addRoutes(app);

  return app;
}
