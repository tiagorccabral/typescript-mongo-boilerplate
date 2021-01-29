import { model, Schema, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../../config/config';
import { IUser, IUserDoc, IUserModel } from './Iuser.interface';

const UserSchemaFields: Record<keyof IUser, any> = {
  name: String,
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
 * Methods
 */
userSchema.methods.comparePassword = function (this: IUserDoc, password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const User = model<IUserDoc, IUserModel>('User', userSchema);

export default User;
