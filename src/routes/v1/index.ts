import express from 'express';
import { router as healthChecksRouter } from '../../modules/healthChecks/routes';
import { router as authRouter } from '../../modules/auth/routes';
import { router as usersRouter } from '../../modules/users/routes';

export const router: express.Router = express.Router();

router.use('/v1', [
  router.use('/health', healthChecksRouter),
  router.use('/auth', authRouter),
  router.use('/users', usersRouter)
]);
