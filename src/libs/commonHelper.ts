import { Request, Response } from 'express';
import jwtDecode from 'jwt-decode';

export const errorLogger = (message: string, actualError) => {
  console.error(`\n\n${message}`, actualError);
};

export const requestLogger = (request: Request) => {
  console.log('\n\nRequest: ', request);
};

export const responseLogger = (response: Response) => {
  console.log('\n\nResponse: ', response);
};

export const logger = (description: string, valueToLog: any) => {
  console.log(`\n\n${description || 'Log'}: `, valueToLog);
};

export const isValidNumber = (numberValue) =>
  Boolean(numberValue) && Number(numberValue) !== 0;

export const decodeJwt = (jwt = ''): Record<string, any> => {
  try {
    return jwtDecode(jwt?.replace?.(/^Bearer/, '')?.trim?.() || '');
  } catch (error) {
    errorLogger('Encountered error when decoding jwt:', error);
    return {};
  }
};
