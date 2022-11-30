import logger from '../logging/logger.js';
import api from '../routes/api.js';
import views from '../routes/views.js';

export default function addRoutes(app) {
  logger.info('adding app routes')
  api(app);
  views(app);
}
