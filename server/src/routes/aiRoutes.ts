import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { generateResumeSuggestions, parseJobDescription } from '../services/openaiService';

const router = Router();

router.use(authMiddleware);

router.post('/parse', async (req, res) => {
  try {
    const { jd } = req.body as { jd?: string };

    if (!jd || !jd.trim()) {
      res.status(400).json({ message: 'Job description is required' });
      return;
    }

    const parsed = await parseJobDescription(jd);
    res.json(parsed);
  } catch {
    res.status(500).json({ message: 'Failed to parse job description' });
  }
});

router.post('/suggestions', async (req, res) => {
  try {
    const { role, requiredSkills } = req.body as { role?: string; requiredSkills?: string[] };

    const suggestions = await generateResumeSuggestions(role ?? '', requiredSkills ?? []);
    res.json({ suggestions });
  } catch {
    res.status(500).json({ message: 'Failed to generate suggestions' });
  }
});

export default router;
