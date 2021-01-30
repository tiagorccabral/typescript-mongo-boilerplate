import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../helpers/catchAsync';
import * as usersService from '../services/users.service';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await usersService.createUser(req.body);
  res.status(httpStatus.CREATED).send({ user });
});

export default {
  createUser
};
