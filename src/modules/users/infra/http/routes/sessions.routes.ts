import { Router } from 'express';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

const usersRouter = Router();

usersRouter.post('/', async (req, res) => {
  const { email, password } = req.body;
  const usersRepository = new UsersRepository();
  const authenticateService = new AuthenticateUserService(usersRepository);
  const { user, token } = await authenticateService.execute({
    email,
    password,
  });
  delete user.password;
  return res.send({ user, token });
});

export default usersRouter;
