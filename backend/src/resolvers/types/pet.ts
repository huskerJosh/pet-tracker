import type { PetResolvers } from '../../models/generated.types.js';

export const Pet: PetResolvers = {
  id: (pet) => pet._id.toHexString(),
  records: async (pet, { type }, { loaders }) => {
    const all = await loaders.recordsByPet.load(pet._id.toHexString());
    return type ? all.filter((r) => r.type === type) : all;
  },
  insurance: (pet, _, { loaders }) => loaders.insuranceByPet.load(pet._id.toHexString()),
};
