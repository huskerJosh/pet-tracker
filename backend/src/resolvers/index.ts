import type { Resolvers } from '../models/generated.types.js';
import { InsurancePolicy } from './types/insurance.js';
import { MedicalRecord } from './types/record.js';
import { Mutation } from './Mutation.js';
import { Pet } from './types/pet.js';
import { Query } from './Query.js';
import { ISODate } from './types/scalars.js';

export const resolvers: Resolvers = { ISODate, Query, Mutation, Pet, MedicalRecord, InsurancePolicy };
