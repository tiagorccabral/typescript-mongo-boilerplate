import { Model, Document } from 'mongoose';

export interface IUser {
  email: string;
  name: string;
  password: string;
  role: 'regular' | 'admin';
}

export interface IUserDoc extends IUser, Document {
  comparePassword(password: string): boolean;
}

export interface IUserModel extends Model<IUserDoc> {
  emailIsTaken(email: string): Promise<boolean>
}
