import { RuleProcessorT } from '../../core/rules/processor-models';
import { string, z } from 'zod';
import { forEachOperation } from '../common/utils/iterators/each-operation';
import deepmerge from 'deepmerge';
import { OpenAPIFileT } from '../../openapi';
import { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import { patchSchema } from '../common/utils/patch';
import { openAPISchemaConfigSchema, patchMethodConfigSchema, parameterInConfigSchema, endpointDescriptorConfigSchema, parameterDescriptorConfigSchema } from '../common/config';
import { normalizeMethod } from '../common/utils/normilizers';
import { HttpMethods, PathItemObject } from '../common/openapi-models';
import { getOperationSchema } from '../common/utils/get-operation-schema';
import { findParameterIndex } from '../common/utils/find-parameter-index';
import { checkIsRefSchema } from '../common/utils/refs';
import {getObjectPath, setObjectProp} from "../common/utils/object-path";

const configSchema = z
  .object({
    endpointDescriptor: endpointDescriptorConfigSchema.optional(),
    parameterDescriptor: z.object({
        name: z.string(),
        in: parameterInConfigSchema,
        correction: z.string().optional(),
    }).strict().optional(),
    patchMethod: patchMethodConfigSchema.optional(),
    schemaDiff: openAPISchemaConfigSchema.optional(),
    objectDiff: z
      .object({
        name: z.string().optional(),
        in: parameterInConfigSchema.optional(),
        required: z.boolean().optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

const processor: RuleProcessorT<typeof configSchema> = {
  configSchema,
  defaultConfig: {},
  processDocument: (openAPIFile, config, logger) => {
    const { endpointDescriptor, parameterDescriptor, patchMethod, schemaDiff, objectDiff } = config;

    if (!endpointDescriptor) {
      logger.trace(`Empty descriptor: ${JSON.stringify(endpointDescriptor)}`);

      const componentParameterSchemas = openAPIFile?.document?.components?.parameters || {};
      const targetComponentParameterKey = Object.keys(componentParameterSchemas || {}).find((key) => {
        const componentParameterSchema = componentParameterSchemas[key];
        if (checkIsRefSchema(componentParameterSchema)) {
          return false;
        }

        if (componentParameterSchema.name === parameterDescriptor?.name && componentParameterSchema.in === parameterDescriptor?.in) {
          return true;
        }
      });

      if (!targetComponentParameterKey) {
        return openAPIFile;
      }

      const targetComponentParameter = componentParameterSchemas[targetComponentParameterKey];
      if (!targetComponentParameter || checkIsRefSchema(targetComponentParameter)) {
        return openAPIFile;
      }

      if (!patchMethod) {
        logger.warning(`Required patchMethod!`);
        return openAPIFile;
      }

      targetComponentParameter.schema = patchSchema(logger, targetComponentParameter.schema, patchMethod, schemaDiff);

      if (objectDiff?.name !== undefined) {
        targetComponentParameter.name = objectDiff.name;
      }

      if (objectDiff?.in !== undefined) {
        targetComponentParameter.in = objectDiff.in;
      }

      if (objectDiff?.required !== undefined) {
        targetComponentParameter.required = objectDiff.required;
      }

      return openAPIFile;
    }

    const operationSchema = getOperationSchema(openAPIFile, endpointDescriptor.path, endpointDescriptor.method);
    if (!operationSchema) {
      logger.warning(`Empty operationSchema, not found endpoint: ${JSON.stringify(endpointDescriptor)}`);
      return openAPIFile;
    }

    if (!parameterDescriptor) {
      logger.warning(`Empty parameterDescriptor, not found endpoint: ${JSON.stringify(parameterDescriptor)}`);
      return openAPIFile;
    }

    const targetParameterIndex = findParameterIndex(operationSchema.parameters, parameterDescriptor?.name, parameterDescriptor?.in);
    if (targetParameterIndex === null) {
      logger.warning(`Not found parameter: ${JSON.stringify(endpointDescriptor)}`);
      return openAPIFile;
    }

    const targetParameterSchema = operationSchema.parameters?.[targetParameterIndex];
    if (!targetParameterSchema) {
      logger.warning(`Not found parameter: ${JSON.stringify(endpointDescriptor)}`);
      return openAPIFile;
    }

    if (checkIsRefSchema(targetParameterSchema)) {
      logger.warning(`Descriptor should not refer to links: ${JSON.stringify(endpointDescriptor)}`);
      return openAPIFile;
    }

    if (!patchMethod) {
      logger.warning(`Required patchMethod!`);
      return openAPIFile;
    }

    if (parameterDescriptor.correction) {
      setObjectProp(
          targetParameterSchema.schema,
          parameterDescriptor.correction,
          patchSchema(
              logger,
              getObjectPath(targetParameterSchema.schema, parameterDescriptor.correction),
              patchMethod,
              schemaDiff,
          ),
      );
    } else {
      targetParameterSchema.schema = patchSchema(logger, targetParameterSchema.schema, patchMethod, schemaDiff);
    }

    if (objectDiff?.name !== undefined) {
      targetParameterSchema.name = objectDiff.name;
    }

    if (objectDiff?.in !== undefined) {
      targetParameterSchema.in = objectDiff.in;
    }

    if (objectDiff?.required !== undefined) {
      targetParameterSchema.required = objectDiff.required;
    }

    return openAPIFile;
  },
};

export default processor;
export { configSchema };
