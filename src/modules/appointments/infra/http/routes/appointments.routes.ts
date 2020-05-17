import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import auth from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentRoutes = Router();
const appointmentsController = new AppointmentsController();
const provicerAppointmentsController = new ProviderAppointmentsController();

appointmentRoutes.use(auth);

appointmentRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  appointmentsController.create
);
appointmentRoutes.get('/me', provicerAppointmentsController.index);

export default appointmentRoutes;
