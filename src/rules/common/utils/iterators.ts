import { OpenAPIFileT } from '../../../openapi';
import { z } from 'zod';
import {openAPISchemaConfigSchema} from "../config";

type AnySchemaObject = z.infer<typeof openAPISchemaConfigSchema>;

// TODO remove any
type OperationSchema = any;

type SchemaCallbackT = (schema: AnySchemaObject) => void;

export const forEachSchemas = (openAPIFile: OpenAPIFileT, callback: SchemaCallbackT) => {
  const stack: Array<AnySchemaObject | null | undefined> = [];

  // forEach - components.schemas[name]
  Object.keys(openAPIFile.document?.components?.schemas || {}).forEach((name) => {
    const schema = openAPIFile.document?.components?.schemas?.[name];
    stack.push(schema);
  });

  Object.keys(openAPIFile.document?.paths || {}).forEach((pathName) => {
    Object.keys(openAPIFile.document?.paths?.[pathName] || {}).forEach((method) => {
      // @ts-expect-error bad openapi types
      const methodSchema: PathItemObject = openAPIFile.document?.paths?.[pathName]?.[method];

      // forEach - paths[name][method].parameters[].schema
      const parameters = methodSchema?.parameters || [];

      // TODO remove any
      parameters.forEach((parameter: any) => {
        stack.push(parameter?.schema);
      });

      // forEach - paths[name][method].responses[code].content[contentType].schema
      const responses = methodSchema?.responses || {};
      Object.keys(responses).forEach((code) => {
        const responseSchema = responses[code];

        Object.keys(responseSchema?.content).forEach((contentType) => {
          const responseContentSchema = responseSchema?.content?.[contentType]?.schema;

          stack.push(responseContentSchema);
        });
      });

      // forEach - paths[name][method].requestBody.content[contentType].schema
      const requestBody = methodSchema?.requestBody;
      Object.keys(requestBody?.content || {}).forEach((contentType) => {
        const requestBodyContentSchema = requestBody?.content?.[contentType]?.schema;

        stack.push(requestBodyContentSchema);
      });
    });
  });

  while (stack.length) {
    const item = stack.pop();

    if (item) {
      callback(item);
    }

    if (item.type === 'array' && item.items) {
      stack.push(item.items);
    }

    if (item.type === 'object' && item.properties) {
      Object.keys(item.properties).forEach((propertyKey) => {
        stack.push(item.properties[propertyKey]);
      });
    }

    // TODO remove any
    item.oneOf?.forEach((schema: any) => {
      stack.push(schema);
    });

    // TODO remove any
    item.allOf?.forEach((schema: any) => {
      stack.push(schema);
    });

    // TODO remove any
    item.anyOf?.forEach((schema: any) => {
      stack.push(schema);
    });
  }
};

type OperationCallbackT = (operationSchema: OperationSchema) => void;

export const forEachOperation = (openAPIFile: OpenAPIFileT, callback: OperationCallbackT) => {
  const paths = openAPIFile.document?.paths;

  Object.keys(paths || {}).forEach((pathKey) => {
    const path = paths?.[pathKey];

    Object.keys(path || {}).forEach((method) => {
      // @ts-expect-error bad OpenAPI types!
      const operation = path?.[method];

      callback(operation);
    });
  });
};
