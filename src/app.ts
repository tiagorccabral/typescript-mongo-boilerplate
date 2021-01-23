import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { router } from './routes/v1';

const app = express();

// adds helmet HTTP protection
app.use(helmet());

// Sets CORS and Accepted Origins
app.use(cors());
app.options('*', cors());

app.use(router);

export default app;
