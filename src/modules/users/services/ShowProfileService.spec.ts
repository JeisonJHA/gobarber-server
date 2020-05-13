import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUserRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUserRepository);
  });

  it('should be able to show the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'João Teste',
      email: 'joaoteste@teste.com',
      password: '123456',
    });
    const profile = await showProfile.execute({
      user_id: user.id,
    });
    expect(profile.name).toBe('João Teste');
    expect(profile.email).toBe('joaoteste@teste.com');
  });

  it('should not be able to the profile of a non-existing user', async () => {
    await expect(
      showProfile.execute({
        user_id: 'non-existing-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
