import express from 'express';
import authController from '../controllers/authController';
import validate from '../../../middlewares/validate';
import * as validations from './validations';
import * as usersValidations from '../../users/routes/validations';

export const router: express.Router = express.Router();

router.route('/login')
  .post(validate(validations.loginUser), authController.login);

router.route('/register')
  .post(validate(usersValidations.createUser), authController.register);
