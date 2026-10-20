import { z } from 'zod';

export const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');

export const SPECIES = ['dog', 'cat', 'bird', 'rabbit', 'reptile', 'other'] as const;
export const SEXES = ['male', 'female', 'unknown'] as const;

export const petInputSchema = z.object({
  name: z.string().trim().min(1).max(100),
  species: z.enum(SPECIES),
  breed: z.string().trim().max(100).default(''),
  dateOfBirth: isoDate.nullable().default(null),
  sex: z.enum(SEXES).default('unknown'),
  weightKg: z.number().positive().max(1000).nullable().default(null),
  ownerName: z.string().trim().min(1).max(100),
  notes: z.string().trim().max(2000).default(''),
});

export type PetInput = z.infer<typeof petInputSchema>;

export interface PetDoc extends PetInput {
  createdAt: Date;
  updatedAt: Date;
}
