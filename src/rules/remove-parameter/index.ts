import { RuleProcessorT } from '../../core/rules/processor-models';
import { z } from 'zod';
import {OpenAPIV2, OpenAPIV3, OpenAPIV3_1} from 'openapi-types';
import {endpointDescriptorConfigSchema, parameterDescriptorConfigSchema} from "../common/config";
import { normalizeMethod} from '../common/utils/normilizers';
import {HttpMethods, PathItemObject} from "../common/openapi-models";
import {getOperationSchema} from "../common/utils/get-operation-schema";

const configSchema = z.object({
  endpointDescriptor: endpointDescriptorConfigSchema.optional(),
  parameterDescriptor: parameterDescriptorConfigSchema.optional(),
});

const processor: RuleProcessorT<typeof configSchema> = {
  configSchema,
  defaultConfig: {},
  processDocument: (openAPIFile, config, logger) => {
    const { endpointDescriptor, parameterDescriptor } = config;

    if (!endpointDescriptor) {
      logger.warning(`Empty endpointDescriptor: ${JSON.stringify(endpointDescriptor)}`);
      return openAPIFile;
    }

    const operationSchema = getOperationSchema(openAPIFile, endpointDescriptor.path, endpointDescriptor.method);
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
