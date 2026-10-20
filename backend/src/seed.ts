import type { Database } from './helpers/mongoClient.js';

const day = (offset: number) => new Date(Date.now() + offset * 86_400_000).toISOString().slice(0, 10);

export async function seed({ pets, records, insurance }: Database) {
  if (await pets.countDocuments({}, { limit: 1 })) return;
  const now = new Date();
  const base = { createdAt: now, updatedAt: now };
  const mk = (name: string, species: any, breed: string, ownerName: string, age: number, sex: any, weightKg: number) => ({
    name, species, breed, ownerName, sex, weightKg, notes: '',
    dateOfBirth: day(-365 * age), ...base,
  });
  const docs = [
    mk('Biscuit', 'dog', 'Golden Retriever', 'Alex Kim', 4, 'male', 31),
    mk('Luna', 'cat', 'Siamese', 'Priya Patel', 2, 'female', 4.2),
    mk('Mochi', 'rabbit', 'Holland Lop', 'Sam Rivera', 1, 'female', 1.6),
    mk('Rex', 'dog', 'German Shepherd', 'Jordan Lee', 7, 'male', 38),
    mk('Kiwi', 'bird', 'Cockatiel', 'Alex Kim', 3, 'unknown', 0.09),
    mk('Pebble', 'reptile', 'Leopard Gecko', 'Casey Moore', 5, 'unknown', 0.06),
  ];
  const { insertedIds } = await pets.insertMany(docs);
  const id = (i: number) => insertedIds[i];
  const rec = (i: number, type: any, title: string, date: string, nextDueDate: string | null, veterinarian = 'Dr. Okafor') =>
    ({ petId: id(i), type, title, date, nextDueDate, veterinarian, description: '', ...base });
  await records.insertMany([
    rec(0, 'vaccination', 'Rabies booster', day(-300), day(-20)),
    rec(0, 'checkup', 'Annual checkup', day(-30), null),
    rec(1, 'vaccination', 'FVRCP', day(-60), day(305)),
    rec(1, 'checkup', 'Dental cleaning', day(-10), day(170)),
    rec(3, 'surgery', 'Cruciate ligament repair', day(-90), null, 'Dr. Haddad'),
    rec(3, 'medication', 'Carprofen course', day(-85), day(-70)),
    rec(4, 'checkup', 'Wing clip & wellness', day(-120), day(245)),
  ]);
  const policy = (i: number, planName: string, effective: number, expiration: number, first: string, last: string) => ({
    petId: id(i), planName, idNumber: `PL-${1000 + i}-${Math.abs(effective)}`,
    effectiveDate: day(effective), expirationDate: day(expiration),
    subscriber: {
      firstName: first, lastName: last, dateOfBirth: '1988-04-12', phone: '555-010-2000', address: '12 Maple St, Springfield', state: 'IL', zipCode: '62704',
    },
    ...base,
  });
  await insurance.insertMany([
    policy(0, 'Healthy Paws Plus', -200, 165, 'Alex', 'Kim'),
    policy(1, 'PetShield Basic', -400, -35, 'Priya', 'Patel'),
    policy(3, 'Healthy Paws Plus', -100, 265, 'Jordan', 'Lee'),
  ]);
}
