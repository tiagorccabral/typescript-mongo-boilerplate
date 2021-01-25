import express from 'express';
import { router as healthChecksRouter } from '../../modules/healthChecks/routes';
import { router as authController } from '../../modules/auth/routes';

export const router: express.Router = express.Router();

router.use('/v1', [
  healthChecksRouter,
  authController
]);
