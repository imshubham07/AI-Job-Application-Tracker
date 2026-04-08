import { Schema, Types, model, type InferSchemaType } from 'mongoose';

export const APPLICATION_STATUSES = [
  'Applied',
  'Phone Screen',
  'Interview',
  'Offer',
  'Rejected',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

const applicationSchema = new Schema(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    jdLink: { type: String, default: '' },
    notes: { type: String, default: '' },
    dateApplied: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: 'Applied',
    },
    salaryRange: { type: String, default: '' },
    requiredSkills: { type: [String], default: [] },
    niceToHaveSkills: { type: [String], default: [] },
    seniority: { type: String, default: '' },
    location: { type: String, default: '' },
    resumeSuggestions: { type: [String], default: [] },
    userId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
  },
  {
    timestamps: true,
  },
);

export type ApplicationDocument = InferSchemaType<typeof applicationSchema>;

export const Application = model<ApplicationDocument>('Application', applicationSchema);
