/* eslint-disable no-underscore-dangle */
import {
  ITransactionSource,
  ITransactionSourceDbObject,
} from '@functions/transactionSources/types';
import { TransactionSourceType } from '@libs/constants/common';
import Base from './Base';

class TransactionSource extends Base {
  constructor(
    private _userId: string,
    private _name: string = 'Default wallet',
    private _currentBalance: number = 0,
    private _cardLast4Digits: string = '',
    private _type: TransactionSourceType = TransactionSourceType.Cash
  ) {
    super();
  }

  toPlainObject(): ITransactionSource {
    return {
      uuid: this._uuid,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      userId: this._userId,
      name: this._name,
      currentBalance: this._currentBalance,
      cardLast4Digits: this._cardLast4Digits,
      type: this._type,
    };
  }

  toDatabaseObject(): ITransactionSourceDbObject {
    return this.toPlainObject();
  }

  get userId() {
    return this._userId;
  }

  set name(name: string) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  set currentBalance(currentBalance: number) {
    this._currentBalance = currentBalance;
  }

  get currentBalance() {
    return this._currentBalance;
  }

  set cardLast4Digits(cardLast4Digits: string) {
    this._cardLast4Digits = cardLast4Digits;
  }

  get cardLast4Digits() {
    return this._cardLast4Digits;
  }

  set type(type: TransactionSourceType) {
    this._type = type;
  }

  get type() {
    return this._type;
  }
}

export default TransactionSource;
