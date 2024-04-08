import { RuleProcessorT } from '../../core/rules/processor-models';
import { z } from 'zod';
import { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import {endpointDescriptorConfigSchema, parameterDescriptorConfigSchema} from "../base/utils/descriptors";
import { normalizeMethod} from '../base/utils/normilizers';

type PathItemObject = OpenAPIV3.PathItemObject | OpenAPIV3_1.PathItemObject;
type HttpMethods = OpenAPIV3.HttpMethods | OpenAPIV3_1.HttpMethods;

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

    // @ts-expect-error bad OpenApi types
    const pathObj: PathItemObject = openAPIFile?.document?.paths?.[endpointDescriptor.path];

    const targetMethod = Object.keys(pathObj || {}).find((pathMethod) => {
      return normalizeMethod(pathMethod) === normalizeMethod(endpointDescriptor.method);
    });

    const endpointSchema = pathObj[targetMethod as HttpMethods];
    if (!endpointSchema) {
      logger.warning(`Not found endpoint: ${JSON.stringify(endpointDescriptor)}`);
      return openAPIFile;
    }

    if (!parameterDescriptor) {
      logger.warning(`Empty parameterDescriptor: ${JSON.stringify(parameterDescriptor)}`);
      return openAPIFile;
    }

    const targetParameterIndex = endpointSchema.parameters?.findIndex((parameter) => {
      return 'name' in parameter && parameter.name === parameterDescriptor?.name && parameter.in === parameterDescriptor?.in;
    });

    if (targetParameterIndex === -1 || typeof targetParameterIndex !== 'number') {
      logger.warning(`Not found parameter: ${JSON.stringify(endpointDescriptor)}`);
      return openAPIFile;
    }

    endpointSchema.parameters?.splice(targetParameterIndex, 1);

    return openAPIFile;
  },
};

export default processor;
