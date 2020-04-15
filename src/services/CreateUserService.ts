import { getRepository } from 'typeorm';
import User from '../models/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const userRepository = getRepository(User);
    const emailExists = await userRepository.findOne({
      where: { email },
    });
    if (emailExists) {
      throw Error('Email already used.');
    }
    const user = userRepository.create({ name, email, password });
    await userRepository.save(user);
    return user;
  }
}

export default CreateUserService;
