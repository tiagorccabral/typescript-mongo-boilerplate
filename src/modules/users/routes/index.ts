import express from 'express';
import usersController from '../controllers/usersController';

export const router: express.Router = express.Router();

router.route('/create')
  .post(usersController.createUser);
