import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';
import { IConfig } from './Iconfig.interface';

dotenv.config({ path: path.join(__dirname, '../../env/mongo.env') });
dotenv.config({ path: path.join(__dirname, '../../env/node.env') });

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
  PORT: Joi.number().default(3000).required(),
  JWT_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().required(),
  MONGODB_DEVELOPMENT_URL: Joi.string().required(),
  MONGODB_DEVELOPMENT_USERNAME: Joi.string().required(),
  MONGODB_DEVELOPMENT_PASSWORD: Joi.string().required(),
  MONGODB_DEVELOPMENT_DATABASE_NAME: Joi.string().required(),
  MONGODB_TEST_URL: Joi.string().required(),
  MONGODB_TEST_USERNAME: Joi.string().required(),
  MONGODB_TEST_PASSWORD: Joi.string().required(),
  MONGODB_TEST_DATABASE_NAME: Joi.string().required(),
  MONGODB_PROD_URL: Joi.string().required(),
  MONGODB_PROD_USERNAME: Joi.string().required(),
  MONGODB_PROD_PASSWORD: Joi.string().required(),
  MONGODB_PROD_DATABASE_NAME: Joi.string().required(),
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
  jwt: {
    secret: envVars.JWT_SECRET,
    expDate: envVars.JWT_ACCESS_EXPIRATION_MINUTES
  },
  database: {
    isMongoCloudProvided: envVars.IS_MONGO_CLOUD_PROVIDED,
    development: {
      mongodbUsername: envVars.MONGODB_DEVELOPMENT_USERNAME,
      mongodbPassword: envVars.MONGODB_DEVELOPMENT_PASSWORD,
      mongodbDatabaseName: envVars.MONGODB_DEVELOPMENT_DATABASE_NAME,
      mongodbUrl: envVars.MONGODB_DEVELOPMENT_URL
    },
    test: {
      mongodbUsername: envVars.MONGODB_TEST_USERNAME,
      mongodbPassword: envVars.MONGODB_TEST_PASSWORD,
      mongodbDatabaseName: envVars.MONGODB_TEST_DATABASE_NAME,
      mongodbUrl: envVars.MONGODB_TEST_URL
    },
    production: {
      mongodbUsername: envVars.MONGODB_PROD_USERNAME,
      mongodbPassword: envVars.MONGODB_PROD_PASSWORD,
      mongodbDatabaseName: envVars.MONGODB_PROD_DATABASE_NAME,
      mongodbUrl: envVars.MONGODB_PROD_URL
    }
  },
  system: {
    name: 'node-typescript-service'
  },
  logs: {
    sendErrorStackTrace: envVars.LOG_ERROR_TRACE_TO_STACK
  }
};

export default config;
