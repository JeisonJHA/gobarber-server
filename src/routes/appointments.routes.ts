import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

import auth from '../middlewares/ensureAuthenticated';

const appointmentRoutes = Router();

appointmentRoutes.use(auth);

appointmentRoutes.get('/', async (req, res) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  return res.json(await appointmentsRepository.find());
});

appointmentRoutes.post('/', async (req, res) => {
  const { provider_id, date } = req.body;

  const parsedDate = parseISO(date);
  const createAppointmentService = new CreateAppointmentService();
  const appointment = await createAppointmentService.execute({
    provider_id,
    date: parsedDate,
  });

  return res.json(appointment);
});

export default appointmentRoutes;
