import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import pick from '../helpers/pick';
import ApiError from '../errors/apiError';

const validate = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' } })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map(details => details.message).join(', ');
    return next(new ApiError(errorMessage, httpStatus.BAD_REQUEST));
  }
  Object.assign(req, value);
  return next();
};

export default validate;
