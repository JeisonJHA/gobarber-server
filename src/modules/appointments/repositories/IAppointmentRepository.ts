import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointment from '../dtos/ICreateAppointmentDTO';
import IFindAvailableDaysInMonthProviderDTO from '../dtos/IFindAvailableDaysInMonthProviderDTO';
import IFindAvailableHoursInDaysProviderDTO from '../dtos/IFindAvailableHoursInDaysProviderDTO';

export default interface IAppointmentRepository {
  create(data: ICreateAppointment): Promise<Appointment>;
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
  findAvailableDaysInMonthProvider(
    data: IFindAvailableDaysInMonthProviderDTO
  ): Promise<Appointment[]>;
  findAvailableHoursInDaysProvider(
    data: IFindAvailableHoursInDaysProviderDTO
  ): Promise<Appointment[]>;
}
