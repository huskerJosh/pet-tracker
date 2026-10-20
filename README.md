# Pets Service

Track pets and their medical records. React frontend, TypeScript GraphQL (Yoga) backend, MongoDB (in-memory).

## Run
```
docker compose up --build
```
- UI: http://localhost:3000 · GraphQL API: http://localhost:4000/api/graphql
- Mongo uses `tmpfs` and no volume, so data is wiped on every restart. Sample data is seeded on startup (`SEED=true` in docker-compose.yml).

## Develop
```
docker run -d --rm -p 27017:27017 mongo:7        # local Mongo
npm install
SEED=true npm run dev -w backend                 # :4000
npm run dev -w frontend                          # :3000, proxies /api
```
Tests: `MONGO_URL=mongodb://localhost:27017 npm test -w backend` (needs a Mongo) and `npm test -w frontend`.

## API (GraphQL)
Single endpoint: `POST /api/graphql` (http://localhost:4000/api/graphql, or via the UI's proxy at http://localhost:3000/api/graphql). Opening it in a browser serves GraphiQL for exploring the schema. Health check: `GET :4000/health`.

The schema is in [backend/infra/graphql/](backend/infra/graphql/) (`schema.graphql`, `enums`, `inputs`, `outputs`, `queries`, `mutations`).

- **Queries:** `pet(id)`, `pets`, `dashboardPets(filter, sort, order, page, limit)`, `medicalRecord(id)`, `insurancePolicy(id)`. A pet's `records(type)` and `insurance` are fields on `Pet`.
- **Mutations:** `create/update/deletePet` (delete cascades to records and policies), `create/update/deleteMedicalRecord`, `create/update/deleteInsurancePolicy`.
- **Insurance policy:** `planName`, `idNumber`, `effectiveDate`, `expirationDate`, `subscriber { firstName lastName dateOfBirth phone address state zipCode }` (state is a 2-letter code, normalised to upper case; zip is `12345` or `12345-6789`).
- **Dashboard:** `DashboardPet` adds `recordCount`, `lastVisit`, `nextDue`, `status` (`overdue | upToDate | noRecords`) and `insuranceStatus`. Filter by `search`, `species`, `status`, `insurance`; sort by any column.
- **Errors:** `errors[].extensions.code` is `NOT_FOUND`, `BAD_USER_INPUT` (e.g. malformed id), or `VALIDATION_ERROR` (with Zod `details`). Type-level problems (missing field, bad enum or date) are rejected by GraphQL itself.

```graphql
query {
  dashboardPets(filter: { status: overdue }, sort: nextDue) {
    total
    items { id name status insuranceStatus nextDue }
  }
}
```

A pet is "overdue" if any of its records has a `nextDueDate` in the past.

### Codegen
Types are generated from the schema and the frontend's [operations](frontend/src/api/operations.graphql):
```
npm run codegen   # writes backend/src/models/generated.types.ts and frontend/src/api/generated.ts
```
The generated files are committed; re-run codegen after changing the schema or operations.

Insurance status: `active` if any policy covers today, `expired` if there is a lapsed policy and none active, otherwise `none` (no policies, or only future-dated ones).
