import { RuleProcessorT } from '../../core/rules/processor-models';
import { string, z } from 'zod';
import { forEachOperation } from '../base/utils/iterators';
import deepmerge from 'deepmerge';
import { OpenAPIFileT } from '../../openapi';
import { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import { normalizeMethod } from '../base/utils/normilizers';
import {patchSchema, patchMethodConfigSchema, openAPISchemaConfigSchema} from '../base/utils/patch';

const descriptorSchema = z
  .object({
    type: z.literal('component-schema'),
    componentName: z.string(),
  })
  .or(
    z.object({
      type: z.literal('endpoint-response'),
      path: z.string(),
      method: z.string(),
      code: z.string(),
      contentType: z.string(),
    })
  )
  .or(
    z.object({
      type: z.literal('endpoint-parameter'),
      path: z.string(),
      method: z.string(),
      parameterName: z.string(),
      parameterIn: z.string(),
    })
  )
  .or(
    z.object({
      type: z.literal('endpoint-request-body'),
      path: z.string(),
      method: z.string(),
      contentType: z.string(),
    })
  )
  .or(
    z.object({
      type: z.literal('endpoint'),
      path: z.string(),
      method: z.string(),
    })
  );

type Descriptor = z.infer<typeof descriptorSchema>;

const configSchema = z.array(
  z.object({
    patchMethod: patchMethodConfigSchema,
    descriptor: descriptorSchema,
    schemaDiff: openAPISchemaConfigSchema,
  })
);

/*
components.schemas[name]
paths[name][method].parameters[parameterIndex].schema
paths[name][method].responses[code].content[contentType].schema
paths[name][method].requestBody.content[contentType].schema
paths[name][method]
 */

type Schema = any;
type PathItemObject = OpenAPIV3.PathItemObject | OpenAPIV3_1.PathItemObject;
type HttpMethods = OpenAPIV3.HttpMethods | OpenAPIV3_1.HttpMethods;

const findPathMethod = (openAPIFile: OpenAPIFileT, path: string, method: string): HttpMethods | null => {
  // @ts-expect-error bad OpenApi types
  const pathObj: PathItemObject = openAPIFile?.document?.paths?.[path];

  const targetMethod = Object.keys(pathObj || {}).find((pathMethod) => {
    return normalizeMethod(pathMethod) === normalizeMethod(method);
  });

  return (targetMethod as HttpMethods) || null;
};

const normalizeParameterIn = (parameterIn: string): string => parameterIn.toLowerCase();

const findParameterIndex = (parameters: PathItemObject['parameters'], parameterName: string, parameterIn: string): number | null => {
  const index = parameters?.findIndex((parameter) => {
    return 'name' in parameter && parameter.name === parameterName && normalizeParameterIn(parameter.in) === normalizeParameterIn(parameterIn);
  });

  return index !== -1 && typeof index === 'number' ? index : null;
};

const processor: RuleProcessorT<typeof configSchema> = {
  configSchema,
  defaultConfig: [],
  processDocument: (openAPIFile, config, logger) => {
    config.forEach((configItem) => {
      const { descriptor, patchMethod, schemaDiff } = configItem;

      switch (descriptor.type) {
        case 'component-schema': {
          const { componentName } = descriptor;

          const componentSchemas = openAPIFile?.document?.components?.schemas;
          if (componentSchemas?.[componentName]) {
            componentSchemas[componentName] = patchSchema(logger, componentSchemas[componentName], patchMethod, schemaDiff);
          } else {
            logger.warning(`Not found component with descriptor: ${JSON.stringify(descriptor)}!`);
          }

          break;
        }
        case 'endpoint': {
          const targetMethod = findPathMethod(openAPIFile, descriptor.path, descriptor.method);
          if (!targetMethod) {
            logger.warning(`Not found endpoint (same path and method) with descriptor: ${JSON.stringify(descriptor)}!`);
            break;
          }

          // @ts-expect-error bad OpenApi types
          const pathObj: PathItemObject = openAPIFile?.document?.paths?.[descriptor.path];

          const endpointSchema = pathObj[targetMethod];
          if (endpointSchema) {
            pathObj[targetMethod] = patchSchema(logger, endpointSchema, patchMethod, schemaDiff);
          } else {
            logger.warning(`Not found endpoint (same method) with descriptor: ${JSON.stringify(descriptor)}!`);
          }

          break;
        }
        case 'endpoint-parameter': {
          const targetMethod = findPathMethod(openAPIFile, descriptor.path, descriptor.method);
          if (!targetMethod) {
            logger.warning(`Not found endpoint (same path and method) with descriptor: ${JSON.stringify(descriptor)}!`);
            break;
          }

          // @ts-expect-error bad OpenApi types
          const pathObj: PathItemObject = openAPIFile?.document?.paths?.[descriptor.path];

          const endpointSchema = pathObj[targetMethod];
          if (!endpointSchema) {
            logger.warning(`Not found endpoint (same path) with descriptor: ${JSON.stringify(descriptor)}!`);
            break;
          }

          const parameterIndex = findParameterIndex(endpointSchema.parameters, descriptor.parameterName, descriptor.parameterIn);
          if (parameterIndex === null) {
            logger.warning(`Not found parameter (same parameter name and in) with descriptor: ${JSON.stringify(descriptor)}!`);
            break;
          }

          // @ts-expect-error bad open api types
          endpointSchema.parameters[parameterIndex].schema = patchSchema(
              logger,
            // @ts-expect-error bad open api types
            endpointSchema.parameters[parameterIndex].schema,
              patchMethod,
            schemaDiff
          );

          break;
        }
        case 'endpoint-response': {
          const targetMethod = findPathMethod(openAPIFile, descriptor.path, descriptor.method);
          if (!targetMethod) {
            logger.warning(`Not found endpoint same path and method) with descriptor: ${JSON.stringify(descriptor)}!`);
            break;
          }

          // @ts-expect-error bad OpenApi types
          const pathObj: PathItemObject = openAPIFile?.document?.paths?.[descriptor.path];

          const endpointSchema = pathObj[targetMethod];
          if (!endpointSchema) {
            logger.warning(`Not found endpoint (same method) with descriptor: ${JSON.stringify(descriptor)}!`);
            break;
          }

          // @ts-expect-error bad OpenApi types
          const responseContentSchema = endpointSchema.responses[descriptor.code]?.content?.[descriptor.contentType] || null;
          if (!responseContentSchema) {
            logger.warning(`Not found endpoint (same code and contentType) with descriptor: ${JSON.stringify(descriptor)}!`);
            break;
          }

          responseContentSchema.schema = patchSchema(logger, responseContentSchema.schema, patchMethod, schemaDiff);

          break;
        }
        case 'endpoint-request-body': {
          const targetMethod = findPathMethod(openAPIFile, descriptor.path, descriptor.method);
          if (!targetMethod) {
            logger.warning(`Not found endpoint (same path and method) with descriptor: ${JSON.stringify(descriptor)}!`);
            break;
          }

          // @ts-expect-error bad OpenApi types
          const pathObj: PathItemObject = openAPIFile?.document?.paths?.[descriptor.path];

          const endpointSchema = pathObj[targetMethod];
          if (!endpointSchema) {
            logger.warning(`Not found endpoint (same path) with descriptor: ${JSON.stringify(descriptor)}!`);
            break;
          }

          // @ts-expect-error bad OpenApi types
          const requestBodyContentSchema = endpointSchema?.requestBody?.content?.[descriptor.contentType] || null;
          if (!requestBodyContentSchema) {
            logger.warning(`Not found endpoint (same requestBody) with descriptor: ${JSON.stringify(descriptor)}!`);
            break;
          }

          requestBodyContentSchema.schema = patchSchema(logger, requestBodyContentSchema.schema, patchMethod, schemaDiff);

          break;
        }
        default: {
          logger.warning(`Unknown descriptor type: ${JSON.stringify(descriptor)}`);
          break;
        }
      }
    });

    return openAPIFile;
  },
};

export default processor;
