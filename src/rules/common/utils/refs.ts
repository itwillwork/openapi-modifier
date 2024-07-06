import {ReferenceObject, SchemaObject} from '../openapi-models';
import {OpenAPIFileT} from "../../../openapi";

export const checkIsRefSchema = (schema: any): schema is ReferenceObject => {
  return !!schema && typeof schema === 'object' && '$ref' in schema;
};

// TODO improve types
const get = <T>(obj: {}, path: string): T | undefined => {
  const fullPath = path.split(".");

  try {
    const result = fullPath.reduce((acc, pathPart) => {
      // @ts-expect-error
      return acc[pathPart];
    }, obj);

    return result as T;
  } catch (error) {
    return undefined;
  }
};

const preparedRef = (ref: string): string => {
  return ref.replace('#/', '').replace(/\//g, '.');
}

export const resolveRef = (openAPIFile: OpenAPIFileT, referenceObject: ReferenceObject): SchemaObject | undefined => {
  let ref = referenceObject.$ref;

  const isLocalRef = ref.startsWith('#/');
  if (!isLocalRef) {
    throw new Error('Not support resolve not local ref!')
  }

  ref = preparedRef(ref);

  const result = get<SchemaObject>(openAPIFile.document, ref);

  const isRefResult = checkIsRefSchema(result);
  if (isRefResult) {
    return resolveRef(openAPIFile, result);
  }

  return result;
}