import {SchemaObject} from '../openapi-models';

export const checkIsObjectSchema = (schema: any): schema is SchemaObject => {
    return !!schema && typeof schema === 'object' && 'type' in schema && schema.type === 'object';
};
