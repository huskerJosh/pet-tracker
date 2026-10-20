import { createYoga } from 'graphql-yoga';
import { createContext, type GraphQLContext } from './helpers/context.js';
import { schema } from './schema.js';
import type { Database } from './helpers/mongoClient.js';

export const GRAPHQL_ENDPOINT = '/api/graphql';

export function createServer(database: Database) {
  return createYoga<object, GraphQLContext>({
    schema,
    graphqlEndpoint: GRAPHQL_ENDPOINT,
    context: () => createContext(database),
  });
}
