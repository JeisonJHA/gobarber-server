import { Router } from 'express';

import auth from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentRoutes = Router();
const appointmentsController = new AppointmentsController();

appointmentRoutes.use(auth);

appointmentRoutes.post('/', appointmentsController.create);

export default appointmentRoutes;
