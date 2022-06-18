import { IEnvConfig } from '@libs/commonType';
import { CORS_ALLOWED_METHODS } from '@libs/constants/common';
import { CONFIG } from './common';
import DEV_CREDENTIALS from './credentials/development';


const DEV_VARIABLES: IEnvConfig = {
  DYNAMODB_CONFIG: {
    region: CONFIG.REGION,
  },
  S3_CONFIG: {
    region: CONFIG.REGION,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY,
    },
  },
  CORS_ALLOWED_ORIGINS: [
    'http://localhost:8100',
    'https://ql6tre5y9e.execute-api.us-east-1.amazonaws.com',
    'https://my-money-tracker.com',
    'https://www.my-money-tracker.com',
  ],
  CORS_ALLOWED_METHODS,
  AWS_CREDENTIALS: {
    ACCESS_KEY: DEV_CREDENTIALS.ACCOUNT_ACCESS_KEY,
    SECRET_KEY: DEV_CREDENTIALS.ACCOUNT_SECRET_KEY,
  },
  COGNITO: {
    CLIENT_ID: DEV_CREDENTIALS.COGNITO_CLIENT_ID,
  },
  AUTHORIZER: {
    ISSUER_URL: `https://cognito-idp.${CONFIG.REGION}.amazonaws.com/${DEV_CREDENTIALS.COGNITO_USER_POOL_ID}`,
  },
};

export default DEV_VARIABLES;