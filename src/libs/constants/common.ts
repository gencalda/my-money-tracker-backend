import { ENV } from '@libs/config/environments/environmentHelper';

export enum TransactionType {
  Income = 'Income',
  Expense = 'Expense',
}

export enum TransactionSourceType {
  CreditCard = 'CreditCard',
  DebitCard = 'DebitCard',
  Cash = 'Cash',
}

export const CORS_ALLOWED_METHODS: string[] = [
  'GET',
  'POST',
  'DELETE',
  'PUT',
  'OPTIONS',
];

export const BUCKET_NAME = `${ENV}-my-money-tracker-f3ace843-2227-420b-9a28-0f2e5458087f`;

export enum S3Folder {
  Transaction = 'Transaction/',
  General = 'General/',
}

export enum AttachmentType {
  Transaction = 'transaction',
}
