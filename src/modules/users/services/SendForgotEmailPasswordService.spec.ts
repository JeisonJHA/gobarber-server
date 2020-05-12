import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotEmailPasswordService from './SendForgotEmailPasswordService';

let fakeUserRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotEmailPassword: SendForgotEmailPasswordService;

describe('SendForgotEmailPassword', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotEmailPassword = new SendForgotEmailPasswordService(
      fakeUserRepository,
      fakeMailProvider,
      fakeUserTokensRepository
    );
  });
  it('should be able to recovery password via email', async () => {
    const sendEmail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUserRepository.create({
      name: 'João Teste',
      email: 'joaoteste@teste.com',
      password: '123456',
    });
    await sendForgotEmailPassword.execute({ email: 'joaoteste@teste.com' });

    expect(sendEmail).toHaveBeenCalled();
  });
  it('should not be able to recovery a password of a non-existing user', async () => {
    await expect(
      sendForgotEmailPassword.execute({ email: 'joao@teste.com' })
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to generate token to renew password', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUserRepository.create({
      name: 'João Teste',
      email: 'joaoteste@teste.com',
      password: '123456',
    });
    await sendForgotEmailPassword.execute({ email: 'joaoteste@teste.com' });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
