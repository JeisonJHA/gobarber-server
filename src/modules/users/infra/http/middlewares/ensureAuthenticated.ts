import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

interface IToken {
  iat: number;
  exp: number;
  sub: string;
}

export default function (
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new AppError('Not authenticated.', 401);
  }
  const [, token] = authHeader.split(' ');
  try {
    const decoded = verify(token, authConfig.jwt.secret);
    const { sub } = decoded as IToken;

    request.user = {
      id: sub,
    };
    next();
  } catch (err) {
    throw new AppError('Not authenticated.', 401);
  }
}
