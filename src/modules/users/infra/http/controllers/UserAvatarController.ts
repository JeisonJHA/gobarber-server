import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateAvatarUserService from '@modules/users/services/UpdateAvatarUserService';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateFile = container.resolve(UpdateAvatarUserService);
    const user = await updateFile.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });
    return response.json(user);
  }
}
