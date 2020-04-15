import { Router } from 'express';
import { parseISO } from 'date-fns';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentRoutes = Router();

const appointmentRepository = new AppointmentsRepository();

appointmentRoutes.get('/', (req, res) => {
  return res.json(appointmentRepository.all());
});

appointmentRoutes.post('/', (req, res) => {
  try {
    const { provider, date } = req.body;

    const parsedDate = parseISO(date);
    const appointment = new CreateAppointmentService(
      appointmentRepository
    ).execute({ provider, date: parsedDate });

    return res.json(appointment);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

export default appointmentRoutes;
