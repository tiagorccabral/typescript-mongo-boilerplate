import { Request, Response } from 'express';
import { catchAsync } from '../../../helpers/catchAsync';
import User from '../models/user';

const createUser = catchAsync(async (req: Request, res: Response) => {
});

export default {
  createUser
};
