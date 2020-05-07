import { startOfHour } from 'date-fns';

import AppError from '@shared/errors/AppError';
import Appointment from '../infra/typeorm/entities/Appointment';

import IAppointmentRepositories from '../repositories/IAppointmentRepositories';

interface IRequest {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  constructor(private appointmentsRepository: IAppointmentRepositories) {}

  public async execute({ provider_id, date }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);
    const findAppointmentAtSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate
    );

    if (findAppointmentAtSameDate) {
      throw new AppError('This appointment is already booked.');
    }
    const appointment = this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;