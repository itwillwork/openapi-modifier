import {RuleProcessorT} from '../../core/rules/processor-models';
import {string, z} from 'zod';
import {forEachOperation} from '../base/utils/iterators';
import deepmerge from 'deepmerge';
import {OpenAPIFileT} from '../../openapi';
import {OpenAPIV3, OpenAPIV3_1} from 'openapi-types';
import {openAPISchemaConfigSchema, patchMethodConfigSchema, patchSchema} from "../base/utils/patch";
import {normalizeMethod} from '../base/utils/normilizers';
import {parameterInConfigSchema} from "../base/utils/descriptors";

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
    defaultConfig: {
    },
    processDocument: (openAPIFile, config, logger) => {
        const {descriptor, parameterDescriptor, patchMethod, schemaDiff, objectDiff} = config;

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

        const targetParameter = endpointSchema.parameters?.find((parameter) => {
            return 'name' in parameter && parameter.name === parameterDescriptor?.name && parameter.in === parameterDescriptor?.in;
        });

        if (!targetParameter) {
            logger.warning(`Not found parameter: ${JSON.stringify(descriptor)}`);
            return openAPIFile;
        }

        if ('$ref' in targetParameter) {
            logger.warning(`Descriptor should not refer to links: ${JSON.stringify(descriptor)}`);
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
