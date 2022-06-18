export interface IResponse<T> {
  success: boolean;
  message: string;
  result?: T;
  statusCode: number;
}

export enum DBTransactionType {
  Update = 'Update',
  Create = 'Create',
  Delete = 'Delete',
  FetchAll = 'FetchAll',
  Fetch = 'Fetch',
  Search = 'Search',
}

export interface IEnvConfig {
  DYNAMODB_CONFIG: Record<string, string | Record<string, string>>;
  S3_CONFIG: Record<string, string | Record<string, string>>;
  CORS_ALLOWED_ORIGINS: string[];
  CORS_ALLOWED_METHODS: string[];
  AWS_CREDENTIALS: {
    ACCESS_KEY: string;
    SECRET_KEY: string;
  };
  COGNITO: {
    CLIENT_ID: string;
  };
  AUTHORIZER: {
    ISSUER_URL: string;
  };
}

export interface IEnvConfigValues {
  ACCOUNT_ACCESS_KEY: string;
  ACCOUNT_SECRET_KEY: string;
  COGNITO_CLIENT_ID: string;
  COGNITO_USER_POOL_ID: string;
}
