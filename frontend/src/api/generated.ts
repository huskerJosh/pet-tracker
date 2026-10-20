import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A calendar date formatted YYYY-MM-DD. */
  ISODate: { input: string; output: string; }
};

export type DashboardFilter = {
  insurance?: InputMaybe<InsuranceStatus>;
  search?: InputMaybe<Scalars['String']['input']>;
  species?: InputMaybe<Species>;
  status?: InputMaybe<PetStatus>;
};

export type DashboardPage = {
  items: Array<DashboardPet>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

/** A pet with the summary fields shown in the dashboard table. */
export type DashboardPet = {
  breed: Scalars['String']['output'];
  dateOfBirth: Maybe<Scalars['ISODate']['output']>;
  id: Scalars['ID']['output'];
  insuranceExpires: Maybe<Scalars['ISODate']['output']>;
  insuranceStatus: InsuranceStatus;
  lastVisit: Maybe<Scalars['ISODate']['output']>;
  name: Scalars['String']['output'];
  nextDue: Maybe<Scalars['ISODate']['output']>;
  notes: Scalars['String']['output'];
  ownerName: Scalars['String']['output'];
  recordCount: Scalars['Int']['output'];
  sex: Sex;
  species: Species;
  status: PetStatus;
  weightKg: Maybe<Scalars['Float']['output']>;
};

export type DashboardSort =
  | 'age'
  | 'breed'
  | 'insurance'
  | 'lastVisit'
  | 'name'
  | 'nextDue'
  | 'ownerName'
  | 'recordCount'
  | 'species'
  | 'status';

export type InsurancePolicy = {
  effectiveDate: Scalars['ISODate']['output'];
  expirationDate: Scalars['ISODate']['output'];
  id: Scalars['ID']['output'];
  idNumber: Scalars['String']['output'];
  pet: Pet;
  petId: Scalars['ID']['output'];
  planName: Scalars['String']['output'];
  subscriber: Subscriber;
};

export type InsurancePolicyInput = {
  effectiveDate: Scalars['ISODate']['input'];
  expirationDate: Scalars['ISODate']['input'];
  idNumber: Scalars['String']['input'];
  planName: Scalars['String']['input'];
  subscriber: SubscriberInput;
};

export type InsuranceStatus =
  | 'active'
  | 'expired'
  | 'none';

export type MedicalRecord = {
  date: Scalars['ISODate']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  nextDueDate: Maybe<Scalars['ISODate']['output']>;
  pet: Pet;
  petId: Scalars['ID']['output'];
  title: Scalars['String']['output'];
  type: RecordType;
  veterinarian: Scalars['String']['output'];
};

export type MedicalRecordInput = {
  date: Scalars['ISODate']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  nextDueDate?: InputMaybe<Scalars['ISODate']['input']>;
  title: Scalars['String']['input'];
  type: RecordType;
  veterinarian?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  createInsurancePolicy: InsurancePolicy;
  createMedicalRecord: MedicalRecord;
  createPet: Pet;
  deleteInsurancePolicy: Scalars['Boolean']['output'];
  deleteMedicalRecord: Scalars['Boolean']['output'];
  /** Also deletes the pet's medical records and insurance policies. */
  deletePet: Scalars['Boolean']['output'];
  updateInsurancePolicy: InsurancePolicy;
  updateMedicalRecord: MedicalRecord;
  updatePet: Pet;
};


export type MutationCreateInsurancePolicyArgs = {
  input: InsurancePolicyInput;
  petId: Scalars['ID']['input'];
};


export type MutationCreateMedicalRecordArgs = {
  input: MedicalRecordInput;
  petId: Scalars['ID']['input'];
};


export type MutationCreatePetArgs = {
  input: PetInput;
};


export type MutationDeleteInsurancePolicyArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMedicalRecordArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePetArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateInsurancePolicyArgs = {
  id: Scalars['ID']['input'];
  input: InsurancePolicyInput;
};


export type MutationUpdateMedicalRecordArgs = {
  id: Scalars['ID']['input'];
  input: MedicalRecordInput;
};


export type MutationUpdatePetArgs = {
  id: Scalars['ID']['input'];
  input: PetInput;
};

export type Pet = {
  breed: Scalars['String']['output'];
  dateOfBirth: Maybe<Scalars['ISODate']['output']>;
  id: Scalars['ID']['output'];
  insurance: Array<InsurancePolicy>;
  name: Scalars['String']['output'];
  notes: Scalars['String']['output'];
  ownerName: Scalars['String']['output'];
  records: Array<MedicalRecord>;
  sex: Sex;
  species: Species;
  weightKg: Maybe<Scalars['Float']['output']>;
};


export type PetRecordsArgs = {
  type?: InputMaybe<RecordType>;
};

export type PetInput = {
  breed?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['ISODate']['input']>;
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  ownerName: Scalars['String']['input'];
  sex?: InputMaybe<Sex>;
  species: Species;
  weightKg?: InputMaybe<Scalars['Float']['input']>;
};

export type PetStatus =
  | 'noRecords'
  | 'overdue'
  | 'upToDate';

export type Query = {
  dashboardPets: DashboardPage;
  insurancePolicy: InsurancePolicy;
  medicalRecord: MedicalRecord;
  pet: Pet;
  pets: Array<Pet>;
};


export type QueryDashboardPetsArgs = {
  filter?: InputMaybe<DashboardFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<SortOrder>;
  page?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<DashboardSort>;
};


export type QueryInsurancePolicyArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMedicalRecordArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPetArgs = {
  id: Scalars['ID']['input'];
};

export type RecordType =
  | 'allergy'
  | 'checkup'
  | 'medication'
  | 'other'
  | 'surgery'
  | 'vaccination';

export type Sex =
  | 'female'
  | 'male'
  | 'unknown';

export type SortOrder =
  | 'asc'
  | 'desc';

export type Species =
  | 'bird'
  | 'cat'
  | 'dog'
  | 'other'
  | 'rabbit'
  | 'reptile';

export type Subscriber = {
  address: Scalars['String']['output'];
  dateOfBirth: Scalars['ISODate']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  state: Scalars['String']['output'];
  zipCode: Scalars['String']['output'];
};

export type SubscriberInput = {
  address: Scalars['String']['input'];
  dateOfBirth: Scalars['ISODate']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  /** 2-letter US state code; normalised to upper case. */
  state: Scalars['String']['input'];
  /** 12345 or 12345-6789. */
  zipCode: Scalars['String']['input'];
};

export type PetFieldsFragment = { id: string, name: string, species: Species, breed: string, dateOfBirth: string | null, sex: Sex, weightKg: number | null, ownerName: string, notes: string };

export type RecordFieldsFragment = { id: string, petId: string, type: RecordType, title: string, date: string, veterinarian: string, description: string, nextDueDate: string | null };

export type PolicyFieldsFragment = { id: string, petId: string, planName: string, idNumber: string, effectiveDate: string, expirationDate: string, subscriber: { firstName: string, lastName: string, dateOfBirth: string, phone: string, address: string, state: string, zipCode: string } };

export type DashboardQueryVariables = Exact<{
  filter?: InputMaybe<DashboardFilter>;
  sort?: InputMaybe<DashboardSort>;
  order?: InputMaybe<SortOrder>;
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type DashboardQuery = { dashboardPets: { total: number, page: number, limit: number, items: Array<{ id: string, name: string, species: Species, breed: string, dateOfBirth: string | null, sex: Sex, weightKg: number | null, ownerName: string, notes: string, recordCount: number, lastVisit: string | null, nextDue: string | null, status: PetStatus, insuranceStatus: InsuranceStatus, insuranceExpires: string | null }> } };

export type GetPetQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPetQuery = { pet: { id: string, name: string, species: Species, breed: string, dateOfBirth: string | null, sex: Sex, weightKg: number | null, ownerName: string, notes: string } };

export type PetRecordsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type PetRecordsQuery = { pet: { id: string, records: Array<{ id: string, petId: string, type: RecordType, title: string, date: string, veterinarian: string, description: string, nextDueDate: string | null }> } };

export type PetInsuranceQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type PetInsuranceQuery = { pet: { id: string, insurance: Array<{ id: string, petId: string, planName: string, idNumber: string, effectiveDate: string, expirationDate: string, subscriber: { firstName: string, lastName: string, dateOfBirth: string, phone: string, address: string, state: string, zipCode: string } }> } };

export type CreatePetMutationVariables = Exact<{
  input: PetInput;
}>;


export type CreatePetMutation = { createPet: { id: string, name: string, species: Species, breed: string, dateOfBirth: string | null, sex: Sex, weightKg: number | null, ownerName: string, notes: string } };

export type UpdatePetMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: PetInput;
}>;


export type UpdatePetMutation = { updatePet: { id: string, name: string, species: Species, breed: string, dateOfBirth: string | null, sex: Sex, weightKg: number | null, ownerName: string, notes: string } };

export type DeletePetMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletePetMutation = { deletePet: boolean };

export type CreateRecordMutationVariables = Exact<{
  petId: Scalars['ID']['input'];
  input: MedicalRecordInput;
}>;


export type CreateRecordMutation = { createMedicalRecord: { id: string, petId: string, type: RecordType, title: string, date: string, veterinarian: string, description: string, nextDueDate: string | null } };

export type UpdateRecordMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: MedicalRecordInput;
}>;


export type UpdateRecordMutation = { updateMedicalRecord: { id: string, petId: string, type: RecordType, title: string, date: string, veterinarian: string, description: string, nextDueDate: string | null } };

export type DeleteRecordMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteRecordMutation = { deleteMedicalRecord: boolean };

export type CreatePolicyMutationVariables = Exact<{
  petId: Scalars['ID']['input'];
  input: InsurancePolicyInput;
}>;


export type CreatePolicyMutation = { createInsurancePolicy: { id: string, petId: string, planName: string, idNumber: string, effectiveDate: string, expirationDate: string, subscriber: { firstName: string, lastName: string, dateOfBirth: string, phone: string, address: string, state: string, zipCode: string } } };

export type UpdatePolicyMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: InsurancePolicyInput;
}>;


export type UpdatePolicyMutation = { updateInsurancePolicy: { id: string, petId: string, planName: string, idNumber: string, effectiveDate: string, expirationDate: string, subscriber: { firstName: string, lastName: string, dateOfBirth: string, phone: string, address: string, state: string, zipCode: string } } };

export type DeletePolicyMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletePolicyMutation = { deleteInsurancePolicy: boolean };

export const PetFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PetFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"species"}},{"kind":"Field","name":{"kind":"Name","value":"breed"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"sex"}},{"kind":"Field","name":{"kind":"Name","value":"weightKg"}},{"kind":"Field","name":{"kind":"Name","value":"ownerName"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]} as unknown as DocumentNode<PetFieldsFragment, unknown>;
export const RecordFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecordFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MedicalRecord"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"petId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"veterinarian"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"nextDueDate"}}]}}]} as unknown as DocumentNode<RecordFieldsFragment, unknown>;
export const PolicyFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PolicyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InsurancePolicy"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"petId"}},{"kind":"Field","name":{"kind":"Name","value":"planName"}},{"kind":"Field","name":{"kind":"Name","value":"idNumber"}},{"kind":"Field","name":{"kind":"Name","value":"effectiveDate"}},{"kind":"Field","name":{"kind":"Name","value":"expirationDate"}},{"kind":"Field","name":{"kind":"Name","value":"subscriber"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}}]}}]}}]} as unknown as DocumentNode<PolicyFieldsFragment, unknown>;
export const DashboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Dashboard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DashboardFilter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DashboardSort"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SortOrder"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dashboardPets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"species"}},{"kind":"Field","name":{"kind":"Name","value":"breed"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"sex"}},{"kind":"Field","name":{"kind":"Name","value":"weightKg"}},{"kind":"Field","name":{"kind":"Name","value":"ownerName"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recordCount"}},{"kind":"Field","name":{"kind":"Name","value":"lastVisit"}},{"kind":"Field","name":{"kind":"Name","value":"nextDue"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"insuranceStatus"}},{"kind":"Field","name":{"kind":"Name","value":"insuranceExpires"}}]}}]}}]}}]} as unknown as DocumentNode<DashboardQuery, DashboardQueryVariables>;
export const GetPetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PetFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PetFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"species"}},{"kind":"Field","name":{"kind":"Name","value":"breed"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"sex"}},{"kind":"Field","name":{"kind":"Name","value":"weightKg"}},{"kind":"Field","name":{"kind":"Name","value":"ownerName"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]} as unknown as DocumentNode<GetPetQuery, GetPetQueryVariables>;
export const PetRecordsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PetRecords"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecordFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecordFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MedicalRecord"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"petId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"veterinarian"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"nextDueDate"}}]}}]} as unknown as DocumentNode<PetRecordsQuery, PetRecordsQueryVariables>;
export const PetInsuranceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PetInsurance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"insurance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PolicyFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PolicyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InsurancePolicy"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"petId"}},{"kind":"Field","name":{"kind":"Name","value":"planName"}},{"kind":"Field","name":{"kind":"Name","value":"idNumber"}},{"kind":"Field","name":{"kind":"Name","value":"effectiveDate"}},{"kind":"Field","name":{"kind":"Name","value":"expirationDate"}},{"kind":"Field","name":{"kind":"Name","value":"subscriber"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}}]}}]}}]} as unknown as DocumentNode<PetInsuranceQuery, PetInsuranceQueryVariables>;
export const CreatePetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PetFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PetFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"species"}},{"kind":"Field","name":{"kind":"Name","value":"breed"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"sex"}},{"kind":"Field","name":{"kind":"Name","value":"weightKg"}},{"kind":"Field","name":{"kind":"Name","value":"ownerName"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]} as unknown as DocumentNode<CreatePetMutation, CreatePetMutationVariables>;
export const UpdatePetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PetFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PetFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"species"}},{"kind":"Field","name":{"kind":"Name","value":"breed"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"sex"}},{"kind":"Field","name":{"kind":"Name","value":"weightKg"}},{"kind":"Field","name":{"kind":"Name","value":"ownerName"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]} as unknown as DocumentNode<UpdatePetMutation, UpdatePetMutationVariables>;
export const DeletePetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeletePetMutation, DeletePetMutationVariables>;
export const CreateRecordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRecord"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"petId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MedicalRecordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMedicalRecord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"petId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"petId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecordFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecordFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MedicalRecord"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"petId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"veterinarian"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"nextDueDate"}}]}}]} as unknown as DocumentNode<CreateRecordMutation, CreateRecordMutationVariables>;
export const UpdateRecordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateRecord"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MedicalRecordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMedicalRecord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecordFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecordFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MedicalRecord"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"petId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"veterinarian"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"nextDueDate"}}]}}]} as unknown as DocumentNode<UpdateRecordMutation, UpdateRecordMutationVariables>;
export const DeleteRecordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteRecord"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMedicalRecord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteRecordMutation, DeleteRecordMutationVariables>;
export const CreatePolicyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePolicy"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"petId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InsurancePolicyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createInsurancePolicy"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"petId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"petId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PolicyFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PolicyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InsurancePolicy"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"petId"}},{"kind":"Field","name":{"kind":"Name","value":"planName"}},{"kind":"Field","name":{"kind":"Name","value":"idNumber"}},{"kind":"Field","name":{"kind":"Name","value":"effectiveDate"}},{"kind":"Field","name":{"kind":"Name","value":"expirationDate"}},{"kind":"Field","name":{"kind":"Name","value":"subscriber"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}}]}}]}}]} as unknown as DocumentNode<CreatePolicyMutation, CreatePolicyMutationVariables>;
export const UpdatePolicyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePolicy"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InsurancePolicyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateInsurancePolicy"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PolicyFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PolicyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InsurancePolicy"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"petId"}},{"kind":"Field","name":{"kind":"Name","value":"planName"}},{"kind":"Field","name":{"kind":"Name","value":"idNumber"}},{"kind":"Field","name":{"kind":"Name","value":"effectiveDate"}},{"kind":"Field","name":{"kind":"Name","value":"expirationDate"}},{"kind":"Field","name":{"kind":"Name","value":"subscriber"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}}]}}]}}]} as unknown as DocumentNode<UpdatePolicyMutation, UpdatePolicyMutationVariables>;
export const DeletePolicyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePolicy"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteInsurancePolicy"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeletePolicyMutation, DeletePolicyMutationVariables>;