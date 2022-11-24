import winston from 'winston';
import 'winston-daily-rotate-file';
import { join } from 'path';

const exceptionFileTransport = () =>
  new winston.transports.DailyRotateFile({
    filename: join(process.cwd(), 'logs/exceptions-%DATE%.log'),
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxFiles: '30d',
  });

export default exceptionFileTransport;
