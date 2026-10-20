import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';

const RE = /^\d{4}-\d{2}-\d{2}$/;
const check = (v: unknown) => {
  if (typeof v !== 'string' || !RE.test(v)) {
    throw new GraphQLError('ISODate must be a string in YYYY-MM-DD format', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }
  return v;
};

export const ISODate = new GraphQLScalarType<string, string>({
  name: 'ISODate',
  description: 'A calendar date formatted YYYY-MM-DD.',
  serialize: check,
  parseValue: check,
  parseLiteral: (ast) => check(ast.kind === Kind.STRING ? ast.value : null),
});
