import { v4 as uuidv4 } from 'uuid';

export default function (app) {
  app.use((req, res, next) => {
    req.id = uuidv4();
    next();
  });
}
