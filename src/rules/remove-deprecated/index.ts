import {RuleProcessorT} from '../../core/rules/processor-models';
import {z} from 'zod';
import {normalizeMethod} from '../common/utils/normilizers';
import {parameterInConfigSchema} from '../common/config';
import {checkIsRefSchema} from '../common/utils/refs';
import {forEachOperation} from "../common/utils/iterators/each-operation";
import {forEachSchema} from "../common/utils/iterators/each-schema";
import {checkIsObjectSchema} from "../common/utils/object-schema";

type EndpointT = {
    path: string;
    method: string;
};

const normalizeEndpoint = (endpoint: EndpointT): EndpointT => {
    return {
        ...endpoint,
        method: normalizeMethod(endpoint.method),
    };
};

const descriptorSchema = z
    .object({
        type: z.literal('component-schema'),
        componentName: z.string(),
    })
    .strict()
    .or(
        z
            .object({
                type: z.literal('endpoint-response'),
                path: z.string(),
                method: z.string(),
                code: z.string(),
                contentType: z.string(),
            })
            .strict()
    )
    .or(
        z
            .object({
                type: z.literal('endpoint-parameter'),
                path: z.string(),
                method: z.string(),
                parameterName: z.string(),
                parameterIn: parameterInConfigSchema,
            })
            .strict()
    )
    .or(
        z
            .object({
                type: z.literal('endpoint-request-body'),
                path: z.string(),
                method: z.string(),
                contentType: z.string(),
            })
            .strict()
    )
    .or(
        z
            .object({
                type: z.literal('endpoint'),
                path: z.string(),
                method: z.string(),
            })
            .strict()
    );

type Descriptor = z.infer<typeof descriptorSchema>;

const configSchema = z
    .object({
        ignore: z.array(descriptorSchema).optional(),
    })
    .strict();

const processor: RuleProcessorT<typeof configSchema> = {
    configSchema,
    defaultConfig: {},
    processDocument: (openAPIFile, config, logger) => {
        const {ignore} = config;

        const componentSchemas = openAPIFile.document?.components?.schemas;
        Object.keys(componentSchemas || {}).forEach((name) => {
            const schema = componentSchemas?.[name];
            if (checkIsRefSchema(schema)) {
                return;
            }

            if (schema?.deprecated && componentSchemas) {
                logger.trace(`Deleted component - "${name}"`);
                delete componentSchemas[name];
            }
        });

        forEachSchema(openAPIFile, (schema) => {
            if (checkIsObjectSchema(schema)) {
                const properties = schema?.properties || {};
                Object.keys(properties).forEach((propertyKey) => {
                    const propertySchema = properties[propertyKey];

                    if (!checkIsRefSchema(propertySchema) && propertySchema?.deprecated) {
                        logger.trace(`Deleted property - "${propertyKey}"`);
                        delete properties[propertyKey];
                    }
                });
            }
        });

        forEachOperation(openAPIFile, ({operationSchema, method, path}) => {
            const endpoint = normalizeEndpoint({
                path,
                method,
            });

            const pathObjSchema = openAPIFile?.document?.paths?.[path];

            if (operationSchema.deprecated && pathObjSchema) {
                logger.trace(`Deleted endpoint - "${JSON.stringify(endpoint)}"`);
                delete pathObjSchema[method];
            }

            if (operationSchema?.parameters) {
                operationSchema.parameters = operationSchema.parameters.filter((parameter) => {
                    if (!checkIsRefSchema(parameter) && parameter?.deprecated) {
                        logger.trace(`Deleted parameter - "${JSON.stringify(parameter)}"`);
                        return false;
                    }

                    return true;
                })
            }
        });

        return openAPIFile;
    },
};

export default processor;
export {configSchema};
