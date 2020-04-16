import { Router } from 'express';

import AuthenticateUserService from '../services/AuthenticateUserService';

const usersRouter = Router();

usersRouter.post('/', async (req, res) => {
  const { email, password } = req.body;
  const authenticateService = new AuthenticateUserService();
  const { user, token } = await authenticateService.execute({
    email,
    password,
  });
  delete user.password;
  return res.send({ user, token });
});

export default usersRouter;
