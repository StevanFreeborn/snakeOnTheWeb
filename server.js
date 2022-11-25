import dotenv from 'dotenv';
import logger from './logging/logger.js';
import setupApp from './startup/setupApp.js';
import setupServer from './startup/setupServer.js';
dotenv.config();

const app = setupApp();
const server = setupServer(app);
const port = process.env.PORT || 8000

server.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});