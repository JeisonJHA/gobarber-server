import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendForgotEmailPasswordService from '@modules/users/services/SendForgotEmailPasswordService';

export default class ForgotPasswordController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;
    try {
      const sendForgotPasswordEmail = container.resolve(
        SendForgotEmailPasswordService
      );
      await sendForgotPasswordEmail.execute({
        email,
      });
    } catch (err) {
      console.log(err);
    }

    return res.status(204).json();
  }
}
