import { Router } from 'express';
import { hash } from 'bcryptjs';
import multer from 'multer';

import CreateUserService from '../services/CreateUserService';
import UpdateAvatarUserService from '../services/UpdateAvatarUserService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import uploadConfig from '../config/upload';

const upload = multer(uploadConfig);
const usersRouter = Router();

usersRouter.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const createUserService = new CreateUserService();
    const hashedPassword = await hash(password, 8);
    const user = await createUserService.execute({
      name,
      email,
      password: hashedPassword,
    });
    delete user.password;
    return res.send(user);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    try {
      const updateFile = new UpdateAvatarUserService();
      const user = await updateFile.execute({
        user_id: request.user.id,
        avatarFilename: request.file.filename,
      });
      return response.json(user);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }
);

export default usersRouter;
