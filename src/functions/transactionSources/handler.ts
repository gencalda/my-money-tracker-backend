import TransactionSource from '@libs/classes/TransactionSource';
import { decodeJwt, errorLogger, requestLogger } from '@libs/commonHelper';
import {
  ENV,
  ENV_VARIABLES,
} from '@libs/config/environments/environmentHelper';
import ROUTES from '@libs/constants/routes';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import serverless from 'serverless-http';
import { createTransactionSource, getTransactionSources } from './helpers';

const app: Application = express();
app.use(
  cors({
    origin: ENV_VARIABLES?.[ENV]?.CORS_ALLOWED_ORIGINS,
  })
);
app.use(express.json());

app.post(
  ROUTES.TRANSACTION_SOURCES,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { headers: { authorization } = {} } = request;
      const { sub: userId } = decodeJwt(authorization);
      requestLogger(request);

      const { success, message, result, statusCode } =
        await createTransactionSource(new TransactionSource(userId));

      return response.status(statusCode).json({ success, message, result });
    } catch (error) {
      next(error);
    }
  }
);

app.get(
  ROUTES.TRANSACTION_SOURCES,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { headers: { authorization } = {} } = request;
      const { sub: userId } = decodeJwt(authorization);

      requestLogger(request);

      const { success, message, result, statusCode } =
        await getTransactionSources(`${userId}`);

      return response.status(statusCode).json({ success, message, result });
    } catch (error) {
      next(error);
    }
  }
);

app.options(
  ROUTES.TRANSACTION_SOURCES,
  (request: Request, response: Response, next: NextFunction) =>
    response.status(204)
);

app.use((error, req: Request, res: Response, next: NextFunction) => {
  errorLogger('Encountered an error: ', error);
  return res
    .status(500)
    .json({ success: false, message: 'Internal server error occurred.' });
});

export const main = serverless(app);
