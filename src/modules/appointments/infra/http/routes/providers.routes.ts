import { Router } from 'express';

import auth from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';

const appointmentRoutes = Router();
const providersController = new ProvidersController();

appointmentRoutes.use(auth);

appointmentRoutes.get('/', providersController.index);

export default appointmentRoutes;
