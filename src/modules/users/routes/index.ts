import express from 'express';
import validate from '../../../middlewares/validate';
import verifyAuthorization from '../../../middlewares/verifyAuthorization';
import requireCurrentUser from '../../../middlewares/requireCurrentUser';
import usersController from '../controllers/usersController';
import * as validations from './validations';

export const router: express.Router = express.Router();

router.route('/:id')
  .get(verifyAuthorization(), validate(validations.getUser), usersController.getUser)
  .patch(requireCurrentUser(), validate(validations.updateUser), usersController.updateUser);

router.route('/')
  .post(validate(validations.createUser), usersController.createUser);

router.route('/create-admin')
  .post(verifyAuthorization(['admin']), validate(validations.createUser), usersController.createAdminUser);
