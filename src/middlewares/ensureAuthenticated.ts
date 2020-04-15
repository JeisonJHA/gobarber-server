import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../config/auth';

interface Token {
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
    throw new Error('Not authenticated.');
  }
  const [, token] = authHeader.split(' ');
  try {
    const decoded = verify(token, authConfig.jwt.secret);
    const { sub } = decoded as Token;

    request.user = {
      id: sub,
    };
    next();
  } catch (err) {
    throw new Error('Not authenticated.');
  }
}
