import { Router } from 'express';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { storeRefreshToken, revokeRefreshToken, isRefreshTokenActive } from '../lib/redis.js';
import { prisma } from '../lib/prisma.js';

const router = Router();

// In-memory demo user store (MVP stub)
// Seed admin if not exists (MVP convenience)
(async () => {
  try {
    const admin = await prisma.user.findUnique({ where: { email: 'admin@example.com' } })
    if (!admin) {
      const hash = await argon2.hash('password')
      await prisma.user.create({ data: { email: 'admin@example.com', passwordHash: hash, role: 'admin' } })
    }
  } catch {}
})();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin','teacher','parent','student'])
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await argon2.verify(user.passwordHash, password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_ACCESS_SECRET as string, { expiresIn: '15m' });
  const jti = randomUUID();
  const refreshToken = jwt.sign({ id: user.id, role: user.role, jti }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' });
  await storeRefreshToken(jti, user.id);
  return res.json({ accessToken, refreshToken });
});

router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });
  const { email, password, role } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: 'Email already exists' });
  const passwordHash = await argon2.hash(password);
  const user = await prisma.user.create({ data: { email, passwordHash, role } });
  return res.status(201).json({ id: user.id, email: user.email, role: user.role });
});

router.post('/refresh', async (req, res) => {
  const token = req.body?.token;
  if (!token) return res.status(400).json({ error: 'Missing token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as any;
    const active = await isRefreshTokenActive(decoded.jti);
    if (!active) return res.status(401).json({ error: 'Revoked token' });
    const accessToken = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.JWT_ACCESS_SECRET as string, { expiresIn: '15m' });
    return res.json({ accessToken });
  } catch {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
});

router.post('/logout', async (req, res) => {
  const token = req.body?.token;
  if (!token) return res.status(400).json({ error: 'Missing token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as any;
    await revokeRefreshToken(decoded.jti);
    return res.json({ ok: true });
  } catch {
    return res.status(400).json({ error: 'Invalid token' });
  }
});

export default router;


