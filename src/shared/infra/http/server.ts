import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import { errors } from 'celebrate';
import cors from 'cors';
import 'express-async-errors';

import '@shared/infra/typeorm';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from './routes';
import rateLimiter from './middlewares/rateLimiter';

import '@shared/container';

const app = express();

app.use(
  cors({
    origin: process.env.APP_WEB_URL,
  })
);
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(rateLimiter);
app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response
      .status(err.statusCode)
      .json({ status: 'error', message: err.message });
  }
  console.log(err.message);
  return response
    .status(500)
    .json({ status: 'error', message: 'Internal server error.' });
});

app.listen(process.env.PORT, () =>
  console.log(`Listening to the port: ${process.env.PORT} 🚀`)
);
