import type { Collection, Document } from 'mongodb';
import { z } from 'zod';
import type { PetDoc } from '../models/pet.js';
import { SPECIES } from '../models/pet.js';

const SORT_FIELDS = [
  'name', 'species', 'breed', 'age', 'ownerName', 'recordCount', 'lastVisit', 'nextDue', 'status',
  'insurance',
] as const;

export const dashboardQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  species: z.enum(SPECIES).optional(),
  status: z.enum(['overdue', 'upToDate', 'noRecords']).optional(),
  insurance: z.enum(['active', 'expired', 'none']).optional(),
  sort: z.enum(SORT_FIELDS).default('name'),
  order: z.enum(['asc', 'desc']).default('asc'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(24),
});
export type DashboardQuery = z.output<typeof dashboardQuerySchema>;

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export async function runDashboardQuery(pets: Collection<PetDoc>, q: DashboardQuery) {
  const today = new Date().toISOString().slice(0, 10);

  const petMatch: Document = {};
  if (q.species) petMatch.species = q.species;
  if (q.search) {
    const rx = { $regex: escapeRegex(q.search), $options: 'i' };
    petMatch.$or = [{ name: rx }, { breed: rx }, { ownerName: rx }];
  }

  const sortDir = q.order === 'asc' ? 1 : -1;
  // Status/insurance sort by severity rank; age sorts on dateOfBirth inverted so ascending means
  // youngest first. Missing values sort first ascending in Mongo.
  const sortField =
    q.sort === 'status' ? 'statusRank'
    : q.sort === 'insurance' ? 'insuranceRank'
    : q.sort === 'age' ? 'dateOfBirth'
    : q.sort;
  const dir = q.sort === 'age' ? -sortDir : sortDir;

  const pipeline: Document[] = [
    { $match: petMatch },
    {
      $lookup: {
        from: 'medicalRecords',
        localField: '_id',
        foreignField: 'petId',
        pipeline: [{ $project: { date: 1, nextDueDate: 1 } }],
        as: 'recs',
      },
    },
    {
      $addFields: {
        recordCount: { $size: '$recs' },
        lastVisit: { $max: '$recs.date' },
        // Earliest due date across records (may be in the past => overdue).
        nextDue: { $min: '$recs.nextDueDate' },
      },
    },
    {
      $addFields: {
        status: {
          $switch: {
            branches: [
              { case: { $eq: ['$recordCount', 0] }, then: 'noRecords' },
              {
                case: { $and: [{ $ne: ['$nextDue', null] }, { $lt: ['$nextDue', today] }] },
                then: 'overdue',
              },
            ],
            default: 'upToDate',
          },
        },
      },
    },
    {
      $addFields: {
        statusRank: { $indexOfArray: [['overdue', 'upToDate', 'noRecords'], '$status'] },
      },
    },
    {
      $lookup: {
        from: 'insurance',
        localField: '_id',
        foreignField: 'petId',
        pipeline: [{ $project: { effectiveDate: 1, expirationDate: 1 } }],
        as: 'policies',
      },
    },
    {
      $addFields: {
        activePolicies: {
          $filter: {
            input: '$policies',
            cond: { $and: [{ $lte: ['$$this.effectiveDate', today] }, { $gte: ['$$this.expirationDate', today] }] },
          },
        },
      },
    },
    {
      $addFields: {
        insuranceExpires: { $max: '$activePolicies.expirationDate' },
        insuranceStatus: {
          $switch: {
            branches: [
              { case: { $gt: [{ $size: '$activePolicies' }, 0] }, then: 'active' },
              {
                case: { $gt: [{ $size: { $filter: { input: '$policies', cond: { $lt: ['$$this.expirationDate', today] } } } }, 0] },
                then: 'expired',
              },
            ],
            default: 'none',
          },
        },
      },
    },
    {
      $addFields: {
        insuranceRank: { $indexOfArray: [['active', 'expired', 'none'], '$insuranceStatus'] },
      },
    },
    { $project: { recs: 0, policies: 0, activePolicies: 0 } },
  ];
  if (q.status) pipeline.push({ $match: { status: q.status } });
  if (q.insurance) pipeline.push({ $match: { insuranceStatus: q.insurance } });
  pipeline.push(
    { $sort: sortField === 'name' ? { name: dir, _id: 1 } : { [sortField]: dir, name: 1, _id: 1 } },
    {
      $facet: {
        items: [{ $skip: (q.page - 1) * q.limit }, { $limit: q.limit }],
        total: [{ $count: 'n' }],
      },
    },
  );

  const [out] = await pets.aggregate(pipeline).toArray();
  return {
    items: out.items.map(({ _id, statusRank: _s, insuranceRank: _i, ...item }: Document) => ({
      id: String(_id),
      ...item,
    })),
    total: out.total[0]?.n ?? 0,
    page: q.page,
    limit: q.limit,
  };
}
