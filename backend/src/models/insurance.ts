import { z } from 'zod';
import { isoDate } from './pet.js';

export const subscriberSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  dateOfBirth: isoDate,
  phone: z.string().trim().regex(/^[0-9+()\-.\s]{7,20}$/, 'Invalid phone number'),
  address: z.string().trim().min(1).max(300),
  state: z.string().trim().toUpperCase().regex(/^[A-Z]{2}$/, 'Use a 2-letter state code'),
  zipCode: z.string().trim().regex(/^\d{5}(-\d{4})?$/, 'Use a 5-digit ZIP or ZIP+4'),
});

export const insuranceInputSchema = z
  .object({
    planName: z.string().trim().min(1).max(200),
    idNumber: z.string().trim().min(1).max(100),
    effectiveDate: isoDate,
    expirationDate: isoDate,
    subscriber: subscriberSchema,
  })
  .refine((v) => v.expirationDate >= v.effectiveDate, {
    path: ['expirationDate'],
    message: 'Expiration date must be on or after the effective date',
  });

export type InsuranceInput = z.infer<typeof insuranceInputSchema>;

export interface InsuranceDoc extends InsuranceInput {
  petId: import('mongodb').ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
