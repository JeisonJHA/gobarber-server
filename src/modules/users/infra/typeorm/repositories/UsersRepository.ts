import { EntityRepository, Repository, getRepository } from 'typeorm';
import IUserRepositories from '@modules/users/repositories/IUsersRepositories';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '../entities/User';

@EntityRepository(User)
class UsersRepository implements IUserRepositories {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository('User');
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);
    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: {
        email,
      },
    });
    return user;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const appointment = this.ormRepository.create(userData);
    await this.ormRepository.save(appointment);
    return appointment;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UsersRepository;
