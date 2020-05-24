import { injectable, inject } from 'tsyringe';

import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  getDate,
  isAfter,
  endOfDay,
} from 'date-fns';
import IAppointmentRepository from '../repositories/IAppointmentRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}
type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAvailableDaysInMonthProvider(
      {
        provider_id,
        month,
        year,
      }
    );

    const eachDay = eachDayOfInterval({
      start: startOfMonth(new Date(year, month - 1)),
      end: endOfMonth(new Date(year, month - 1)),
    });

    const availability = eachDay.map(day => {
      const appointmentsInDay = appointments.filter(appointment => {
        return isSameDay(appointment.date, day);
      });
      return {
        day: getDate(day),
        available:
          isAfter(endOfDay(day), new Date()) && appointmentsInDay.length < 10,
      };
    });
    return availability;
  }
}
