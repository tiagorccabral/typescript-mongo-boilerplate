import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';
import { IConfig } from './Iconfig.interface';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().valid('production', 'development', 'test'),
  PORT: Joi.number().default(3000)
}).unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config: IConfig = {
  env: envVars.NODE_ENV,
  port: envVars.PORT
};

export default config;
