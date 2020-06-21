import { injectable, inject } from 'tsyringe';

import { getHours, isAfter } from 'date-fns';
import IAppointmentRepository from '../repositories/IAppointmentRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}
type IResponse = Array<{
  hour: number;
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
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAvailableHoursInDaysProvider(
      {
        provider_id,
        day,
        month,
        year,
      }
    );

    const hourStart = 8;
    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart
    );
    const now = new Date();
    const availability = eachHourArray.map(hour => {
      const hasAppointment = appointments.find(
        appointment => getHours(appointment.date) === hour
      );
      const scheduleDay = new Date(year, month, day, hour);
      return {
        hour,
        available: !hasAppointment && !isAfter(now, scheduleDay),
      };
    });
    return availability;
  }
}
