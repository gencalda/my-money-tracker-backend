import {
  DeleteItemCommand,
  DeleteItemCommandInput,
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { ITransactionSourceDbObject } from '@functions/transactionSources/types';
import { ITransactionDbObject } from '@functions/transactions/types';
import { logger } from './commonHelper';
import { ENV, ENV_VARIABLES } from './config/environments/environmentHelper';

export const databaseClient = new DynamoDBClient(
  ENV_VARIABLES?.[ENV]?.DYNAMODB_CONFIG
);

export interface IQueryItem {
  tableName: string;
  keyConditionExpression: string;
  expressionAttributeValues: Record<string, string | number>;
  expressionAttributeNames: Record<string, string>;
  projectExpression?: string;
  filterExpression?: string;
  locaIndexName?: string;
}

export const queryItem = ({
  tableName,
  keyConditionExpression,
  expressionAttributeValues,
  expressionAttributeNames,
  projectExpression,
  filterExpression,
  locaIndexName,
}: IQueryItem): any =>
  new Promise((resolve, reject) => {
    const params: QueryCommandInput = {
      TableName: tableName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: marshall(expressionAttributeValues),
      ExpressionAttributeNames: expressionAttributeNames,
    };

    if (projectExpression) {
      params.ProjectionExpression = projectExpression;
    }

    if (filterExpression) {
      params.FilterExpression = filterExpression;
    }

    if (locaIndexName) {
      params.IndexName = locaIndexName;
      params.ConsistentRead = false;
    }

    logger('dynamodb query params: ', params);

    databaseClient
      .send(new QueryCommand(params))
      .then(({ Items = [] }) => {
        resolve(Items.map((item) => unmarshall(item)));
      })
      .catch((error) => reject(error));
  });

interface IUpdateItem {
  tableName: string;
  item: ITransactionDbObject | ITransactionSourceDbObject;
  conditionExpression?: string;
  expressionAttributeValues?: Record<string, string | number | boolean>;
  expressionAttributeNames?: Record<string, string>;
}

export const updateItem = ({
  tableName,
  item,
  conditionExpression,
  expressionAttributeValues,
  expressionAttributeNames,
}: IUpdateItem) =>
  new Promise((resolve, reject) => {
    const params: PutItemCommandInput = {
      TableName: tableName,
      Item: marshall(item),
    };

    if (conditionExpression) {
      params.ConditionExpression = conditionExpression;
    }

    if (expressionAttributeValues) {
      params.ExpressionAttributeValues = marshall(expressionAttributeValues);
    }

    if (expressionAttributeNames) {
      params.ExpressionAttributeNames = expressionAttributeNames;
    }

    logger('dynamodb update item params: ', params);

    databaseClient
      .send(new PutItemCommand(params))
      .then(() => {
        resolve(item);
      })
      .catch((error) => reject(error));
  });

interface IDeleteItem {
  tableName: string;
  key: Record<string, string | number | boolean>;
}

export const deleteItem = ({ tableName, key }: IDeleteItem) =>
  new Promise((resolve, reject) => {
    const params: DeleteItemCommandInput = {
      TableName: tableName,
      Key: marshall(key),
    };

    logger('dynamodb delete item params: ', params);

    databaseClient
      .send(new DeleteItemCommand(params))
      .then(() => resolve('successfully deleted'))
      .catch((error) => reject(error));
  });
