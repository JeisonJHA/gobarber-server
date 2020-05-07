import path from 'path';
import fs from 'fs';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepositories from '../repositories/IUsersRepositories';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

class UpdateAvatarUserService {
  constructor(private usersRepository: IUsersRepositories) {}

  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('Only authenticated user can change avatar.', 401);
    }
    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);
      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }
    user.avatar = avatarFilename;
    delete user.password;
    await this.usersRepository.save(user);
    return user;
  }
}

export default UpdateAvatarUserService;