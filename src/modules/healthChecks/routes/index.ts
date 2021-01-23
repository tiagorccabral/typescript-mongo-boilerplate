import express from 'express';
import healthChecksController from '../controllers/healthChecksController';

export const router: express.Router = express.Router();

router.route('/health')
  .get(healthChecksController.getHealth);
