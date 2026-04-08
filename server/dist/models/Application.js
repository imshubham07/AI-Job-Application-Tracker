"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = exports.APPLICATION_STATUSES = void 0;
const mongoose_1 = require("mongoose");
exports.APPLICATION_STATUSES = [
    'Applied',
    'Phone Screen',
    'Interview',
    'Offer',
    'Rejected',
];
const applicationSchema = new mongoose_1.Schema({
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    jdLink: { type: String, default: '' },
    notes: { type: String, default: '' },
    dateApplied: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: exports.APPLICATION_STATUSES,
        default: 'Applied',
    },
    salaryRange: { type: String, default: '' },
    requiredSkills: { type: [String], default: [] },
    niceToHaveSkills: { type: [String], default: [] },
    seniority: { type: String, default: '' },
    location: { type: String, default: '' },
    resumeSuggestions: { type: [String], default: [] },
    userId: { type: mongoose_1.Types.ObjectId, ref: 'User', required: true, index: true },
}, {
    timestamps: true,
});
exports.Application = (0, mongoose_1.model)('Application', applicationSchema);
