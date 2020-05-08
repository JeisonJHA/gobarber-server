import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentRepository = new FakeAppointmentsRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentRepository
    );

    const appointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: '123123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123');
  });
  it('should not be able to create a new appointment with same date', async () => {
    const fakeAppointmentRepository = new FakeAppointmentsRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentRepository
    );

    const date = new Date();
    await createAppointmentService.execute({
      date,
      provider_id: '123123',
    });

    expect(
      createAppointmentService.execute({
        date,
        provider_id: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
