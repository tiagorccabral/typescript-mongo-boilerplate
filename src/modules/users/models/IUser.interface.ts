import { Model, Document } from 'mongoose';

export interface IUser {
  email: string;
  name: string;
  password: string;
}

export interface IUserDoc extends IUser, Document {
  comparePassword(password: string): boolean;
}

export interface IUserModel extends Model<IUserDoc> {
}

// export interface IUser extends IUserDocument {
// }
