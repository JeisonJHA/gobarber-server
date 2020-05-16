import { Router } from 'express';

import auth from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentRoutes = Router();
const appointmentsController = new AppointmentsController();
const provicerAppointmentsController = new ProviderAppointmentsController();

appointmentRoutes.use(auth);

appointmentRoutes.post('/', appointmentsController.create);
appointmentRoutes.get('/me', provicerAppointmentsController.index);

export default appointmentRoutes;
