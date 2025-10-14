import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export type UserJwt = { id: string; role: 'admin'|'teacher'|'parent'|'student' };

export function requireAuth(req: Request & { user?: UserJwt }, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing Authorization' });
  const token = auth.replace('Bearer ', '');
  if (token === 'demo' && process.env.DEMO_MODE === 'true') {
    // allow demo token for quick frontend testing
    req.user = { id: '3', role: 'parent' };
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as UserJwt;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireRole(roles: UserJwt['role'][]) {
  return (req: Request & { user?: UserJwt }, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthenticated' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}


