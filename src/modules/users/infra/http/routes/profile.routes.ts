import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import ProfileController from '../controllers/ProfileController';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string().when('old_password', {
        is: Joi.exist(),
        then: Joi.string().required(),
      }),
      password_confirmation: Joi.string().when('password', {
        is: Joi.exist(),
        then: Joi.string().required().valid(Joi.ref('password')),
      }),
    },
  }),
  profileController.update
);
profileRouter.get('/', profileController.show);

export default profileRouter;
