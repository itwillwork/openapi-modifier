import { RuleProcessorT } from '../../core/rules/processor-models';
import { z } from 'zod';
import {OpenAPIV2, OpenAPIV3, OpenAPIV3_1} from 'openapi-types';
import {endpointDescriptorConfigSchema, parameterDescriptorConfigSchema} from "../common/config";
import { normalizeMethod} from '../common/utils/normilizers';
import {HttpMethods, PathItemObject} from "../common/openapi-models";

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

    const methods = Object.keys(pathObj || {}) as Array<HttpMethods>
    const targetMethod = methods.find((pathMethod) => {
      return normalizeMethod(pathMethod) === normalizeMethod(endpointDescriptor.method);
    });

    if (!targetMethod) {
      logger.warning(`Not found method: ${JSON.stringify(endpointDescriptor)}`);
      return openAPIFile;
    } else {
      logger.trace(`targetMethod: ${targetMethod}`);
    }

    const endpointSchema = pathObj[targetMethod];
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
