import { createServer } from 'node:http';
import process from 'node:process';
import { connect } from './helpers/mongoClient.js';
import { createServer as createYogaServer, GRAPHQL_ENDPOINT } from './server.js';
import { seed } from './seed.js';

const url = process.env.MONGO_URL ?? 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME ?? 'pets';
const port = Number(process.env.PORT ?? 4000);

const database = await connect(url, dbName);
if (process.env.SEED === 'true') await seed(database);

const server = createServer(createYogaServer(database)).listen(port, () =>
  console.log(`GraphQL API listening on :${port}${GRAPHQL_ENDPOINT}`),
);

const shutdown = async () => {
  server.close();
  await database.client.close();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
