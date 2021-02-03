import express from 'express';
import verifyAuthorization from '../../../middlewares/verifyAuthorization';
import validate from '../../../middlewares/validate';
import usersController from '../controllers/usersController';
import * as validations from './validations';

export const router: express.Router = express.Router();

router.route('/')
  .post(validate(validations.createUser), usersController.createUser);

router.route('/:id')
  .get(verifyAuthorization(), validate(validations.getUser), usersController.getUser);
