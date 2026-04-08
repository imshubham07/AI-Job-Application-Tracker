import { Router } from 'express';
import { Types } from 'mongoose';
import { APPLICATION_STATUSES, Application } from '../models/Application';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const applications = await Application.find({ userId: req.userId }).sort({ dateApplied: -1 });
    res.json(applications);
  } catch {
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
});

router.post('/', async (req, res) => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const {
      company,
      role,
      jdLink,
      notes,
      dateApplied,
      status,
      salaryRange,
      requiredSkills,
      niceToHaveSkills,
      seniority,
      location,
      resumeSuggestions,
    } = req.body as {
      company?: string;
      role?: string;
      jdLink?: string;
      notes?: string;
      dateApplied?: string;
      status?: string;
      salaryRange?: string;
      requiredSkills?: string[];
      niceToHaveSkills?: string[];
      seniority?: string;
      location?: string;
      resumeSuggestions?: string[];
    };

    if (!company || !role) {
      res.status(400).json({ message: 'Company and role are required' });
      return;
    }

    const validStatus = APPLICATION_STATUSES.includes(status as (typeof APPLICATION_STATUSES)[number])
      ? status
      : 'Applied';

    const created = await Application.create({
      company,
      role,
      jdLink: jdLink ?? '',
      notes: notes ?? '',
      dateApplied: dateApplied ? new Date(dateApplied) : new Date(),
      status: validStatus,
      salaryRange: salaryRange ?? '',
      requiredSkills: requiredSkills ?? [],
      niceToHaveSkills: niceToHaveSkills ?? [],
      seniority: seniority ?? '',
      location: location ?? '',
      resumeSuggestions: resumeSuggestions ?? [],
      userId: req.userId,
    });

    res.status(201).json(created);
  } catch {
    res.status(500).json({ message: 'Failed to create application' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid application id' });
      return;
    }

    const update = req.body as Record<string, unknown>;

    if (typeof update.status === 'string' && !APPLICATION_STATUSES.includes(update.status as (typeof APPLICATION_STATUSES)[number])) {
      res.status(400).json({ message: 'Invalid status value' });
      return;
    }

    const updated = await Application.findOneAndUpdate(
      { _id: id, userId: req.userId },
      update,
      { new: true, runValidators: true },
    );

    if (!updated) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Failed to update application' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid application id' });
      return;
    }

    const deleted = await Application.findOneAndDelete({ _id: id, userId: req.userId });

    if (!deleted) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    res.status(204).send();
  } catch {
    res.status(500).json({ message: 'Failed to delete application' });
  }
});

export default router;
