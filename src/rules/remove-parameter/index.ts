import { RuleProcessorT } from '../../core/rules/processor-models';
import { z } from 'zod';
import { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';

type PathItemObject = OpenAPIV3.PathItemObject | OpenAPIV3_1.PathItemObject;
type HttpMethods = OpenAPIV3.HttpMethods | OpenAPIV3_1.HttpMethods;

const configSchema = z.object({
  descriptor: z
    .object({
      path: z.string(),
      method: z.string(),
    })
    .optional(),
  parameterDescriptor: z
    .object({
      name: z.string(),
      in: z.string(),
    })
    .optional(),
});

// TODO refactoring, move to utils
const normalizeMethod = (rawMethod: string): string => rawMethod.toLowerCase();

const processor: RuleProcessorT<typeof configSchema> = {
  configSchema,
  defaultConfig: {},
  processDocument: (openAPIFile, config, logger) => {
    const { descriptor, parameterDescriptor } = config;

    if (!descriptor) {
      logger.warning(`Empty descriptor: ${JSON.stringify(descriptor)}`);
      return openAPIFile;
    }

    // @ts-expect-error bad OpenApi types
    const pathObj: PathItemObject = openAPIFile?.document?.paths?.[descriptor.path];

    const targetMethod = Object.keys(pathObj || {}).find((pathMethod) => {
      return normalizeMethod(pathMethod) === normalizeMethod(descriptor.method);
    });

    const endpointSchema = pathObj[targetMethod as HttpMethods];
    if (!endpointSchema) {
      logger.warning(`Not found endpoint: ${JSON.stringify(descriptor)}`);
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
      logger.warning(`Not found parameter: ${JSON.stringify(descriptor)}`);
      return openAPIFile;
    }

    endpointSchema.parameters?.splice(targetParameterIndex, 1);

    return openAPIFile;
  },
};

export default processor;
