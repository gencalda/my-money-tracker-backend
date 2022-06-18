import { IEnvConfig } from '@libs/commonType';
import { CORS_ALLOWED_METHODS } from '@libs/constants/common';
import { CONFIG } from './common';
import PROD_CREDENTIALS from './credentials/production';

const PRODUCTION_VARIABLES: IEnvConfig = {
  DYNAMODB_CONFIG: {
    region: CONFIG.REGION,
  },
  S3_CONFIG: {
    region: CONFIG.REGION,
  },
  CORS_ALLOWED_ORIGINS: ['http://production-localhost:8100'],
  CORS_ALLOWED_METHODS,
  AWS_CREDENTIALS: {
    ACCESS_KEY: PROD_CREDENTIALS.ACCOUNT_ACCESS_KEY,
    SECRET_KEY: PROD_CREDENTIALS.ACCOUNT_SECRET_KEY,
  },
  COGNITO: {
    CLIENT_ID: PROD_CREDENTIALS.COGNITO_CLIENT_ID,
  },
  AUTHORIZER: {
    ISSUER_URL: '',
  },
};

export default PRODUCTION_VARIABLES;
