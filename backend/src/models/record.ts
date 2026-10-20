import { z } from 'zod';
import { isoDate } from './pet.js';

export const RECORD_TYPES = [
  'vaccination',
  'checkup',
  'surgery',
  'medication',
  'allergy',
  'other',
] as const;

export const recordInputSchema = z.object({
  type: z.enum(RECORD_TYPES),
  title: z.string().trim().min(1).max(200),
  date: isoDate,
  veterinarian: z.string().trim().max(100).default(''),
  description: z.string().trim().max(5000).default(''),
  nextDueDate: isoDate.nullable().default(null),
});

export type RecordInput = z.infer<typeof recordInputSchema>;

export interface RecordDoc extends RecordInput {
  petId: import('mongodb').ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
