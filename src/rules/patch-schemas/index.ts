import {
    RuleProcessorT
} from "../../core/rules/processor-models";
import {
    z
} from 'zod';
import {
    forEachOperation,
} from '../base/utils';
import deepmerge from 'deepmerge';

const descriptorSchema = z
    .object({
        type: z.literal("component"),
        componentName: z.string(),
    })
    .or(
        z.object({
            type: z.literal("endpoint-response"),
            path: z.string(),
            method: z.string(),
            code: z.string(),
            contentType: z.string(),
        })
    ).or(
        z.object({
            type: z.literal("endpoint-parameter"),
            path: z.string(),
            method: z.string(),
            parameterName: z.string(),
        })
    ).or(
        z.object({
            type: z.literal("endpoint-request-body"),
            path: z.string(),
            method: z.string(),
            contentType: z.string(),
        })
    ).or(
        z.object({
            type: z.literal("endpoint"),
            path: z.string(),
            method: z.string(),
        })
    )

type Descriptor = z.infer<typeof descriptorSchema>;

const methodSchema = z.union([
    z.literal("merge"),
    z.literal("replace"),
]).optional();

type Method = z.infer<typeof methodSchema>;

const configSchema = z.array(
    z.object({
        method: methodSchema,
        descriptor: descriptorSchema,
        schemaDiff: z.any(),
    }),
);

/*
components.schemas[name]
paths[name][method].parameters[parameterIndex].schema
paths[name][method].responses[code].content[contentType].schema
paths[name][method].requestBody.content[contentType].schema
paths[name][method]
 */

type SchemaT = any;

const processor: RuleProcessorT<typeof configSchema> = {
    configSchema,
    defaultConfig: [],
    processDocument: (openAPIFile, config, logger) => {
        config.forEach((configItem) => {
            const {descriptor, method, schemaDiff} = configItem;

            const patchSchema = (sourceSchema: SchemaT, method: Method, ...otherSchemas: Array<SchemaT>) => {
                if (!otherSchemas?.length) {
                    return sourceSchema;
                }

                return otherSchemas.reduce((acc, otherSchema) => {
                    switch (method) {
                        case "merge": {
                            return deepmerge(sourceSchema, otherSchema);
                            break;
                        }
                        case "replace": {
                            return {
                                ...acc,
                                ...otherSchema,
                            }
                            break;
                        }
                        default: {
                            logger.warning(`Unknown method type: ${method}`);
                            return acc;
                            break;
                        }
                    }

                    return acc;
                }, sourceSchema);
            }

            switch (descriptor.type) {
                case "component": {
                    const {componentName} = descriptor;

                    const componentSchemas = openAPIFile?.document?.components?.schemas;
                    if (componentSchemas?.[componentName]) {
                        componentSchemas[componentName] = patchSchema(
                            componentSchemas[componentName],
                            method,
                            schemaDiff,
                        );
                    } else {
                        logger.warning(`Not found component with name: ${componentName}!`);
                    }

                    break;
                }
                case "endpoint": {
                    break;
                }
                case "endpoint-parameter": {
                    break;
                }
                case "endpoint-response": {
                    break
                }
                case "endpoint-request-body": {
                    break
                }
                default: {
                    logger.warning(`Unknown descriptor type: ${JSON.stringify(descriptor)}`);
                    break;
                }
            }
        });

        return openAPIFile;
    }
}

export default processor;