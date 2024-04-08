import {RuleProcessorT} from '../../core/rules/processor-models';
import {string, z} from 'zod';
import {forEachOperation} from '../common/utils/iterators/each-operation';
import deepmerge from 'deepmerge';
import {OpenAPIFileT} from '../../openapi';
import {OpenAPIV3, OpenAPIV3_1} from 'openapi-types';
import {patchSchema} from "../common/utils/patch";
import {
    openAPISchemaConfigSchema,
    patchMethodConfigSchema,
    parameterInConfigSchema,
    endpointDescriptorConfigSchema,
    parameterDescriptorConfigSchema,
} from '../common/config';
import {normalizeMethod} from '../common/utils/normilizers';
import {HttpMethods, PathItemObject} from "../common/openapi-models";

const configSchema = z.object({
    endpointDescriptor: endpointDescriptorConfigSchema.optional(),
    parameterDescriptor: parameterDescriptorConfigSchema.optional(),
    patchMethod: patchMethodConfigSchema.optional(),
    schemaDiff: openAPISchemaConfigSchema.optional(),
    objectDiff: z.object({
        name: z.string().optional(),
        in: parameterInConfigSchema.optional(),
        required: z.boolean().optional(),
    }).optional(),
});

const processor: RuleProcessorT<typeof configSchema> = {
    configSchema,
    defaultConfig: {},
    processDocument: (openAPIFile, config, logger) => {
        const {endpointDescriptor, parameterDescriptor, patchMethod, schemaDiff, objectDiff} = config;

        if (!endpointDescriptor) {
            logger.warning(`Empty descriptor: ${JSON.stringify(endpointDescriptor)}`);
            return openAPIFile;
        }

        // @ts-expect-error bad OpenApi types
        const pathObj: PathItemObject = openAPIFile?.document?.paths?.[endpointDescriptor.path];

        const methods = Object.keys(pathObj || {}) as Array<HttpMethods>;

        const targetMethod = methods.find((pathMethod) => {
            return normalizeMethod(pathMethod) === normalizeMethod(endpointDescriptor.method);
        });

        if (!targetMethod) {
            logger.warning(`Empty targetMethod, not found endpoint: ${JSON.stringify(endpointDescriptor)}`);
            return openAPIFile;
        }

        const endpointSchema = pathObj[targetMethod];
        if (!endpointSchema) {
            logger.warning(`Empty endpointSchema, not found endpoint: ${JSON.stringify(endpointDescriptor)}`);
            return openAPIFile;
        }

        if (!parameterDescriptor) {
            logger.warning(`Empty parameterDescriptor, not found endpoint: ${JSON.stringify(parameterDescriptor)}`);
            return openAPIFile;
        }

        const targetParameter = endpointSchema.parameters?.find((parameter) => {
            return 'name' in parameter && parameter.name === parameterDescriptor?.name && parameter.in === parameterDescriptor?.in;
        });

        if (!targetParameter) {
            logger.warning(`Not found parameter: ${JSON.stringify(endpointDescriptor)}`);
            return openAPIFile;
        }

        if ('$ref' in targetParameter) {
            logger.warning(`Descriptor should not refer to links: ${JSON.stringify(endpointDescriptor)}`);
            return openAPIFile;
        }

        targetParameter.schema = patchSchema(
            logger,
            targetParameter.schema,
            patchMethod,
            schemaDiff,
        );

        if (objectDiff?.name !== undefined) {
            targetParameter.name = objectDiff.name;
        }

        if (objectDiff?.in !== undefined) {
            targetParameter.in = objectDiff.in;
        }

        if (objectDiff?.required !== undefined) {
            targetParameter.required = objectDiff.required;
        }

        return openAPIFile;
    },
};

export default processor;
