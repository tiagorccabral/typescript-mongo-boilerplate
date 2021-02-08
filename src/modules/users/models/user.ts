import { model, Schema, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../../config/config';
import { IUser, IUserDoc, IUserModel } from './IUser.interface';

/**
* User Roles
*/
const roles = ['regular', 'admin'];

const UserSchemaFields: Record<keyof IUser, any> = {
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 128
  },
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 128
  },
  role: {
    type: String,
    enum: roles,
    default: 'regular'
  }
};

const userSchema = new Schema(UserSchemaFields, {
  timestamps: true
});

userSchema.pre<IUserDoc>('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();

    const rounds = config.env === 'test' ? 1 : 10;

    const hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Statics
 */
userSchema.static('emailIsTaken', async function (email: string) {
  const foundUser = await this.findOne({ email });
  return !!foundUser;
});

/**
 * Methods
 */
userSchema.methods.comparePassword = function (this: IUserDoc, password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const User = model<IUserDoc, IUserModel>('User', userSchema);

export default User;
