import type { MedicalRecordResolvers } from '../../models/generated.types.js';
import { notFound } from '../../helpers/errors.js';

export const MedicalRecord: MedicalRecordResolvers = {
  id: (r) => r._id.toHexString(),
  petId: (r) => r.petId.toHexString(),
  pet: async (r, _, { db }) => {
    const pet = await db.pets.findOne({ _id: r.petId });
    if (!pet) throw notFound('Pet');
    return pet;
  },
};
