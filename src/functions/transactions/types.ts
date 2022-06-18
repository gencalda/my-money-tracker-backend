import { TransactionType } from '@libs/constants/common';

export interface IAttachment {
  uuid: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  attachmentType: string;
}
export interface ITransaction {
  createdAt?: number;
  updatedAt?: number;
  uuid?: string;
  transactionSourceId: string;
  categoryId: string;
  mainCategoryId?: string;
  type: TransactionType;
  description?: string;
  amount: number;
  date: number;
  attachments: IAttachment[];
}

export type ITransactionDbObject = ITransaction & { secondaryKey: string };
