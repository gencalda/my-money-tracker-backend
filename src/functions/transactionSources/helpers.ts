import TransactionSource from '@libs/classes/TransactionSource';
import { errorLogger } from '@libs/commonHelper';
import { IResponse } from '@libs/commonType';
import { queryItem, updateItem } from '@libs/databaseHelper';
import { ITransactionSource } from './types';

export const createTransactionSource = async (
  transactionSource: TransactionSource
): Promise<IResponse<ITransactionSource>> => {
  try {
    await updateItem({
      tableName: process.env.TABLE_TRANSANSACTION_SOURCE,
      item: transactionSource.toDatabaseObject(),
    });

    return {
      success: true,
      result: transactionSource.toPlainObject(),
      message: 'Successfully created a transaction source.',
      statusCode: 201,
    };
  } catch (error) {
    errorLogger('Encountered error when creating transaction source: ', error);

    return {
      success: false,
      message: 'Failed to create a transaction source.',
      statusCode: 500,
    };
  }
};

export const getTransactionSources = async (
  userId: string
): Promise<IResponse<ITransactionSource>> => {
  if (!userId) {
    return {
      statusCode: 400,
      success: false,
      message: 'Missing user id.',
      result: null,
    };
  }

  try {
    const result = await queryItem({
      tableName: process.env.TABLE_TRANSANSACTION_SOURCE,
      keyConditionExpression: '#userId = :userIdValue',
      expressionAttributeValues: {
        ':userIdValue': userId,
      },
      expressionAttributeNames: {
        '#userId': 'userId',
      },
    });

    return {
      success: true,
      result: result as ITransactionSource,
      message: 'Successfully fetched transaction sources.',
      statusCode: 200,
    };
  } catch (error) {
    errorLogger('Encountered error when fetching transaction sources: ', error);

    return {
      success: false,
      message: 'Failed to fetch transaction sources',
      statusCode: 500,
    };
  }
};
