import { isValidObjectId } from 'mongoose';
import httpStatus from 'http-status';
import User from '../models/user';

import { IUserDoc } from '../models/IUser.interface';
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

const updateUser = async (
  userID: string, userData: { email?: string, name?: string }
): Promise<IUserDoc> => {
  if (!isValidObjectId(userID)) {
    throw new ApiError('User ID is not valid', httpStatus.BAD_REQUEST);
  }
  if (
    userData.email !== undefined
    && userData.email !== null
    && await User.emailIsTaken(userData.email)
  ) {
    throw new ApiError('Email already taken', httpStatus.BAD_REQUEST);
  }
  const updatedUser = await User.findOneAndUpdate({ _id: userID }, userData, { new: true });
  return updatedUser;
};

const createAdminUser = async (userData: { email: string, name: string, password: string }) => {
  if (await User.emailIsTaken(userData.email)) {
    throw new ApiError('Email already taken', httpStatus.BAD_REQUEST);
  }

  const computedData: { email: string, name: string, password: string, role?: string } = userData;

  computedData['role'] = 'admin';

  const createdUser = await User.create(computedData);
  return createdUser;
};

export {
  getUser,
  createUser,
  updateUser,
  createAdminUser
};
