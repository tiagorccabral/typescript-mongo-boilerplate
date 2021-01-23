import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../utils/catchAsync';

const getHealth = catchAsync(async (req: Request, res: Response) => {
  res.status(httpStatus.OK).send({
    message: 'System up and running',
    dateTime: (new Date()).toISOString(),
    timestamp: (new Date()).valueOf()
  });
});

export default {
  getHealth
};
