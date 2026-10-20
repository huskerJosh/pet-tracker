import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { PetModel, RecordModel, InsuranceModel } from './db/index.js';
import type { GraphQLContext } from '../helpers/context.js';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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
  __typename?: 'DashboardPage';
  items: Array<DashboardPet>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

/** A pet with the summary fields shown in the dashboard table. */
export type DashboardPet = {
  __typename?: 'DashboardPet';
  breed: Scalars['String']['output'];
  dateOfBirth?: Maybe<Scalars['ISODate']['output']>;
  id: Scalars['ID']['output'];
  insuranceExpires?: Maybe<Scalars['ISODate']['output']>;
  insuranceStatus: InsuranceStatus;
  lastVisit?: Maybe<Scalars['ISODate']['output']>;
  name: Scalars['String']['output'];
  nextDue?: Maybe<Scalars['ISODate']['output']>;
  notes: Scalars['String']['output'];
  ownerName: Scalars['String']['output'];
  recordCount: Scalars['Int']['output'];
  sex: Sex;
  species: Species;
  status: PetStatus;
  weightKg?: Maybe<Scalars['Float']['output']>;
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
  __typename?: 'InsurancePolicy';
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
  __typename?: 'MedicalRecord';
  date: Scalars['ISODate']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  nextDueDate?: Maybe<Scalars['ISODate']['output']>;
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
  __typename?: 'Mutation';
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
  __typename?: 'Pet';
  breed: Scalars['String']['output'];
  dateOfBirth?: Maybe<Scalars['ISODate']['output']>;
  id: Scalars['ID']['output'];
  insurance: Array<InsurancePolicy>;
  name: Scalars['String']['output'];
  notes: Scalars['String']['output'];
  ownerName: Scalars['String']['output'];
  records: Array<MedicalRecord>;
  sex: Sex;
  species: Species;
  weightKg?: Maybe<Scalars['Float']['output']>;
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
  __typename?: 'Query';
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
  __typename?: 'Subscriber';
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  DashboardFilter: DashboardFilter;
  DashboardPage: ResolverTypeWrapper<DashboardPage>;
  DashboardPet: ResolverTypeWrapper<DashboardPet>;
  DashboardSort: DashboardSort;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  ISODate: ResolverTypeWrapper<Scalars['ISODate']['output']>;
  InsurancePolicy: ResolverTypeWrapper<InsuranceModel>;
  InsurancePolicyInput: InsurancePolicyInput;
  InsuranceStatus: InsuranceStatus;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  MedicalRecord: ResolverTypeWrapper<RecordModel>;
  MedicalRecordInput: MedicalRecordInput;
  Mutation: ResolverTypeWrapper<{}>;
  Pet: ResolverTypeWrapper<PetModel>;
  PetInput: PetInput;
  PetStatus: PetStatus;
  Query: ResolverTypeWrapper<{}>;
  RecordType: RecordType;
  Sex: Sex;
  SortOrder: SortOrder;
  Species: Species;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscriber: ResolverTypeWrapper<Subscriber>;
  SubscriberInput: SubscriberInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  DashboardFilter: DashboardFilter;
  DashboardPage: DashboardPage;
  DashboardPet: DashboardPet;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  ISODate: Scalars['ISODate']['output'];
  InsurancePolicy: InsuranceModel;
  InsurancePolicyInput: InsurancePolicyInput;
  Int: Scalars['Int']['output'];
  MedicalRecord: RecordModel;
  MedicalRecordInput: MedicalRecordInput;
  Mutation: {};
  Pet: PetModel;
  PetInput: PetInput;
  Query: {};
  String: Scalars['String']['output'];
  Subscriber: Subscriber;
  SubscriberInput: SubscriberInput;
}>;

export type DashboardPageResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DashboardPage'] = ResolversParentTypes['DashboardPage']> = ResolversObject<{
  items?: Resolver<Array<ResolversTypes['DashboardPet']>, ParentType, ContextType>;
  limit?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DashboardPetResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DashboardPet'] = ResolversParentTypes['DashboardPet']> = ResolversObject<{
  breed?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dateOfBirth?: Resolver<Maybe<ResolversTypes['ISODate']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  insuranceExpires?: Resolver<Maybe<ResolversTypes['ISODate']>, ParentType, ContextType>;
  insuranceStatus?: Resolver<ResolversTypes['InsuranceStatus'], ParentType, ContextType>;
  lastVisit?: Resolver<Maybe<ResolversTypes['ISODate']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nextDue?: Resolver<Maybe<ResolversTypes['ISODate']>, ParentType, ContextType>;
  notes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ownerName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  recordCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  sex?: Resolver<ResolversTypes['Sex'], ParentType, ContextType>;
  species?: Resolver<ResolversTypes['Species'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['PetStatus'], ParentType, ContextType>;
  weightKg?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface IsoDateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ISODate'], any> {
  name: 'ISODate';
}

export type InsurancePolicyResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['InsurancePolicy'] = ResolversParentTypes['InsurancePolicy']> = ResolversObject<{
  effectiveDate?: Resolver<ResolversTypes['ISODate'], ParentType, ContextType>;
  expirationDate?: Resolver<ResolversTypes['ISODate'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  idNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pet?: Resolver<ResolversTypes['Pet'], ParentType, ContextType>;
  petId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  planName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subscriber?: Resolver<ResolversTypes['Subscriber'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MedicalRecordResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['MedicalRecord'] = ResolversParentTypes['MedicalRecord']> = ResolversObject<{
  date?: Resolver<ResolversTypes['ISODate'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nextDueDate?: Resolver<Maybe<ResolversTypes['ISODate']>, ParentType, ContextType>;
  pet?: Resolver<ResolversTypes['Pet'], ParentType, ContextType>;
  petId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['RecordType'], ParentType, ContextType>;
  veterinarian?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createInsurancePolicy?: Resolver<ResolversTypes['InsurancePolicy'], ParentType, ContextType, RequireFields<MutationCreateInsurancePolicyArgs, 'input' | 'petId'>>;
  createMedicalRecord?: Resolver<ResolversTypes['MedicalRecord'], ParentType, ContextType, RequireFields<MutationCreateMedicalRecordArgs, 'input' | 'petId'>>;
  createPet?: Resolver<ResolversTypes['Pet'], ParentType, ContextType, RequireFields<MutationCreatePetArgs, 'input'>>;
  deleteInsurancePolicy?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteInsurancePolicyArgs, 'id'>>;
  deleteMedicalRecord?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteMedicalRecordArgs, 'id'>>;
  deletePet?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeletePetArgs, 'id'>>;
  updateInsurancePolicy?: Resolver<ResolversTypes['InsurancePolicy'], ParentType, ContextType, RequireFields<MutationUpdateInsurancePolicyArgs, 'id' | 'input'>>;
  updateMedicalRecord?: Resolver<ResolversTypes['MedicalRecord'], ParentType, ContextType, RequireFields<MutationUpdateMedicalRecordArgs, 'id' | 'input'>>;
  updatePet?: Resolver<ResolversTypes['Pet'], ParentType, ContextType, RequireFields<MutationUpdatePetArgs, 'id' | 'input'>>;
}>;

export type PetResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Pet'] = ResolversParentTypes['Pet']> = ResolversObject<{
  breed?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dateOfBirth?: Resolver<Maybe<ResolversTypes['ISODate']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  insurance?: Resolver<Array<ResolversTypes['InsurancePolicy']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ownerName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  records?: Resolver<Array<ResolversTypes['MedicalRecord']>, ParentType, ContextType, Partial<PetRecordsArgs>>;
  sex?: Resolver<ResolversTypes['Sex'], ParentType, ContextType>;
  species?: Resolver<ResolversTypes['Species'], ParentType, ContextType>;
  weightKg?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  dashboardPets?: Resolver<ResolversTypes['DashboardPage'], ParentType, ContextType, RequireFields<QueryDashboardPetsArgs, 'limit' | 'order' | 'page' | 'sort'>>;
  insurancePolicy?: Resolver<ResolversTypes['InsurancePolicy'], ParentType, ContextType, RequireFields<QueryInsurancePolicyArgs, 'id'>>;
  medicalRecord?: Resolver<ResolversTypes['MedicalRecord'], ParentType, ContextType, RequireFields<QueryMedicalRecordArgs, 'id'>>;
  pet?: Resolver<ResolversTypes['Pet'], ParentType, ContextType, RequireFields<QueryPetArgs, 'id'>>;
  pets?: Resolver<Array<ResolversTypes['Pet']>, ParentType, ContextType>;
}>;

export type SubscriberResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Subscriber'] = ResolversParentTypes['Subscriber']> = ResolversObject<{
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dateOfBirth?: Resolver<ResolversTypes['ISODate'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  zipCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  DashboardPage?: DashboardPageResolvers<ContextType>;
  DashboardPet?: DashboardPetResolvers<ContextType>;
  ISODate?: GraphQLScalarType;
  InsurancePolicy?: InsurancePolicyResolvers<ContextType>;
  MedicalRecord?: MedicalRecordResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Pet?: PetResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscriber?: SubscriberResolvers<ContextType>;
}>;

