import type { QueryResolvers } from '../models/generated.types.js';
import { dashboardQuerySchema, runDashboardQuery } from '../services/DashboardQueryService.js';
import { notFound, parseId, validate } from '../helpers/errors.js';

export const Query: QueryResolvers = {
  pet: async (_, { id }, { db }) => {
    const pet = await db.pets.findOne({ _id: parseId(id) });
    if (!pet) throw notFound('Pet');
    return pet;
  },
  pets: (_, __, { db }) => db.pets.find().sort({ name: 1 }).toArray(),

  dashboardPets: async (_, { filter, sort, order, page, limit }, { db }) => {
    const q = validate(dashboardQuerySchema, { ...filter, sort, order, page, limit });
    return runDashboardQuery(db.pets, q);
  },

  medicalRecord: async (_, { id }, { db }) => {
    const rec = await db.records.findOne({ _id: parseId(id) });
    if (!rec) throw notFound('Record');
    return rec;
  },

  insurancePolicy: async (_, { id }, { db }) => {
    const doc = await db.insurance.findOne({ _id: parseId(id) });
    if (!doc) throw notFound('Insurance policy');
    return doc;
  },
};
