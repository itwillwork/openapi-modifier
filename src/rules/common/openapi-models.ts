import { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';

export type ReferenceObject = OpenAPIV3.ReferenceObject | OpenAPIV3_1.ReferenceObject;
export type SchemaObject = OpenAPIV3.SchemaObject | OpenAPIV3_1.SchemaObject;
export type ArraySchemaObject = OpenAPIV3.ArraySchemaObject | OpenAPIV3_1.ArraySchemaObject;

export type OperationObject = OpenAPIV3.OperationObject | OpenAPIV3_1.OperationObject;

export type PathItemObject = OpenAPIV3.PathItemObject | OpenAPIV3_1.PathItemObject;

export type HttpMethods = OpenAPIV3.HttpMethods | OpenAPIV3_1.HttpMethods;

const httpMethodsSet = new Set<string>(['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace']);

export const checkIsHttpMethod = (method: any): method is HttpMethods => {
  return httpMethodsSet.has(method);
};
