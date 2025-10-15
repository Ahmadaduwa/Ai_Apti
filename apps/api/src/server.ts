// src/server.ts (หรือ src/server.js หากใช้ JavaScript ให้เปลี่ยนนามสกุล)
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRouter from './routes/auth.js';
import studentsRouter from './routes/students.js';
import aiRouter from './routes/ai.js';

// โหลด env (path ตามโครงสร้างโปรเจกต์ของคุณ)
dotenv.config({ path: '../../infra/.env' });

// สร้าง Prisma client
const prisma = new PrismaClient();

// สร้างแอป
const app = express();
app.use(express.json());
app.use(helmet());
app.disable('x-powered-by');
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'], credentials: true }));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 });
app.use('/api/auth', authLimiter);

app.get('/health', (_req, res) => res.sendStatus(200));
app.use('/api/auth', authRouter);
app.use('/api', studentsRouter);
app.use('/api', aiRouter);

const port = Number(process.env.PORT || 3001);

/**
 * Retry connect to Prisma / database with exponential backoff (simple).
 * - retries: จำนวนครั้งสูงสุด
 * - initialDelayMs: เวลาเริ่มต้นเป็น milliseconds
 */
async function connectWithRetry(retries = 20, initialDelayMs = 1000) {
  let attempt = 0;
  let delay = initialDelayMs;

  while (attempt < retries) {
    try {
      attempt++;
      console.log(`[db] Attempt ${attempt} to connect to database...`);
      await prisma.$connect();
      console.log('[db] Prisma connected successfully');
      return;
    } catch (err: any) {
      console.warn(`[db] Prisma connect failed (attempt ${attempt}/${retries}): ${err?.message || err}`);
      if (attempt >= retries) break;
      // รอ (exponential backoff)
      await new Promise((res) => setTimeout(res, delay));
      delay = Math.min(30000, delay * 1.5); // ขยาย delay แต่จำกัดไม่เกิน 30s
    }
  }

  throw new Error('Could not connect to database after retries');
}

let server: ReturnType<typeof app.listen> | null = null;

// ฟังก์ชันเริ่มแอป (รอ DB ให้พร้อมก่อน)
async function startServer() {
  try {
    await connectWithRetry(
      Number(process.env.DB_CONNECT_RETRIES) || 20,
      Number(process.env.DB_CONNECT_INITIAL_DELAY_MS) || 1000
    );

    server = app.listen(port, () => {
      console.log(`API listening on :${port}`);
    });

    // จัดการ signal ให้ปลด connection Prisma เมื่อ process ถูกปิด
    const gracefulShutdown = async (signal: string) => {
      console.log(`[shutdown] Received ${signal}. Closing server...`);
      try {
        if (server) {
          server.close(() => console.log('[shutdown] HTTP server closed'));
        }
        await prisma.$disconnect();
        console.log('[shutdown] Prisma disconnected');
        process.exit(0);
      } catch (err) {
        console.error('[shutdown] Error during shutdown', err);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  } catch (err) {
    console.error('Failed to start application:', err);
    try {
      await prisma.$disconnect();
    } catch (_) {}
    process.exit(1);
  }
}

// เริ่ม
startServer();
