import express from 'express';
import authController from '../controllers/authController';

export const router: express.Router = express.Router();

router.route('/login')
  .post(authController.login);

router.route('/register')
  .post(authController.register);
