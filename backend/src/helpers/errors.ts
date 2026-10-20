import { createGraphQLError } from 'graphql-yoga';
import { ObjectId } from 'mongodb';
import { ZodError, type ZodTypeAny, type z } from 'zod';

// createGraphQLError (rather than `new GraphQLError`) so Yoga recognises the error as intentional and
// doesn't mask it, even if more than one copy of graphql-js is loaded.
export const notFound = (what: string) =>
  createGraphQLError(`${what} not found`, { extensions: { code: 'NOT_FOUND' } });

export function parseId(raw: string): ObjectId {
  if (!ObjectId.isValid(raw) || new ObjectId(raw).toHexString() !== raw.toLowerCase()) {
    throw createGraphQLError(`Invalid id: ${raw}`, { extensions: { code: 'BAD_USER_INPUT' } });
  }
  return new ObjectId(raw);
}

// GraphQL inputs may carry explicit nulls for omitted optional fields; treat them as absent
// so the Zod defaults apply.
const dropNulls = <T extends object>(o: T) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null));

export function validate<S extends ZodTypeAny>(schema: S, input: object): z.output<S> {
  try {
    return schema.parse(dropNulls(input));
  } catch (err) {
    if (err instanceof ZodError) {
      throw createGraphQLError('Invalid input', {
        extensions: { code: 'VALIDATION_ERROR', details: err.flatten() },
      });
    }
    throw err;
  }
}
