import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateAvatarUserService from './UpdateAvatarUserService';

describe('UpdateAvatarUser', () => {
  it('should be able save the file', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const createUserService = new UpdateAvatarUserService(
      fakeUserRepository,
      fakeStorageProvider
    );

    const user = await fakeUserRepository.create({
      name: 'João Teste',
      email: 'joaoteste@teste.com',
      password: '123456',
    });
    await createUserService.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });
    expect(user.avatar).toEqual('avatar.jpg');
  });

  it('should not be able to save a file with a non existing user', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const createUserService = new UpdateAvatarUserService(
      fakeUserRepository,
      fakeStorageProvider
    );

    expect(
      createUserService.execute({
        user_id: 'non-existing-user',
        avatarFilename: 'avatar.jpg',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be delete old file when updating new one', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
    const createUserService = new UpdateAvatarUserService(
      fakeUserRepository,
      fakeStorageProvider
    );

    const user = await fakeUserRepository.create({
      name: 'João Teste',
      email: 'joaoteste@teste.com',
      password: '123456',
    });
    await createUserService.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });
    await createUserService.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.jpg',
    });
    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toEqual('avatar2.jpg');
  });
});
