import { createServer, type Server } from 'node:http';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createServer as createYogaServer, GRAPHQL_ENDPOINT } from '../../src/server.js';
import { connect, type Database } from '../../src/helpers/mongoDbClient.js';

let database: Database;
let server: Server;

beforeAll(async () => {
  database = await connect(process.env.MONGO_URL ?? 'mongodb://localhost:27017', `pets_test_${process.pid}`);
  server = createServer(createYogaServer(database));
});
beforeEach(async () => {
  await database.pets.deleteMany({});
  await database.records.deleteMany({});
  await database.insurance.deleteMany({});
});
afterAll(async () => {
  await database.db.dropDatabase();
  await database.client.close();
});

// --- helpers ---------------------------------------------------------------------------------
type GqlResult = { data?: any; errors?: { message: string; extensions?: any }[] };
const gql = async (query: string, variables?: object): Promise<GqlResult> =>
  (await request(server).post(GRAPHQL_ENDPOINT).send({ query, variables })).body;
/** Runs an operation that must succeed and returns its data. */
const ok = async (query: string, variables?: object) => {
  const r = await gql(query, variables);
  expect(r.errors).toBeUndefined();
  return r.data;
};
/** Runs an operation that must fail and returns the first error. */
const fail = async (query: string, variables?: object) => {
  const r = await gql(query, variables);
  expect(r.errors?.length).toBeGreaterThan(0);
  return r.errors![0];
};

const day = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10);
const pet = (o = {}) => ({ name: 'Rex', species: 'dog', ownerName: 'Sam', ...o });
const rec = (o = {}) => ({ type: 'checkup', title: 'Annual', date: '2024-01-01', ...o });
const sub = (o = {}) => ({
  firstName: 'Sam', lastName: 'Lee', dateOfBirth: '1990-02-03', phone: '+1 (555) 123-4567',
  address: '1 Main St', state: 'CA', zipCode: '94105', ...o,
});
const policy = (o = {}) => ({
  planName: 'Gold', idNumber: 'ABC123', effectiveDate: '2024-01-01', expirationDate: '2024-12-31', subscriber: sub(), ...o,
});

const PET = 'id name species breed dateOfBirth sex weightKg ownerName notes';
const REC = 'id petId type title date veterinarian description nextDueDate';
const POL = 'id petId planName idNumber effectiveDate expirationDate subscriber { firstName lastName dateOfBirth phone address state zipCode }';

const CREATE_PET = `mutation($input: PetInput!) { createPet(input: $input) { ${PET} } }`;
const UPDATE_PET = `mutation($id: ID!, $input: PetInput!) { updatePet(id: $id, input: $input) { ${PET} } }`;
const DELETE_PET = `mutation($id: ID!) { deletePet(id: $id) }`;
const CREATE_REC = `mutation($petId: ID!, $input: MedicalRecordInput!) { createMedicalRecord(petId: $petId, input: $input) { ${REC} } }`;
const UPDATE_REC = `mutation($id: ID!, $input: MedicalRecordInput!) { updateMedicalRecord(id: $id, input: $input) { ${REC} } }`;
const DELETE_REC = `mutation($id: ID!) { deleteMedicalRecord(id: $id) }`;
const CREATE_POL = `mutation($petId: ID!, $input: InsurancePolicyInput!) { createInsurancePolicy(petId: $petId, input: $input) { ${POL} } }`;
const UPDATE_POL = `mutation($id: ID!, $input: InsurancePolicyInput!) { updateInsurancePolicy(id: $id, input: $input) { ${POL} } }`;
const DELETE_POL = `mutation($id: ID!) { deleteInsurancePolicy(id: $id) }`;
const GET_PET = `query($id: ID!) { pet(id: $id) { ${PET} } }`;
const GET_REC = `query($id: ID!) { medicalRecord(id: $id) { ${REC} } }`;
const GET_POL = `query($id: ID!) { insurancePolicy(id: $id) { ${POL} } }`;
const DASH = `query($filter: DashboardFilter, $sort: DashboardSort, $order: SortOrder, $page: Int, $limit: Int) {
  dashboardPets(filter: $filter, sort: $sort, order: $order, page: $page, limit: $limit) {
    total page limit
    items { id name species status insuranceStatus insuranceExpires lastVisit nextDue recordCount }
  }
}`;

const mkPet = async (o = {}) => (await ok(CREATE_PET, { input: pet(o) })).createPet;
const mkRec = async (petId: string, o = {}) => (await ok(CREATE_REC, { petId, input: rec(o) })).createMedicalRecord;
const mkPol = async (petId: string, o = {}) => (await ok(CREATE_POL, { petId, input: policy(o) })).createInsurancePolicy;
const dash = async (vars: object = {}) => (await ok(DASH, vars)).dashboardPets;
const names = (page: { items: { name: string }[] }) => page.items.map((i) => i.name);

// --- pets ------------------------------------------------------------------------------------
describe('pets', () => {
  it('creates, reads, updates, deletes', async () => {
    const created = await mkPet();
    expect(created).toMatchObject({ name: 'Rex', breed: '', sex: 'unknown', weightKg: null, notes: '' });
    const { id } = created;
    expect((await ok(GET_PET, { id })).pet.name).toBe('Rex');
    const upd = (await ok(UPDATE_PET, { id, input: pet({ name: 'Max', weightKg: 12.5 }) })).updatePet;
    expect(upd).toMatchObject({ name: 'Max', weightKg: 12.5 });
    expect((await ok(`{ pets { id } }`)).pets).toHaveLength(1);
    expect((await ok(DELETE_PET, { id })).deletePet).toBe(true);
    expect((await fail(GET_PET, { id })).extensions.code).toBe('NOT_FOUND');
  });

  it('reports validation errors, bad ids and missing resources with codes', async () => {
    const bad = await fail(CREATE_PET, { input: pet({ name: '   ' }) });
    expect(bad.extensions.code).toBe('VALIDATION_ERROR');
    expect(bad.extensions.details.fieldErrors.name).toBeDefined();
    // Schema-level errors (missing required field, bad enum / date scalar) are rejected before resolvers run.
    await fail(CREATE_PET, { input: { name: 'x' } });
    await fail(CREATE_PET, { input: pet({ species: 'dragon' }) });
    await fail(CREATE_PET, { input: pet({ dateOfBirth: 'yesterday' }) });
    expect((await fail(GET_PET, { id: 'nope' })).extensions.code).toBe('BAD_USER_INPUT');
    expect((await fail(GET_PET, { id: 'aaaaaaaaaaaaaaaaaaaaaaaa' })).extensions.code).toBe('NOT_FOUND');
    expect((await fail(DELETE_PET, { id: 'aaaaaaaaaaaaaaaaaaaaaaaa' })).extensions.code).toBe('NOT_FOUND');
  });

  it('no longer serves the REST API', async () => {
    await request(server).get('/api/pets').expect(404);
  });
});

// --- records ---------------------------------------------------------------------------------
describe('medical records', () => {
  it('manages records, resolves them from the pet, and cascades on pet delete', async () => {
    const p = await mkPet();
    const r = await mkRec(p.id);
    expect(r.petId).toBe(p.id);
    await mkRec(p.id, { type: 'surgery', title: 'Op', date: '2024-03-01' });

    const nested = (await ok(
      `query($id: ID!, $type: RecordType) { pet(id: $id) { all: records { title } filtered: records(type: $type) { title } } }`,
      { id: p.id, type: 'surgery' },
    )).pet;
    expect(nested.all.map((x: any) => x.title)).toEqual(['Op', 'Annual']); // newest first
    expect(nested.filtered).toEqual([{ title: 'Op' }]);

    const upd = (await ok(UPDATE_REC, { id: r.id, input: rec({ title: 'Changed' }) })).updateMedicalRecord;
    expect(upd.title).toBe('Changed');
    expect((await ok(`query($id: ID!) { medicalRecord(id: $id) { pet { name } } }`, { id: r.id })).medicalRecord.pet.name).toBe('Rex');

    await ok(DELETE_PET, { id: p.id });
    expect((await fail(GET_REC, { id: r.id })).extensions.code).toBe('NOT_FOUND');
  });

  it('rejects records for a missing pet and invalid input', async () => {
    expect((await fail(CREATE_REC, { petId: 'aaaaaaaaaaaaaaaaaaaaaaaa', input: rec() })).extensions.code).toBe('NOT_FOUND');
    const p = await mkPet();
    await fail(CREATE_REC, { petId: p.id, input: rec({ date: 'yesterday' }) });
    expect((await fail(CREATE_REC, { petId: p.id, input: rec({ title: '' }) })).extensions.code).toBe('VALIDATION_ERROR');
    const r = await mkRec(p.id);
    expect((await ok(DELETE_REC, { id: r.id })).deleteMedicalRecord).toBe(true);
    expect((await fail(DELETE_REC, { id: r.id })).extensions.code).toBe('NOT_FOUND');
  });
});

// --- insurance -------------------------------------------------------------------------------
describe('insurance', () => {
  it('creates, lists, updates, deletes and cascades', async () => {
    const p = await mkPet();
    const i = await mkPol(p.id);
    expect(i.subscriber).toMatchObject({ firstName: 'Sam', state: 'CA', zipCode: '94105' });
    const lower = await mkPol(p.id, { subscriber: sub({ state: 'ny', zipCode: '10001-1234' }) });
    expect(lower.subscriber.state).toBe('NY');
    await ok(DELETE_POL, { id: lower.id });

    const listed = (await ok(`query($id: ID!) { pet(id: $id) { insurance { id planName } } }`, { id: p.id })).pet.insurance;
    expect(listed).toEqual([{ id: i.id, planName: 'Gold' }]);

    const upd = (await ok(UPDATE_POL, {
      id: i.id, input: policy({ planName: 'Silver', subscriber: sub({ phone: '555-000-1111' }) }),
    })).updateInsurancePolicy;
    expect(upd).toMatchObject({ planName: 'Silver', subscriber: { phone: '555-000-1111' } });

    expect((await ok(DELETE_POL, { id: i.id })).deleteInsurancePolicy).toBe(true);
    expect((await fail(GET_POL, { id: i.id })).extensions.code).toBe('NOT_FOUND');

    const j = await mkPol(p.id);
    await ok(DELETE_PET, { id: p.id });
    expect((await fail(GET_POL, { id: j.id })).extensions.code).toBe('NOT_FOUND');
  });

  it('validates input', async () => {
    const p = await mkPet();
    const code = async (o: object) => (await fail(CREATE_POL, { petId: p.id, input: policy(o) })).extensions?.code;
    expect((await fail(CREATE_POL, { petId: 'aaaaaaaaaaaaaaaaaaaaaaaa', input: policy() })).extensions.code).toBe('NOT_FOUND');
    expect(await code({ expirationDate: '2023-12-31' })).toBe('VALIDATION_ERROR');
    expect(await code({ subscriber: sub({ phone: 'abc' }) })).toBe('VALIDATION_ERROR');
    expect(await code({ subscriber: sub({ state: 'California' }) })).toBe('VALIDATION_ERROR');
    expect(await code({ subscriber: sub({ zipCode: '123' }) })).toBe('VALIDATION_ERROR');
    await fail(CREATE_POL, { petId: p.id, input: policy({ effectiveDate: 'soon' }) });
    await fail(CREATE_POL, { petId: p.id, input: policy({ subscriber: { firstName: 'Sam' } }) });
    await fail(CREATE_POL, { petId: p.id, input: { planName: 'x' } });
  });
});

// --- dashboard -------------------------------------------------------------------------------
describe('dashboard', () => {
  beforeEach(async () => {
    const a = await mkPet({ name: 'Overdue', breed: 'Lab' });
    const b = await mkPet({ name: 'Fine', species: 'cat', ownerName: 'Pat' });
    await mkPet({ name: 'Empty', species: 'cat' });
    await mkRec(a.id, { nextDueDate: day(-5) });
    await mkRec(b.id, { date: '2025-06-01', nextDueDate: day(30) });
  });

  it('computes status and summary fields', async () => {
    const body = await dash();
    expect(body.total).toBe(3);
    const by = Object.fromEntries(body.items.map((i: any) => [i.name, i]));
    expect(by.Overdue.status).toBe('overdue');
    expect(by.Fine.status).toBe('upToDate');
    expect(by.Fine).toMatchObject({ lastVisit: '2025-06-01', recordCount: 1 });
    expect(by.Empty.status).toBe('noRecords');
  });

  it('filters, searches, sorts, paginates', async () => {
    expect(names(await dash({ filter: { status: 'overdue' } }))).toEqual(['Overdue']);
    expect(names(await dash({ filter: { species: 'cat' } }))).toEqual(['Empty', 'Fine']);
    expect(names(await dash({ filter: { search: 'lab' } }))).toEqual(['Overdue']);
    expect(names(await dash({ filter: { search: 'pat' } }))).toEqual(['Fine']);
    expect(names(await dash({ filter: { search: '.*' } }))).toEqual([]);
    expect(names(await dash({ order: 'desc' }))).toEqual(['Overdue', 'Fine', 'Empty']);
    expect(names(await dash({ sort: 'status' }))).toEqual(['Overdue', 'Fine', 'Empty']);
    expect(names(await dash({ sort: 'status', order: 'desc' }))).toEqual(['Empty', 'Fine', 'Overdue']);
    expect(names(await dash({ sort: 'recordCount', order: 'desc' }))[2]).toBe('Empty');
    const page = await dash({ limit: 2, page: 2 });
    expect(page.total).toBe(3);
    expect(names(page)).toEqual(['Overdue']);
  });

  it('rejects out-of-range paging', async () => {
    expect((await fail(DASH, { limit: 1000 })).extensions.code).toBe('VALIDATION_ERROR');
    expect((await fail(DASH, { page: 0 })).extensions.code).toBe('VALIDATION_ERROR');
  });
});

describe('dashboard insurance', () => {
  it('derives insuranceStatus, filters and sorts', async () => {
    const [a, e, , f] = [await mkPet({ name: 'Active' }), await mkPet({ name: 'Expired' }), await mkPet({ name: 'None' }), await mkPet({ name: 'Future' })];
    await mkPol(a.id, { effectiveDate: day(-10), expirationDate: day(100) });
    await mkPol(e.id, { effectiveDate: day(-400), expirationDate: day(-30) });
    await mkPol(f.id, { effectiveDate: day(10), expirationDate: day(200) });

    const by = Object.fromEntries((await dash()).items.map((i: any) => [i.name, i]));
    expect(by.Active).toMatchObject({ insuranceStatus: 'active', insuranceExpires: day(100) });
    expect(by.Expired.insuranceStatus).toBe('expired');
    expect(by.None.insuranceStatus).toBe('none');
    expect(by.Future.insuranceStatus).toBe('none');

    expect(names(await dash({ filter: { insurance: 'active' } }))).toEqual(['Active']);
    expect(names(await dash({ filter: { insurance: 'expired' } }))).toEqual(['Expired']);
    expect(names(await dash({ filter: { insurance: 'none' } }))).toEqual(['Future', 'None']);
    expect(names(await dash({ sort: 'insurance' })).slice(0, 2)).toEqual(['Active', 'Expired']);
    expect(names(await dash({ sort: 'insurance', order: 'desc' })).slice(-2)).toEqual(['Expired', 'Active']);
  });
});
