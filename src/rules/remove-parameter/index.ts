import { RuleProcessorT } from '../../core/rules/processor-models';
import { z } from 'zod';
import { OpenAPIV2, OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import {
  anyEndpointDescriptorConfigSchema,
  endpointDescriptorConfigSchema,
  endpointParameterDescriptorConfigSchema
} from '../common/config';
import { normalizeMethod } from '../common/utils/normilizers';
import { HttpMethods, PathItemObject } from '../common/openapi-models';
import { getOperationSchema } from '../common/utils/get-operation-schema';
import { checkIsRefSchema } from '../common/utils/refs';
import {parseAnyEndpointDescriptor} from "../common/utils/config/parse-endpoint-descriptor";
import {isNonNil} from "../common/utils/empty";

const configSchema = z
  .object({
    endpointDescriptor: anyEndpointDescriptorConfigSchema.optional(),
    parameterDescriptor: endpointParameterDescriptorConfigSchema.optional(),
  })
  .strict();

const processor: RuleProcessorT<typeof configSchema> = {
  configSchema,
  defaultConfig: {},
  processDocument: (openAPIFile, config, logger) => {
    const { endpointDescriptor, parameterDescriptor } = config;

    if (!endpointDescriptor) {
      logger.trace(`Empty endpointDescriptor: ${JSON.stringify(endpointDescriptor)}`);

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

      if (targetComponentParameterKey) {
        delete componentParameterSchemas[targetComponentParameterKey];
      }

      return openAPIFile;
    }

    const parsedEndpointDescriptor = parseAnyEndpointDescriptor(endpointDescriptor, logger);
    if (!parsedEndpointDescriptor) {
      return openAPIFile;
    }

    const operationSchema = getOperationSchema(openAPIFile, parsedEndpointDescriptor.path, parsedEndpointDescriptor.method);
    if (!operationSchema) {
      logger.warning(`Not found operation: ${JSON.stringify(endpointDescriptor)}`);
      return openAPIFile;
    }

    if (!parameterDescriptor) {
      logger.warning(`Empty parameterDescriptor: ${JSON.stringify(parameterDescriptor)}`);
      return openAPIFile;
    }

    const targetParameterIndex = operationSchema.parameters?.findIndex((parameter) => {
      return 'name' in parameter && parameter.name === parameterDescriptor?.name && parameter.in === parameterDescriptor?.in;
    });

    if (targetParameterIndex === -1 || typeof targetParameterIndex !== 'number') {
      logger.warning(`Not found parameter: ${JSON.stringify(endpointDescriptor)}`);
      return openAPIFile;
    }

    operationSchema.parameters?.splice(targetParameterIndex, 1);

    return openAPIFile;
  },
};

export default processor;
export { configSchema };
