import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/students/:id/ai-profile', requireAuth, async (req, res) => {
  // Stub: return a fake profile
  return res.json({
    student_id: req.params.id,
    summary: 'Student shows strong STEM potential.',
    recommended_tracks: ['Engineering', 'Computer Science', 'Mathematics'],
    confidence_scores: { Engineering: 0.82, 'Computer Science': 0.78, Mathematics: 0.74 },
    explanation_text: 'High math/science scores; robotics club involvement.',
  });
});

router.post('/students/:id/ai-run', requireAuth, async (req, res) => {
  try {
    const resp = await fetch(`${process.env.ML_BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: req.params.id, features: req.body || {} })
    });
    const data = await resp.json();
    return res.json({ status: 'completed', result: data });
  } catch (e) {
    return res.status(500).json({ error: 'ML service error' });
  }
});

export default router;


