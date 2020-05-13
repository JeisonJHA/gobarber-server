import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeAppointmentRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
describe('CreateUser', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeAppointmentRepository,
      fakeHashProvider
    );
  });
  it('should be able to create a new user', async () => {
    const user = await createUserService.execute({
      name: 'João Teste',
      email: 'jaoateste@test.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email', async () => {
    await createUserService.execute({
      name: 'João Teste',
      email: 'joaoteste@test.com',
      password: '123456',
    });

    await expect(
      createUserService.execute({
        name: 'João Teste',
        email: 'joaoteste@test.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
