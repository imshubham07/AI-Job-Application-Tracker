"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = require("mongoose");
const Application_1 = require("../models/Application");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.get('/', async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const applications = await Application_1.Application.find({ userId: req.userId }).sort({ dateApplied: -1 });
        res.json(applications);
    }
    catch {
        res.status(500).json({ message: 'Failed to fetch applications' });
    }
});
router.post('/', async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { company, role, jdLink, notes, dateApplied, status, salaryRange, requiredSkills, niceToHaveSkills, seniority, location, resumeSuggestions, } = req.body;
        if (!company || !role) {
            res.status(400).json({ message: 'Company and role are required' });
            return;
        }
        const validStatus = Application_1.APPLICATION_STATUSES.includes(status)
            ? status
            : 'Applied';
        const created = await Application_1.Application.create({
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
    }
    catch {
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
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid application id' });
            return;
        }
        const update = req.body;
        if (typeof update.status === 'string' && !Application_1.APPLICATION_STATUSES.includes(update.status)) {
            res.status(400).json({ message: 'Invalid status value' });
            return;
        }
        const updated = await Application_1.Application.findOneAndUpdate({ _id: id, userId: req.userId }, update, { new: true, runValidators: true });
        if (!updated) {
            res.status(404).json({ message: 'Application not found' });
            return;
        }
        res.json(updated);
    }
    catch {
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
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid application id' });
            return;
        }
        const deleted = await Application_1.Application.findOneAndDelete({ _id: id, userId: req.userId });
        if (!deleted) {
            res.status(404).json({ message: 'Application not found' });
            return;
        }
        res.status(204).send();
    }
    catch {
        res.status(500).json({ message: 'Failed to delete application' });
    }
});
exports.default = router;
