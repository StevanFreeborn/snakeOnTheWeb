import PublicController from "../controllers/publicController.js";

export default function (app) {
  app.get('/', PublicController.index);
  app.get('/game', PublicController.game);
};