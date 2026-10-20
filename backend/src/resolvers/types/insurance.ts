import type { InsurancePolicyResolvers } from '../../models/generated.types.js';
import { notFound } from '../../helpers/errors.js';

export const InsurancePolicy: InsurancePolicyResolvers = {
  id: (p) => p._id.toHexString(),
  petId: (p) => p.petId.toHexString(),
  pet: async (p, _, { db }) => {
    const pet = await db.pets.findOne({ _id: p.petId });
    if (!pet) throw notFound('Pet');
    return pet;
  },
};
