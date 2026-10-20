import { Collection, Db, MongoClient } from 'mongodb';
import type { PetDoc } from '../models/pet.js';
import type { InsuranceDoc } from '../models/insurance.js';
import type { RecordDoc } from '../models/record.js';

export interface Database {
  client: MongoClient;
  db: Db;
  pets: Collection<PetDoc>;
  records: Collection<RecordDoc>;
  insurance: Collection<InsuranceDoc>;
}

export async function connect(url: string, dbName: string): Promise<Database> {
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db(dbName);
  const pets = db.collection<PetDoc>('pets');
  const records = db.collection<RecordDoc>('medicalRecords');
  const insurance = db.collection<InsuranceDoc>('insurance');
  await Promise.all([
    pets.createIndex({ name: 1 }),
    records.createIndex({ petId: 1, date: -1 }),
    insurance.createIndex({ petId: 1, expirationDate: -1 }),
  ]);
  return { client, db, pets, records, insurance };
}
