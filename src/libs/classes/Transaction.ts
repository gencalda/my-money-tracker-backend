/* eslint-disable no-underscore-dangle */
import {
  IAttachment,
  ITransaction,
  ITransactionDbObject,
} from '@functions/transactions/types';
import { TransactionType } from '@libs/constants/common';
import Base from './Base';

class Transaction extends Base {
  private _secondaryKey: string;

  private _transactionSourceId: string;

  private _categoryId: string;

  private _mainCategoryId: string;

  private _type: TransactionType;

  private _description: string;

  private _amount: number;

  private _date: number;

  private _attachments: IAttachment[];

  initializeNew({
    transactionSourceId,
    categoryId,
    mainCategoryId,
    type,
    description,
    amount,
    date,
    attachments,
  }: ITransaction) {
    this._transactionSourceId = transactionSourceId;
    this._categoryId = categoryId;
    this._mainCategoryId = mainCategoryId || '';
    this._type = type;
    this._description = description;
    this._amount = amount;
    this._date = date;
    this._secondaryKey = `${this._transactionSourceId}|${this._categoryId}`;
    this._attachments = attachments;
  }

  initializeExisting({
    createdAt,
    uuid,
    updatedAt,
    transactionSourceId,
    categoryId,
    mainCategoryId,
    type,
    description,
    amount,
    date,
    attachments,
  }: ITransaction) {
    this._transactionSourceId = transactionSourceId;
    this._categoryId = categoryId;
    this._mainCategoryId = mainCategoryId || '';
    this._type = type;
    this._description = description;
    this._amount = amount;
    this._date = date;
    this._secondaryKey = `${this._transactionSourceId}|${this._categoryId}`;
    this._uuid = uuid || '';
    this._createdAt = createdAt || 0;
    this._updatedAt = updatedAt;
    this._attachments = attachments;
  }

  toPlainObject(): ITransaction {
    return {
      uuid: this._uuid,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      transactionSourceId: this._transactionSourceId,
      categoryId: this._categoryId,
      mainCategoryId: this._mainCategoryId,
      description: this._description,
      amount: this._amount,
      type: this._type,
      date: this._date,
      attachments: this._attachments,
    };
  }

  toDatabaseObject(): ITransactionDbObject {
    return {
      ...this.toPlainObject(),
      secondaryKey: this._secondaryKey,
    };
  }

  get secondaryKey() {
    return this._secondaryKey;
  }

  set transactionSourceId(transactionSourceId: string) {
    this._transactionSourceId = transactionSourceId;
  }

  get transactionSourceId() {
    return this._transactionSourceId;
  }

  set categoryId(categoryId: string) {
    this._categoryId = categoryId;
  }

  get categoryId() {
    return this._categoryId;
  }

  set mainCategoryId(mainCategoryId: string) {
    this._mainCategoryId = mainCategoryId;
  }

  get mainCategoryId() {
    return this._mainCategoryId;
  }

  set description(description: string) {
    this._description = description;
  }

  get description() {
    return this._description;
  }

  set amount(amount: number) {
    this._amount = amount;
  }

  get amount() {
    return this._amount;
  }

  set type(type: TransactionType) {
    this._type = type;
  }

  get type() {
    return this._type;
  }

  set date(date: number) {
    this._date = date;
  }

  get date() {
    return this._date;
  }

  set attachments(attachments: IAttachment[]) {
    this._attachments = attachments;
  }

  get attachments() {
    return this._attachments;
  }
}

export default Transaction;
