import { Router } from 'express';
import { hash } from 'bcryptjs';
import multer from 'multer';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';
import uploadConfig from '@config/upload';
import UpdateAvatarUserService from '@modules/users/services/UpdateAvatarUserService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const upload = multer(uploadConfig);
const usersRouter = Router();

usersRouter.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  const createUserService = container.resolve(CreateUserService);
  const hashedPassword = await hash(password, 8);
  const user = await createUserService.execute({
    name,
    email,
    password: hashedPassword,
  });
  delete user.password;
  return res.send(user);
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const updateFile = container.resolve(UpdateAvatarUserService);
    const user = await updateFile.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });
    return response.json(user);
  }
);

export default usersRouter;
