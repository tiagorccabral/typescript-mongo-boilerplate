import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../helpers/catchAsync';
import config from '../../../config/config';

const getHealth = catchAsync(async (req: Request, res: Response) => {
  res.status(httpStatus.OK).send({
    message: 'System up and running',
    name: config.system.name,
    dateTime: (new Date()).toISOString(),
    timestamp: (new Date()).valueOf()
  });
});

export default {
  getHealth
};
