import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../helpers/catchAsync';
import * as usersService from '../services/users.service';

const getUser = catchAsync(async (req: Request, res: Response) => {
  const { params } = req;
  const user = await usersService.getUser(params.id);
  res.status(httpStatus.OK).send({ user });
});

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await usersService.createUser(req.body);
  res.status(httpStatus.CREATED).send({ user });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { params } = req;
  const user = await usersService.updateUser(params.id, req.body);
  res.status(httpStatus.OK).send({ user });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { params } = req;
  const response = await usersService.deleteUser(params.id);
  res.status(httpStatus.NO_CONTENT).send({ response });
});

const createAdminUser = catchAsync(async (req: Request, res: Response) => {
  const user = await usersService.createAdminUser(req.body);
  res.status(httpStatus.CREATED).send({ user });
});

export default {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  createAdminUser
};
