import { OpenAPIFileT } from '../../../../openapi';
import {
  checkIsHttpMethod,
  ComponentsObject,
  HttpMethods,
  OperationObject,
  ReferenceObject,
  SchemaObject
} from '../../openapi-models';

type ComponentCallbackParamsT = {
  schema: SchemaObject | ReferenceObject | null;
  name: string;
};

type ComponentCallbackT = (params: ComponentCallbackParamsT) => void;

export const forEachComponent = (openAPIFile: OpenAPIFileT, callback: ComponentCallbackT) => {
  const componentSchemas = openAPIFile.document?.components?.schemas;

  Object.keys(componentSchemas || {}).forEach((name) => {
    callback({
      name,
      schema: componentSchemas?.[name] || null,
    });
  });
};
