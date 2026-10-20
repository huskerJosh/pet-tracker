export const SPECIES = ['dog', 'cat', 'bird', 'rabbit', 'reptile', 'other'] as const;
export const SEXES = ['male', 'female', 'unknown'] as const;
export const RECORD_TYPES = ['vaccination', 'checkup', 'surgery', 'medication', 'allergy', 'other'] as const;
export type Species = (typeof SPECIES)[number];
export type Sex = (typeof SEXES)[number];
export type RecordType = (typeof RECORD_TYPES)[number];
export type Status = 'overdue' | 'upToDate' | 'noRecords';

export interface PetInput {
  name: string;
  species: Species;
  breed: string;
  dateOfBirth: string | null;
  sex: Sex;
  weightKg: number | null;
  ownerName: string;
  notes: string;
}
export interface Pet extends PetInput {
  id: string;
}
export interface DashboardPet extends Pet {
  recordCount: number;
  lastVisit: string | null;
  nextDue: string | null;
  status: Status;
  insuranceStatus: InsuranceStatus;
  insuranceExpires: string | null;
}
export interface RecordInput {
  type: RecordType;
  title: string;
  date: string;
  veterinarian: string;
  description: string;
  nextDueDate: string | null;
}
export interface MedicalRecord extends RecordInput {
  id: string;
  petId: string;
}
export interface DashboardPage {
  items: DashboardPet[];
  total: number;
  page: number;
  limit: number;
}
export interface DashboardQuery {
  search?: string;
  species?: string;
  status?: string;
  insurance?: string;
  sort?: string;
  order?: string;
  page?: number;
}

export type InsuranceStatus = 'active' | 'expired' | 'none';
export interface Subscriber {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  state: string;
  zipCode: string;
}
export interface InsuranceInput {
  planName: string;
  idNumber: string;
  effectiveDate: string;
  expirationDate: string;
  subscriber: Subscriber;
}
export interface Insurance extends InsuranceInput {
  id: string;
  petId: string;
}
