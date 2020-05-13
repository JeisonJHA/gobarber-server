import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';

let fakeAppointmentRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;
describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(
      fakeAppointmentRepository,
      fakeHashProvider
    );
    authenticateUser = new AuthenticateUserService(
      fakeAppointmentRepository,
      fakeHashProvider
    );
  });
  it('should be able to authenticate user', async () => {
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
    await expect(
      authenticateUser.execute({
        email: 'joaoteste@test.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await createUser.execute({
      name: 'João teste',
      email: 'joaoteste@test.com',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: 'joaoteste@test.com',
        password: '123457',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
