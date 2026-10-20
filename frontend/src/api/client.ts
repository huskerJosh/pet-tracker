import { ClientError, GraphQLClient } from 'graphql-request';
import {
  CreatePetDocument, CreatePolicyDocument, CreateRecordDocument, DashboardDocument, DeletePetDocument,
  DeletePolicyDocument, DeleteRecordDocument, GetPetDocument, PetInsuranceDocument, PetRecordsDocument,
  UpdatePetDocument, UpdatePolicyDocument, UpdateRecordDocument,
  type DashboardFilter, type DashboardSort, type SortOrder,
} from './generated';
import type {
  DashboardPage, DashboardQuery, Insurance, InsuranceInput, MedicalRecord, Pet, PetInput, RecordInput,
} from './types';

/** `code` is the GraphQL error code, e.g. NOT_FOUND, BAD_USER_INPUT or VALIDATION_ERROR. */
export class ApiError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

// Resolved lazily so tests can stub global fetch after this module loads.
const client = new GraphQLClient(`${window.location.origin}/api/graphql`, {
  fetch: (...args: Parameters<typeof fetch>) => globalThis.fetch(...args),
});

async function run<T>(request: () => Promise<T>): Promise<T> {
  try {
    return await request();
  } catch (err) {
    if (err instanceof ClientError) {
      const first = err.response.errors?.[0];
      throw new ApiError(String(first?.extensions?.code ?? 'UNKNOWN'), first?.message ?? err.message);
    }
    throw err;
  }
}

export const api = {
  dashboard: async (q: DashboardQuery): Promise<DashboardPage> => {
    const filter: DashboardFilter = {};
    if (q.search) filter.search = q.search;
    if (q.species) filter.species = q.species as DashboardFilter['species'];
    if (q.status) filter.status = q.status as DashboardFilter['status'];
    if (q.insurance) filter.insurance = q.insurance as DashboardFilter['insurance'];
    const data = await run(() =>
      client.request(DashboardDocument, {
        filter,
        sort: q.sort as DashboardSort | undefined,
        order: q.order as SortOrder | undefined,
        page: q.page,
      }),
    );
    return data.dashboardPets;
  },
  getPet: async (id: string): Promise<Pet> => (await run(() => client.request(GetPetDocument, { id }))).pet,
  createPet: async (input: PetInput): Promise<Pet> =>
    (await run(() => client.request(CreatePetDocument, { input }))).createPet,
  updatePet: async (id: string, input: PetInput): Promise<Pet> =>
    (await run(() => client.request(UpdatePetDocument, { id, input }))).updatePet,
  deletePet: async (id: string): Promise<void> => {
    await run(() => client.request(DeletePetDocument, { id }));
  },

  listRecords: async (petId: string): Promise<MedicalRecord[]> =>
    (await run(() => client.request(PetRecordsDocument, { id: petId }))).pet.records,
  createRecord: async (petId: string, input: RecordInput): Promise<MedicalRecord> =>
    (await run(() => client.request(CreateRecordDocument, { petId, input }))).createMedicalRecord,
  updateRecord: async (id: string, input: RecordInput): Promise<MedicalRecord> =>
    (await run(() => client.request(UpdateRecordDocument, { id, input }))).updateMedicalRecord,
  deleteRecord: async (id: string): Promise<void> => {
    await run(() => client.request(DeleteRecordDocument, { id }));
  },

  listInsurance: async (petId: string): Promise<Insurance[]> =>
    (await run(() => client.request(PetInsuranceDocument, { id: petId }))).pet.insurance,
  createInsurance: async (petId: string, input: InsuranceInput): Promise<Insurance> =>
    (await run(() => client.request(CreatePolicyDocument, { petId, input }))).createInsurancePolicy,
  updateInsurance: async (id: string, input: InsuranceInput): Promise<Insurance> =>
    (await run(() => client.request(UpdatePolicyDocument, { id, input }))).updateInsurancePolicy,
  deleteInsurance: async (id: string): Promise<void> => {
    await run(() => client.request(DeletePolicyDocument, { id }));
  },
};
