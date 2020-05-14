import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUserRepository: FakeUsersRepository;
let providersService: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    providersService = new ListProvidersService(fakeUserRepository);
  });

  it('should be able to get all providers', async () => {
    const user1 = await fakeUserRepository.create({
      name: 'João 1',
      email: 'joao1@teste.com',
      password: '123456',
    });
    const user2 = await fakeUserRepository.create({
      name: 'João 2',
      email: 'joao2@teste.com',
      password: '123456',
    });
    const loggedUser = await fakeUserRepository.create({
      name: 'João 3',
      email: 'joao3@teste.com',
      password: '123456',
    });
    const providers = await providersService.execute({
      user_id: loggedUser.id,
    });
    expect(providers).toEqual([user1, user2]);
  });
});
