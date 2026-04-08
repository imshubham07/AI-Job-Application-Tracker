"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const openaiService_1 = require("../services/openaiService");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.post('/parse', async (req, res) => {
    try {
        const { jd } = req.body;
        if (!jd || !jd.trim()) {
            res.status(400).json({ message: 'Job description is required' });
            return;
        }
        const parsed = await (0, openaiService_1.parseJobDescription)(jd);
        res.json(parsed);
    }
    catch {
        res.status(500).json({ message: 'Failed to parse job description' });
    }
});
router.post('/suggestions', async (req, res) => {
    try {
        const { role, requiredSkills } = req.body;
        const suggestions = await (0, openaiService_1.generateResumeSuggestions)(role ?? '', requiredSkills ?? []);
        res.json({ suggestions });
    }
    catch {
        res.status(500).json({ message: 'Failed to generate suggestions' });
    }
});
exports.default = router;
