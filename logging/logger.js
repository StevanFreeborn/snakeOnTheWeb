import winston from 'winston';
import dotevn from 'dotenv';
import consoleTransport from './transports/consoleTransport.js';
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
    exceptionHandlers: [],
  });

  switch (process.env.NODE_ENV) {
    case 'production':
      logger.add();
      break;
    case 'test':
      logger.add();
      break;
    case 'developement':
    default:
      logger.add(consoleTransport());
      break;
  }

  return logger;
};

const logger = createLogger();

export default logger;
