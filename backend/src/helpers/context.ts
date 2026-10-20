import DataLoader from 'dataloader';
import { ObjectId } from 'mongodb';
import type { Database } from './mongoClient.js';
import type { InsuranceModel, RecordModel } from '../models/db/index.js';

export interface GraphQLContext {
  db: Database;
  loaders: {
    recordsByPet: DataLoader<string, RecordModel[]>;
    insuranceByPet: DataLoader<string, InsuranceModel[]>;
  };
}

// Batches child lookups for a list of pets into one query and groups them by petId.
function byPetLoader<T extends { petId: ObjectId }>(load: (ids: ObjectId[]) => Promise<T[]>) {
  return new DataLoader<string, T[]>(async (keys) => {
    const docs = await load(keys.map((k) => new ObjectId(k)));
    const groups = new Map<string, T[]>(keys.map((k) => [k, []]));
    for (const d of docs) groups.get(d.petId.toHexString())?.push(d);
    return keys.map((k) => groups.get(k)!);
  });
}

// One context (and so one set of loaders/caches) per request.
export function createContext(db: Database): GraphQLContext {
  return {
    db,
    loaders: {
      recordsByPet: byPetLoader((ids) =>
        db.records.find({ petId: { $in: ids } }).sort({ date: -1, createdAt: -1 }).toArray()),
      insuranceByPet: byPetLoader((ids) =>
        db.insurance.find({ petId: { $in: ids } }).sort({ expirationDate: -1, createdAt: -1 }).toArray()),
    },
  };
}
