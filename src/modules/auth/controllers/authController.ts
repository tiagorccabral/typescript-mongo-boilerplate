import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../helpers/catchAsync';

import * as authService from '../services/auth.service';
import * as userService from '../../users/services/users.service';

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userData = { email, password };
  const user = await authService.loginUserWithEmailAndPassword(userData);
  res.status(httpStatus.OK).send({ user });
});

const register = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send({ user });
});

export default {
  login,
  register
};
