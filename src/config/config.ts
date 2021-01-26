import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';
import { IConfig } from './Iconfig.interface';

dotenv.config({ path: path.join(__dirname, '../../env/mongo.env') });
dotenv.config({ path: path.join(__dirname, '../../env/node.env') });

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
  PORT: Joi.number().default(3000).required(),
  MONGODB_URL: Joi.string().required(),
  MONGODB_USERNAME: Joi.string().required(),
  MONGODB_PASSWORD: Joi.string().required(),
  MONGODB_DATABASE_NAME: Joi.string().required(),
  IS_MONGO_CLOUD_PROVIDED: Joi.boolean().required(),
  LOG_ERROR_TRACE_TO_STACK: Joi.bool().required()
}).unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config: IConfig = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  database: {
    isMongoCloudProvided: envVars.IS_MONGO_CLOUD_PROVIDED,
    mongodbUsername: envVars.MONGODB_USERNAME,
    mongodbPassword: envVars.MONGODB_PASSWORD,
    mongodbDatabaseName: envVars.MONGODB_DATABASE_NAME,
    mongodbUrl: envVars.MONGODB_URL
  },
  system: {
    name: 'node-typescript-service'
  },
  logs: {
    sendErrorStackTrace: envVars.LOG_ERROR_TRACE_TO_STACK
  }
};

export default config;
