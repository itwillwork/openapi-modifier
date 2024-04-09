import { ReferenceObject } from '../openapi-models';

export const checkIsRefSchema = (schema: any): schema is ReferenceObject => {
  return !!schema && typeof schema === 'object' && '$ref' in schema;
};
