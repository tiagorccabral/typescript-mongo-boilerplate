import httpStatus from 'http-status';

import User from '../../users/models/user';
import { IUserDoc } from '../../users/models/IUser.interface';
import ApiError from '../../../errors/apiError';

interface IUserData {
  email: string;
  password: string;
};

const loginUserWithEmailAndPassword = async (userData: IUserData) => {
  const user: IUserDoc = await User.findOne({ email: userData.email });
  if (user && await user.comparePassword(userData.password)) {
    return user;
  }
  throw new ApiError('Incorrect e-mail or password', httpStatus.UNAUTHORIZED);
};

export {
  loginUserWithEmailAndPassword
};
