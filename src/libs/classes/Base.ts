/* eslint-disable no-underscore-dangle */
import { v4 as uuid4 } from 'uuid';

abstract class Base {
  protected _uuid: string;

  protected _createdAt: number;

  protected _updatedAt: number;

  constructor() {
    this._createdAt = new Date().getTime();
    this._uuid = uuid4();
    this._updatedAt = 0;
  }

  get uuid() {
    return this._uuid;
  }

  set uuid(uuid: string) {
    this._uuid = uuid;
  }

  get createdAt() {
    return this._createdAt;
  }

  set createdAt(createdAt: number) {
    this._createdAt = createdAt;
  }

  set updatedAt(updatedAt: number) {
    this._updatedAt = updatedAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  abstract initializeNew(initialValues: any);
  abstract initializeExisting(initialValues: any);
  abstract toPlainObject();
  abstract toDatabaseObject();
}

export default Base;
