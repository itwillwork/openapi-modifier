import { ArraySchemaObject } from '../openapi-models';

export const checkIsArraySchema = (schema: any): schema is ArraySchemaObject => {
  return !!schema && typeof schema === 'object' && 'type' in schema && schema.type === 'array' && 'items' in schema && !!schema.items;
};
