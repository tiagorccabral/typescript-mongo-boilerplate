import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import passport from 'passport';
import bodyParser from 'body-parser';
import { router } from './routes/v1';
import { jwtStrategy } from './config/passport';

const app = express();

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// adds helmet HTTP protection
app.use(helmet());

// Sets CORS and Accepted Origins
app.use(cors());
app.options('*', cors());

// Initialize JWT options and strategy using Passport
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.use(router);

export default app;
