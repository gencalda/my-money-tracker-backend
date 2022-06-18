import { TransactionSourceType } from '@libs/constants/common';

export interface ITransactionSource {
  userId: string;
  createdAt: number;
  updatedAt: number;
  uuid: string;
  name: string;
  currentBalance: number;
  cardLast4Digits: string;
  type: TransactionSourceType;
}

export type ITransactionSourceDbObject = ITransactionSource;
