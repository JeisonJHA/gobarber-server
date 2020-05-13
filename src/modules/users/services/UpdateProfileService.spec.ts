import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUserRepository: FakeUsersRepository;
let hashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(fakeUserRepository, hashProvider);
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'João Teste',
      email: 'joaoteste@teste.com',
      password: '123456',
    });
    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John tre',
      email: 'johntre@test.com',
    });
    expect(updateUser.name).toBe('John tre');
    expect(updateUser.email).toBe('johntre@test.com');
  });

  it('should not be able to change the email to the another user', async () => {
    await fakeUserRepository.create({
      name: 'João Teste',
      email: 'joaoteste@teste.com',
      password: '123456',
    });
    const user = await fakeUserRepository.create({
      name: 'Teste',
      email: 'teste@teste.com',
      password: '123456',
    });
    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John tre',
        email: 'joaoteste@teste.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUserRepository.create({
      name: 'João Teste',
      email: 'joaoteste@teste.com',
      password: '123456',
    });
    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: 'João Teste',
      email: 'joaoteste@teste.com',
      old_password: '123456',
      password: '123123',
    });
    expect(updateUser.password).toBe('123123');
  });

  it('should not be able to update the password without the old one', async () => {
    const user = await fakeUserRepository.create({
      name: 'João Teste',
      email: 'joaoteste@teste.com',
      password: '123456',
    });
    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'João Teste',
        email: 'joaoteste@teste.com',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with the wrong old one', async () => {
    const user = await fakeUserRepository.create({
      name: 'João Teste',
      email: 'joaoteste@teste.com',
      password: '123456',
    });
    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'João Teste',
        email: 'joaoteste@teste.com',
        old_password: '321321',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
