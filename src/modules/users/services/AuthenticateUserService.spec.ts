import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';

describe('AuthenticateUser', () => {
  it('should be able to authenticate user', async () => {
    const fakeAppointmentRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeAppointmentRepository,
      fakeHashProvider
    );
    const authenticateUser = new AuthenticateUserService(
      fakeAppointmentRepository,
      fakeHashProvider
    );

    const user = await createUser.execute({
      name: 'João teste',
      email: 'jaoateste@test.com',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'jaoateste@test.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    const fakeAppointmentRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const authService = new AuthenticateUserService(
      fakeAppointmentRepository,
      fakeHashProvider
    );
    await expect(
      authService.execute({
        email: 'joaoteste@test.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const fakeAppointmentRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeAppointmentRepository,
      fakeHashProvider
    );
    const authService = new AuthenticateUserService(
      fakeAppointmentRepository,
      fakeHashProvider
    );
    await createUser.execute({
      name: 'João teste',
      email: 'joaoteste@test.com',
      password: '123456',
    });

    await expect(
      authService.execute({
        email: 'joaoteste@test.com',
        password: '123457',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
