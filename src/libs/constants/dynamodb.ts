import { ENV } from '@libs/config/environments/environmentHelper';

export const TABLES = {
  TABLE_TRANSANSACTION_SOURCE: `${ENV}-transaction-source`,
  TABLE_TRANSACTIONS: `${ENV}-transactions`,
  TABLE_CATEGORY: `${ENV}-category`,
  TABLE_USER_CATEGORY: `${ENV}-user-category`,
};

export const TABLES_INDEX = {
  TABLE_INDEX_TRANSACTION_LIST: `${ENV}-transactionListIndex`,
};
