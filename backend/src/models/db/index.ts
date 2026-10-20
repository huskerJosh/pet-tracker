import type { WithId } from 'mongodb';
import type { InsuranceDoc } from '../insurance.js';
import type { PetDoc } from '../pet.js';
import type { RecordDoc } from '../record.js';

// Mongo documents as returned by the driver; mapped to GraphQL types by codegen mappers.
export type PetModel = WithId<PetDoc>;
export type RecordModel = WithId<RecordDoc>;
export type InsuranceModel = WithId<InsuranceDoc>;
