import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';

import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAvailableDaysInMonthProviderDTO from '@modules/appointments/dtos/IFindAvailableDaysInMonthProviderDTO';

import IFindAvailableHoursInDaysProviderDTO from '@modules/appointments/dtos/IFindAvailableHoursInDaysProviderDTO';
import Appointment from '../../infra/typeorm/entities/Appointment';

class FakeAppointmentsRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    return this.appointments.find(appointment =>
      isEqual(appointment.date, date)
    );
  }

  public async findAvailableDaysInMonthProvider({
    provider_id,
    month,
    year,
  }: IFindAvailableDaysInMonthProviderDTO): Promise<Appointment[]> {
    return this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
    );
  }

  public async findAvailableHoursInDaysProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAvailableHoursInDaysProviderDTO): Promise<Appointment[]> {
    return this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
    );
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();
    Object.assign(appointment, { id: uuid(), date, provider_id, user_id });
    this.appointments.push(appointment);
    return appointment;
  }
}

export default FakeAppointmentsRepository;
