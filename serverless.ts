import transactions from '@functions/transactions';
import transactionSources from '@functions/transactionSources';
import { CONFIG } from '@libs/config/environments/common';
import {
  ENV,
  ENV_VARIABLES,
} from '@libs/config/environments/environmentHelper';
import { BUCKET_NAME } from '@libs/constants/common';
import { TABLES, TABLES_INDEX } from '@libs/constants/dynamodb';
import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'my-money-tracker',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-dynamodb-local',
    'serverless-offline',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',
    profile: 'serverlessGenDev1',
    stage: ENV,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    httpApi: {
      cors: {
        allowedOrigins: ENV_VARIABLES?.[ENV]?.CORS_ALLOWED_ORIGINS,
      },
      authorizers: {
        serviceAuthorizer: {
          type: 'jwt',
          identitySource: CONFIG.IDENTITY_SOURCE,
          issuerUrl: ENV_VARIABLES?.[ENV]?.AUTHORIZER?.ISSUER_URL,
          audience: [ENV_VARIABLES?.[ENV]?.COGNITO?.CLIENT_ID],
        },
      },
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      TABLE_TRANSANSACTION_SOURCE: TABLES.TABLE_TRANSANSACTION_SOURCE,
      TABLE_TRANSACTIONS: TABLES.TABLE_TRANSACTIONS,
      TABLE_CATEGORY: TABLES.TABLE_CATEGORY,
      TABLE_USER_CATEGORY: TABLES.TABLE_USER_CATEGORY,
      TABLE_INDEX_TRANSACTION_LIST: TABLES_INDEX.TABLE_INDEX_TRANSACTION_LIST,
      AWS_STAGE: ENV,
      ACCESS_KEY: ENV_VARIABLES?.[ENV]?.AWS_CREDENTIALS?.ACCESS_KEY,
      SECRET_KEY: ENV_VARIABLES?.[ENV]?.AWS_CREDENTIALS?.SECRET_KEY,
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:Query',
              'dynamodb:PutItem',
              'dynamodb:DeleteItem',
            ],
            Resource: '*',
          },
        ],
      },
    },
  },
  functions: { transactions, transactionSources },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      stages: ['dev', 'local'],
      start: {
        port: '8000',
        migrate: true,
        seed: true,
      },
      seed: {
        local: {
          sources: [
            {
              table: TABLES.TABLE_TRANSANSACTION_SOURCE,
              sources: ['./src/libs/seeding/transactionSource.json'],
            },
          ],
        },
      },
    },
  },
  resources: {
    Resources: {
      Bucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: BUCKET_NAME,
        },
      },
      TransactionSourceTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: TABLES.TABLE_TRANSANSACTION_SOURCE,
          AttributeDefinitions: [
            {
              AttributeName: 'userId',
              AttributeType: 'S',
            },
            {
              AttributeName: 'createdAt',
              AttributeType: 'N',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'userId',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'createdAt',
              KeyType: 'RANGE',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
      TransactionsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: TABLES.TABLE_TRANSACTIONS,
          AttributeDefinitions: [
            {
              AttributeName: 'transactionSourceId',
              AttributeType: 'S',
            },
            {
              AttributeName: 'uuid',
              AttributeType: 'S',
            },
            {
              AttributeName: 'date',
              AttributeType: 'N',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'transactionSourceId',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'uuid',
              KeyType: 'RANGE',
            },
          ],
          LocalSecondaryIndexes: [
            {
              IndexName: TABLES_INDEX.TABLE_INDEX_TRANSACTION_LIST,
              KeySchema: [
                {
                  AttributeName: 'transactionSourceId',
                  KeyType: 'HASH',
                },
                {
                  AttributeName: 'date',
                  KeyType: 'RANGE',
                },
              ],
              Projection: {
                NonKeyAttributes: [
                  'createdAt',
                  'updatedAt',
                  'categoryId',
                  'mainCategoryId',
                  'description',
                  'type',
                  'amount',
                ],
                ProjectionType: 'INCLUDE',
              },
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
