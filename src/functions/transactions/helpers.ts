import Transaction from '@libs/classes/Transaction';
import { errorLogger, isValidNumber, logger } from '@libs/commonHelper';
import { DBTransactionType, IResponse } from '@libs/commonType';
import {
  deleteItem,
  IQueryItem,
  queryItem,
  updateItem,
} from '@libs/databaseHelper';
import { IAttachment, ITransaction } from './types';

interface IMessages {
  successMessage: string;
  failedMessage: string;
  errorLogMessage: string;
}

const PROJECTION_EXPRESSION =
  '#uuid, #createdAt, #categoryId, #mainCategoryId, #type, #description, #amount, #date, #attachments';
const EXPRESSION_ATTRIBUTE_NAMES = {
  '#uuid': 'uuid',
  '#createdAt': 'createdAt',
  '#transactionSourceId': 'transactionSourceId',
  '#categoryId': 'categoryId',
  '#mainCategoryId': 'mainCategoryId',
  '#type': 'type',
  '#description': 'description',
  '#amount': 'amount',
  '#date': 'date',
  '#attachments': 'attachments',
};

const getMessages = (type: DBTransactionType): IMessages => {
  switch (type) {
    case DBTransactionType.Create:
      return {
        successMessage: 'Successfully created a transaction.',
        failedMessage: 'Failed to create a transaction.',
        errorLogMessage: 'Encountered error when creating transaction: ',
      };
    case DBTransactionType.Update:
      return {
        successMessage: 'Successfully updated a transaction.',
        failedMessage: 'Failed to update a transaction.',
        errorLogMessage: 'Encountered error when updating transaction: ',
      };
    case DBTransactionType.FetchAll:
      return {
        successMessage: 'Successfully fetched all transactions.',
        failedMessage: 'Failed to fetch all transactions.',
        errorLogMessage: 'Encountered error when fetching all transactions: ',
      };
    case DBTransactionType.Fetch: {
      return {
        successMessage: 'Successfully fetched the transaction.',
        failedMessage: 'Failed to fetch the transaction.',
        errorLogMessage: 'Encountered error when fetching the transaction.: ',
      };
    }
    case DBTransactionType.Search: {
      return {
        successMessage: 'Successfully searched the transactions.',
        failedMessage: 'Failed to search the transactions.',
        errorLogMessage: 'Encountered error when searching the transactions.: ',
      };
    }
    case DBTransactionType.Delete: {
      return {
        successMessage: 'Successfully deleted the transaction.',
        failedMessage: 'Failed to delete the transaction.',
        errorLogMessage: 'Encountered error when deleting the transaction.: ',
      };
    }
    default:
      return {
        successMessage: '',
        failedMessage: '',
        errorLogMessage: '',
      };
  }
};

export const createTransaction = async (
  transaction: Transaction
): Promise<IResponse<ITransaction>> => {
  const { successMessage, failedMessage, errorLogMessage } = getMessages(
    DBTransactionType.Create
  );

  try {
    await updateItem({
      tableName: process.env.TABLE_TRANSACTIONS,
      item: transaction.toDatabaseObject(),
    });

    return {
      success: true,
      result: transaction.toPlainObject(),
      message: successMessage,
      statusCode: 201,
    };
  } catch (error) {
    errorLogger(errorLogMessage, error);

    return {
      success: false,
      message: failedMessage,
      statusCode: 500,
    };
  }
};

export const updateTransaction = async (
  transaction: Transaction
): Promise<IResponse<ITransaction>> => {
  const { successMessage, failedMessage, errorLogMessage } = getMessages(
    DBTransactionType.Update
  );

  try {
    const tempUuid = transaction?.uuid || '';
    const tempDate = transaction?.date || 0;
    const tempCreatedAt = transaction?.createdAt || 0;

    await updateItem({
      tableName: process.env.TABLE_TRANSACTIONS,
      item: transaction.toDatabaseObject(),
      expressionAttributeValues: {
        ':emptyString': '',
        ':emptyDate': 0,
        ':tempDate': tempDate,
        ':tempCreatedAt': tempCreatedAt,
        ':tempUuid': tempUuid,
      },
      expressionAttributeNames: {
        '#createdAt': 'createdAt',
        '#uuid': 'uuid',
        '#date': 'date',
      },
      conditionExpression:
        'attribute_exists(#uuid) AND :tempUuid <> :emptyString ' +
        'AND attribute_exists(#createdAt) AND :tempDate <> :emptyDate ' +
        'AND attribute_exists(#date) AND :tempCreatedAt <> :emptyDate ',
    });

    return {
      success: true,
      result: transaction.toPlainObject(),
      message: successMessage,
      statusCode: 200,
    };
  } catch (error) {
    errorLogger(errorLogMessage, error);

    return {
      success: false,
      message: failedMessage,
      statusCode: 500,
    };
  }
};

export const validateQueryParams = (
  queryParams
): { valid: boolean; message?: string } => {
  if (
    'transactionSourceId' in queryParams &&
    !queryParams?.transactionSourceId
  ) {
    return { valid: false, message: 'Missing Transaction Source Id.' };
  }

  if ('transactionId' in queryParams && !queryParams?.transactionId) {
    return { valid: false, message: 'Missing Transaction Id.' };
  }

  return { valid: true };
};

const generateTransactionQuery = ({
  transactionSourceId,
  dateTo,
  dateFrom,
  categoryId,
  subCategoryId,
}): IQueryItem => {
  let keyConditionExpression =
    '#transactionSourceId = :transactionSourceIdValue';
  const expressionAttributeValues = {
    ':transactionSourceIdValue': transactionSourceId,
  };

  if (isValidNumber(dateTo) && isValidNumber(dateFrom)) {
    keyConditionExpression +=
      ' AND #date BETWEEN :dateFromValue AND :dateToValue';
    expressionAttributeValues[':dateFromValue'] = Number(dateFrom);
    expressionAttributeValues[':dateToValue'] = Number(dateTo);
  }

  const query: IQueryItem = {
    tableName: process.env.TABLE_TRANSACTIONS,
    locaIndexName: process.env.TABLE_INDEX_TRANSACTION_LIST,
    keyConditionExpression,
    projectExpression: PROJECTION_EXPRESSION,
    expressionAttributeValues,
    expressionAttributeNames: EXPRESSION_ATTRIBUTE_NAMES,
  };

  if (categoryId && !subCategoryId) {
    query.filterExpression =
      '(#categoryId = :categoryIdValue OR #mainCategoryId = :categoryIdValue)';
    query.expressionAttributeValues = {
      ...query.expressionAttributeValues,
      ':categoryIdValue': categoryId,
    };
  }

  if (subCategoryId) {
    query.filterExpression = '#categoryId = :categoryIdValue';
    query.expressionAttributeValues = {
      ...query.expressionAttributeValues,
      ':categoryIdValue': subCategoryId,
    };
  }

  return query;
};

export const getAllTransactions = async ({
  transactionSourceId,
  dateTo,
  dateFrom,
  categoryId,
  subCategoryId,
}): Promise<IResponse<ITransaction[]>> => {
  const { successMessage, failedMessage, errorLogMessage } = getMessages(
    DBTransactionType.Search
  );

  const isQueryParamsValid = validateQueryParams({
    transactionSourceId,
  });

  if (!isQueryParamsValid.valid) {
    return {
      success: false,
      message: isQueryParamsValid.message,
      result: null,
      statusCode: 400,
    };
  }

  try {
    const query = generateTransactionQuery({
      transactionSourceId,
      dateTo,
      dateFrom,
      categoryId,
      subCategoryId,
    });
    const searchedTransactions = await queryItem(query);

    return {
      success: true,
      message: successMessage,
      result: searchedTransactions as ITransaction[],
      statusCode: 200,
    };
  } catch (error) {
    errorLogger(errorLogMessage, error);

    return {
      success: false,
      message: failedMessage,
      statusCode: 500,
    };
  }
};

export const getTransaction = async (
  transactionSourceId: string,
  transactionId: string
): Promise<IResponse<ITransaction>> => {
  const { valid, message } = validateQueryParams({
    transactionSourceId,
    transactionId,
  });
  if (!valid) {
    return {
      statusCode: 400,
      success: false,
      message,
      result: null,
    };
  }

  const { successMessage, failedMessage, errorLogMessage } = getMessages(
    DBTransactionType.Fetch
  );
  try {
    const allTransactions: ITransaction[] = await queryItem({
      tableName: process.env.TABLE_TRANSACTIONS,
      keyConditionExpression:
        '#transactionSourceId = :transactionSourceIdValue AND #uuid= :transactionIdValue',
      projectExpression: PROJECTION_EXPRESSION,
      expressionAttributeValues: {
        ':transactionSourceIdValue': transactionSourceId,
        ':transactionIdValue': transactionId,
      },
      expressionAttributeNames: EXPRESSION_ATTRIBUTE_NAMES,
    });

    return {
      success: true,
      message: successMessage,
      result: allTransactions?.[0] || null,
      statusCode: 200,
    };
  } catch (error) {
    errorLogger(errorLogMessage, error);

    return {
      success: false,
      message: failedMessage,
      statusCode: 500,
    };
  }
};

export const deleteTransaction = async (
  transactionSourceId: string,
  transactionId: string
): Promise<IResponse<ITransaction>> => {
  const { valid, message } = validateQueryParams({
    transactionSourceId,
    transactionId,
  });

  if (!valid) {
    return {
      success: false,
      message,
      result: null,
      statusCode: 400,
    };
  }

  const { successMessage, failedMessage, errorLogMessage } = getMessages(
    DBTransactionType.Delete
  );
  try {
    await deleteItem({
      tableName: process.env.TABLE_TRANSACTIONS,
      key: { transactionSourceId, uuid: transactionId },
    });

    return {
      success: true,
      message: successMessage,
      result: null,
      statusCode: 204,
    };
  } catch (error) {
    errorLogger(errorLogMessage, error);

    return {
      success: false,
      message: failedMessage,
      statusCode: 500,
    };
  }
};
