import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import User from '../models/User';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw Error('Incorrect email/password.');
    }
    const passwordMatched = compare(password, user.password);
    if (!passwordMatched) {
      throw Error('Incorrect email/password.');
    }
    const token = sign({}, '4e8e9ff0a9091342fa5d7c042cef7843', {
      subject: user.id,
      expiresIn: '1d',
    });
    return { user, token };
  }
}

export default AuthenticateUserService;
