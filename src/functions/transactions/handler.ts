import Transaction from '@libs/classes/Transaction';
import { errorLogger, requestLogger } from '@libs/commonHelper';
import {
  ENV,
  ENV_VARIABLES,
} from '@libs/config/environments/environmentHelper';
import ROUTES from '@libs/constants/routes';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import serverless from 'serverless-http';
import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  getTransaction,
  updateTransaction,
} from './helpers';

const app: Application = express();
app.use(
  cors({
    origin: ENV_VARIABLES?.[ENV]?.CORS_ALLOWED_ORIGINS,
  })
);

app.use(express.json());

app.get(
  ROUTES.TRANSACTIONS_ID,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const {
        query: { transactionSourceId = '' } = {},
        params: { transactionId = '' } = {},
      } = request;

      requestLogger(request);

      const { success, message, result, statusCode } = await getTransaction(
        `${transactionSourceId}`,
        `${transactionId}`
      );

      return response.status(statusCode).json({ success, message, result });
    } catch (error) {
      next(error);
    }
  }
);

app.delete(
  ROUTES.TRANSACTIONS_ID,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const {
        query: { transactionSourceId = '' } = {},
        params: { transactionId = '' } = {},
      } = request;

      requestLogger(request);

      const { success, message, result, statusCode } = await deleteTransaction(
        `${transactionSourceId}`,
        `${transactionId}`
      );

      return response.status(statusCode).json({ success, message, result });
    } catch (error) {
      next(error);
    }
  }
);

app.get(
  ROUTES.TRANSACTIONS,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const {
        query: {
          transactionSourceId = '',
          dateTo = 0,
          dateFrom = 0,
          categoryId = '',
          subCategoryId = '',
        } = {},
      } = request;

      requestLogger(request);

      const { success, message, result, statusCode } = await getAllTransactions(
        {
          transactionSourceId,
          dateTo,
          dateFrom,
          categoryId,
          subCategoryId,
        }
      );

      return response.status(statusCode).json({ success, message, result });
    } catch (error) {
      next(error);
    }
  }
);

app.post(
  ROUTES.TRANSACTIONS,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const {
        body: {
          transactionSourceId = '',
          categoryId = '',
          mainCategoryId = '',
          description = '',
          amount = 0,
          type,
          date,
          attachments = [],
        } = {},
      } = request;

      requestLogger(request);

      const newTransaction = new Transaction();
      newTransaction.initializeNew({
        transactionSourceId,
        categoryId,
        mainCategoryId,
        description,
        amount,
        type,
        date,
        attachments,
      });

      const { success, message, result, statusCode } = await createTransaction(
        newTransaction
      );

      return response.status(statusCode).json({ success, message, result });
    } catch (error) {
      next(error);
    }
  }
);

app.put(
  ROUTES.TRANSACTIONS,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const {
        body: {
          transactionSourceId = '',
          categoryId = '',
          mainCategoryId = '',
          description = '',
          amount = 0,
          type,
          date = 0,
          createdAt = 0,
          uuid = '',
          attachments,
        } = {},
      } = request;

      if (!createdAt || !uuid) {
        return response.status(400).json({
          success: false,
          message: 'Missing createdAt or uuid value.',
          result: null,
        });
      }

      requestLogger(request);
      const transaction = new Transaction();

      transaction.initializeExisting({
        createdAt,
        uuid,
        transactionSourceId,
        categoryId,
        mainCategoryId,
        type,
        description,
        amount,
        date,
        attachments,
      });
      transaction.updatedAt = new Date().getTime();

      const { success, message, result, statusCode } = await updateTransaction(
        transaction
      );

      return response.status(statusCode).json({ success, message, result });
    } catch (error) {
      next(error);
    }
  }
);

app.options(
  ROUTES.TRANSACTIONS,
  (request: Request, response: Response, next: NextFunction) =>
    response.status(204)
);

app.options(
  ROUTES.TRANSACTIONS_ID,
  (request: Request, response: Response, next: NextFunction) =>
    response.status(204)
);

app.use((error, request: Request, response: Response, next: NextFunction) => {
  errorLogger('Encountered an error: ', error);
  return response
    .status(500)
    .json({ success: false, message: 'Internal server error occurred.' });
});

export const main = serverless(app);
