import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createSchema } from 'graphql-yoga';
import type { GraphQLContext } from './helpers/context.js';
import { resolvers } from './resolvers/index.js';

// The SDL lives in infra/graphql/*.graphql (shipped alongside dist, not compiled). Every file is
// loaded; schema.graphql declares the schema object and scalars, the rest define the types.
const schemaDir = fileURLToPath(new URL('../infra/graphql/', import.meta.url));
const typeDefs = readdirSync(schemaDir)
  .filter((f) => f.endsWith('.graphql'))
  .sort()
  .map((f) => readFileSync(schemaDir + f, 'utf8'));

export const schema = createSchema<GraphQLContext>({ typeDefs, resolvers: resolvers as never });
