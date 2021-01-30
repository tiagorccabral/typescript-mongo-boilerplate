import httpStatus from 'http-status';
import User from '../models/user';

import ApiError from '../../../errors/apiError';

const createUser = async (userData: any) => {
  if (await User.emailIsTaken(userData.email)) {
    throw new ApiError('Email already taken', httpStatus.BAD_REQUEST);
  }

  const createdUser = await User.create(userData);
  return createdUser;
};

export { createUser };
