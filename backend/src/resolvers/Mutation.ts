import type { MutationResolvers } from '../models/generated.types.js';
import { insuranceInputSchema } from '../models/insurance.js';
import { petInputSchema } from '../models/pet.js';
import { recordInputSchema } from '../models/record.js';
import { notFound, parseId, validate } from '../helpers/errors.js';

export const Mutation: MutationResolvers = {
  // --- pets ---
  createPet: async (_, { input }, { db }) => {
    const now = new Date();
    const doc = { ...validate(petInputSchema, input), createdAt: now, updatedAt: now };
    const { insertedId } = await db.pets.insertOne(doc);
    return { _id: insertedId, ...doc };
  },
  updatePet: async (_, { id, input }, { db }) => {
    const data = validate(petInputSchema, input);
    const updated = await db.pets.findOneAndUpdate(
      { _id: parseId(id) },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: 'after' },
    );
    if (!updated) throw notFound('Pet');
    return updated;
  },
  deletePet: async (_, { id }, { db }) => {
    const _id = parseId(id);
    const { deletedCount } = await db.pets.deleteOne({ _id });
    if (!deletedCount) throw notFound('Pet');
    await Promise.all([db.records.deleteMany({ petId: _id }), db.insurance.deleteMany({ petId: _id })]);
    return true;
  },

  // --- medical records ---
  createMedicalRecord: async (_, { petId, input }, { db }) => {
    const _petId = parseId(petId);
    if (!(await db.pets.countDocuments({ _id: _petId }, { limit: 1 }))) throw notFound('Pet');
    const now = new Date();
    const doc = { ...validate(recordInputSchema, input), petId: _petId, createdAt: now, updatedAt: now };
    const { insertedId } = await db.records.insertOne(doc);
    return { _id: insertedId, ...doc };
  },
  updateMedicalRecord: async (_, { id, input }, { db }) => {
    const data = validate(recordInputSchema, input);
    const updated = await db.records.findOneAndUpdate(
      { _id: parseId(id) },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: 'after' },
    );
    if (!updated) throw notFound('Record');
    return updated;
  },
  deleteMedicalRecord: async (_, { id }, { db }) => {
    const { deletedCount } = await db.records.deleteOne({ _id: parseId(id) });
    if (!deletedCount) throw notFound('Record');
    return true;
  },

  // --- insurance ---
  createInsurancePolicy: async (_, { petId, input }, { db }) => {
    const _petId = parseId(petId);
    if (!(await db.pets.countDocuments({ _id: _petId }, { limit: 1 }))) throw notFound('Pet');
    const now = new Date();
    const doc = { ...validate(insuranceInputSchema, input), petId: _petId, createdAt: now, updatedAt: now };
    const { insertedId } = await db.insurance.insertOne(doc);
    return { _id: insertedId, ...doc };
  },
  updateInsurancePolicy: async (_, { id, input }, { db }) => {
    const data = validate(insuranceInputSchema, input);
    const updated = await db.insurance.findOneAndUpdate(
      { _id: parseId(id) },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: 'after' },
    );
    if (!updated) throw notFound('Insurance policy');
    return updated;
  },
  deleteInsurancePolicy: async (_, { id }, { db }) => {
    const { deletedCount } = await db.insurance.deleteOne({ _id: parseId(id) });
    if (!deletedCount) throw notFound('Insurance policy');
    return true;
  },
};
