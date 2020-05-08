import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeAppointmentRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeAppointmentRepository,
      fakeHashProvider
    );

    const user = await createUserService.execute({
      name: 'João Teste',
      email: 'jaoateste@test.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email', async () => {
    const fakeAppointmentRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeAppointmentRepository,
      fakeHashProvider
    );

    await createUserService.execute({
      name: 'João Teste',
      email: 'joaoteste@test.com',
      password: '123456',
    });

    expect(
      createUserService.execute({
        name: 'João Teste',
        email: 'joaoteste@test.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
