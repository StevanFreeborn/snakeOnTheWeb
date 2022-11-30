import { v4 as uuidv4 } from 'uuid';
import logger from '../logging/logger.js';

export default function (app) {
  logger.info('adding requeest id middleware');

  app.use((req, res, next) => {
    req.id = uuidv4();
    next();
  });
}
