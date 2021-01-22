import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

console.log(process.env);

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT
};

export default config;
