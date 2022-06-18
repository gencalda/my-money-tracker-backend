import ROUTES from '@libs/constants/routes';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  name: 'transactions',
  events: [
    {
      httpApi: {
        method: 'OPTIONS',
        path: `${ROUTES.TRANSACTIONS}/{transactionId}`,
      },
    },
    {
      httpApi: {
        method: 'OPTIONS',
        path: ROUTES.TRANSACTIONS,
      },
    },
    {
      httpApi: {
        method: 'GET',
        path: `${ROUTES.TRANSACTIONS}/{transactionId}`,
      },
    },
    {
      httpApi: {
        method: 'DELETE',
        path: `${ROUTES.TRANSACTIONS}/{transactionId}`,
      },
    },
    {
      httpApi: {
        method: 'GET',
        path: ROUTES.TRANSACTIONS,
      },
    },
    {
      httpApi: {
        method: 'POST',
        path: ROUTES.TRANSACTIONS,
      },
    },
    {
      httpApi: {
        method: 'PUT',
        path: ROUTES.TRANSACTIONS,
      },
    },
  ],
};
