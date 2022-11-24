import morgan from 'morgan';
import logger from '../logging/logger.js';

export default function loggingMiddleware(app) {
  morgan.token('reqId', (req, res) => req.id);
  morgan.token('reqId', (req, res) => req.id);
  morgan.token('requestHeaders', (req, res) => req.headers);
  morgan.token('responseHeaders', (req, res) => res.getHeaders());

  const formatHttpLogMessage = (tokens, req, res) => {
    return JSON.stringify({
      requestId: tokens.reqId(req, res),
      requestInfo: {
        httpVersion: tokens['http-version'](req, res),
        method: tokens.method(req, res),
        referrer: tokens.referrer(req, res),
        remoteAddress: tokens['remote-addr'](req, res),
        url: tokens.url(req, res),
        requestHeaders: tokens.requestHeaders(req, res),
      },
      responseInfo: {
        status: Number.parseFloat(tokens.status(req, res)),
        responseTime: Number.parseFloat(tokens['response-time'](req, res)),
        totalTime: Number.parseFloat(tokens['total-time'](req, res)),
        responseHeaders: tokens.responseHeaders(req, res),
      },
    });
  };

  app.use(
    morgan(formatHttpLogMessage, {
      stream: {
        write: message => {
          message = JSON.parse(message);
          logger.http(message);
        },
      },
    })
  );
}
