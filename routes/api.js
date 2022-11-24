import PingController from "../controllers/api/pingController.js";

export default function (app) {
  app.get('/api/ping', PingController.ping);
};