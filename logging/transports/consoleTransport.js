import winston from 'winston';

export default function consoleTransport() {
  return new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.prettyPrint(),
      winston.format.colorize({
        all: true,
      })
    ),
  });
}
