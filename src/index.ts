import app from './app';
import config from './config/config';
import logger from './config/logger';

let server = null;
server = app.listen(config.port, async () => {
  logger.info(`Listening to port ${config.port}`);
});
