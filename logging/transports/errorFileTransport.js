import winston from 'winston';
import 'winston-daily-rotate-file';
import { join } from 'path';

const errorFileTransport = () =>
  new winston.transports.DailyRotateFile({
    level: 'error',
    filename: join(process.cwd(), 'logs/error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxFiles: '30d',
  });

export default errorFileTransport;
