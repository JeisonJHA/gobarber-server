import { Router } from 'express';
import { parseISO } from 'date-fns';

import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

import auth from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const appointmentRoutes = Router();

appointmentRoutes.use(auth);

// appointmentRoutes.get('/', async (req, res) => {
//   return res.json(await appointmentsRepository.find());
// });

appointmentRoutes.post('/', async (req, res) => {
  const appointmentsRepository = new AppointmentsRepository();
  const { provider_id, date } = req.body;

  const parsedDate = parseISO(date);
  const createAppointmentService = new CreateAppointmentService(
    appointmentsRepository
  );
  const appointment = await createAppointmentService.execute({
    provider_id,
    date: parsedDate,
  });

  return res.json(appointment);
});

export default appointmentRoutes;
