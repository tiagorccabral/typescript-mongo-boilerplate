import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

const app = express();

// adds helmet HTTP protection
app.use(helmet());

// Sets CORS and Accepted Origins
app.use(cors());
app.options('*', cors());

export default app;
