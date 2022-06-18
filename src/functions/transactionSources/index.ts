import ROUTES from '@libs/constants/routes';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  name: 'transactionSources',
  events: [
    {
      httpApi: {
        method: 'OPTIONS',
        path: ROUTES.TRANSACTION_SOURCES,
      },
    },
    {
      httpApi: {
        method: 'GET',
        path: ROUTES.TRANSACTION_SOURCES,
      },
    },
    {
      httpApi: {
        method: 'POST',
        path: ROUTES.TRANSACTION_SOURCES,
      },
    },
  ],
};
