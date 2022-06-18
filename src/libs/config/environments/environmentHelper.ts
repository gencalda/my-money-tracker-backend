import { IEnvConfig } from '@libs/commonType';
import DEV_VARIABLES from './development';
import LOCAL_VARIABLES from './local';
import PRODUCTION_VARIABLES from './production';

interface IEnvironments {
  local: IEnvConfig;
  production: IEnvConfig;
  dev: IEnvConfig;
}

export const ENV = `${process.env.AWS_STAGE}`.trim() || 'local';

export const ENV_VARIABLES: IEnvironments = {
  local: LOCAL_VARIABLES,
  production: PRODUCTION_VARIABLES,
  dev: DEV_VARIABLES,
};
