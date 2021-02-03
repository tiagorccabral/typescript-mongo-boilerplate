import { isValidObjectId } from 'mongoose';
import httpStatus from 'http-status';
import User from '../models/user';

import { IUserDoc } from '../models/Iuser.interface';
import ApiError from '../../../errors/apiError';

const getUser = async (userID: string): Promise<IUserDoc> => {
  if (isValidObjectId(userID)) {
    const user = await User.findById(userID);
    return user;
  }
  throw new ApiError('User ID is not valid', httpStatus.BAD_REQUEST);
};

const createUser = async (userData: { email: string, name: string, password: string }) => {
  if (await User.emailIsTaken(userData.email)) {
    throw new ApiError('Email already taken', httpStatus.BAD_REQUEST);
  }

  const createdUser = await User.create(userData);
  return createdUser;
};

export { getUser, createUser };
