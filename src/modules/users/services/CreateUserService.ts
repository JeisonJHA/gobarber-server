import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepositories from '../repositories/IUsersRepositories';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  constructor(private usersRepository: IUsersRepositories) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const emailExists = await this.usersRepository.findByEmail(email);
    if (emailExists) {
      throw new AppError('Email already used.');
    }
    const user = this.usersRepository.create({ name, email, password });
    return user;
  }
}

export default CreateUserService;
