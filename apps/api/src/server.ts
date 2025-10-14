import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import studentsRouter from './routes/students.js';
import aiRouter from './routes/ai.js';

dotenv.config({ path: '../../infra/.env' });

const app = express();
app.use(express.json());
app.use(helmet());
app.disable('x-powered-by');
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'], credentials: true }));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 });
app.use('/api/auth', authLimiter);

app.get('/healthz', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRouter);
app.use('/api', studentsRouter);
app.use('/api', aiRouter);

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  console.log(`API listening on :${port}`);
});


