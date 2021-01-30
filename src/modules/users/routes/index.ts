import express from 'express';
import validate from '../../../middlewares/validate';
import usersController from '../controllers/usersController';
import * as validations from './validations';

export const router: express.Router = express.Router();

router.route('/')
  .post(validate(validations.createUser), usersController.createUser);
