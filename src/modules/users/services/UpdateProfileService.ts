import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not founded.');
    }

    if (user.email !== email) {
      const usedEmail = await this.usersRepository.findByEmail(email);
      if (usedEmail) {
        throw new AppError('E-mail already in use.');
      }
    }
    if (password && !old_password) {
      throw new AppError(
        'You need to inform the new password to set a new one.'
      );
    }

    user.name = name;
    user.email = email;

    if (password && old_password) {
      const validOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password
      );
      if (!validOldPassword) {
        throw new AppError('Invalid old password.');
      }
      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
