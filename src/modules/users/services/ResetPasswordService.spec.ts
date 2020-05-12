import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeUserRepository,
      fakeUserTokensRepository,
      fakeHashProvider
    );
  });
  it('should be able to recovery password via email', async () => {
    const user = await fakeUserRepository.create({
      name: 'João Teste',
      email: 'joaoteste@teste.com',
      password: '123456',
    });

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    const { token } = await fakeUserTokensRepository.generate(user.id);

    await resetPassword.execute({ token, password: '123123' });

    const updatedUser = await fakeUserRepository.findById(user.id);

    expect(generateHash).toBeCalledWith('123123');
    expect(updatedUser?.password).toBe('123123');
  });
  it('should not be able to recovery password for a non-existing token', async () => {
    await expect(
      resetPassword.execute({ token: 'non-existing-token', password: '123123' })
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to recovery password for a non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'non-existing-user'
    );
    await expect(
      resetPassword.execute({ token, password: '123123' })
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to recovery password with expired token', async () => {
    const user = await fakeUserRepository.create({
      name: 'João Teste',
      email: 'joaoteste@teste.com',
      password: '123456',
    });
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() - 3);
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    await expect(
      resetPassword.execute({ token, password: '123123' })
    ).rejects.toBeInstanceOf(AppError);
  });
});
