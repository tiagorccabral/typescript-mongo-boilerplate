import { Request, Response } from 'express';
import { catchAsync } from '../../../helpers/catchAsync';

const login = catchAsync(async (req: Request, res: Response) => {
});

const register = catchAsync(async (req: Request, res: Response) => {
});

export default {
  login,
  register
};
