import { Router } from 'express';
import { requireAuth, requireRole, UserJwt } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.get('/students/:id', requireAuth, (req, res) => {
  (async () => {
    const s = await prisma.student.findUnique({ where: { id: req.params.id } });
    const user = (req as any).user as UserJwt;
    if (!s) return res.status(404).json({ error: 'Not found' });
    if (user.role === 'parent' && s.parentId !== user.id) return res.status(403).json({ error: 'Forbidden' });
    return res.json({ id: s.id, first_name: s.firstName, last_name: s.lastName, parent_id: s.parentId });
  })().catch(() => res.status(500).json({ error: 'Server error' }));
});

router.post('/students', requireAuth, requireRole(['admin', 'teacher']), (req, res) => {
  (async () => {
    const created = await prisma.student.create({ data: {
      studentCode: req.body.student_code || `S${Date.now()}`,
      firstName: req.body.first_name,
      lastName: req.body.last_name,
      parentId: req.body.parent_id || null,
      className: req.body.class || null,
      gradeLevel: req.body.grade_level || null,
      photoUrl: req.body.photo_url || null,
    }});
    return res.status(201).json({ id: created.id });
  })().catch(() => res.status(500).json({ error: 'Server error' }));
});

export default router;


