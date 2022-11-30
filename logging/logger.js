import winston from 'winston';
import dotevn from 'dotenv';
import consoleTransport from './transports/consoleTransport.js';
import exceptionFileTransport from './transports/exceptionFileTransport.js';
import combinedfileTransport from './transports/combinedFileTransport.js';
import errorFileTransport from './transports/errorFileTransport.js';
import testFileTransport from './transports/testFileTransport.js';
dotevn.config();

const createLogger = () => {
  const logger = winston.createLogger({
    level: 'http' || process.env.LOG_LEVEL,
    format: winston.format.combine(
      winston.format.errors({
        stack: true,
      }),
      winston.format.timestamp(),
      winston.format.json()
    ),
    exceptionHandlers: [consoleTransport(), exceptionFileTransport()],
  });

  switch (process.env.NODE_ENV) {
    case 'production':
      logger.add(combinedfileTransport());
      logger.add(errorFileTransport());
      break;
    case 'test':
      logger.add(testFileTransport());
      break;
    case 'developement':
    default:
      logger.add(consoleTransport());
      break;
  }

  return logger;
};

const logger = createLogger();
logger.on('error', err => logger.error('The logger encountered an error', err));

export default logger;
