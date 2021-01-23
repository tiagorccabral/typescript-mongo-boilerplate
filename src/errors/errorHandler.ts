import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../config/config';
import logger from '../config/logger';
import ApplicationError from '../errors/apiError';

const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;
  if (!(error instanceof ApplicationError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApplicationError(statusCode, message, err.stack);
  }
  next(error);
};

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.logs.sendErrorStackTrace && { stack: err.stack })
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

export = {
  errorConverter,
  errorHandler
};
