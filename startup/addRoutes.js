import api from '../routes/api.js';
import views from '../routes/views.js';

export default function addRoutes(app) {
  api(app);
  views(app);
}
