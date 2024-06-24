import {RuleProcessorT} from '../../core/rules/processor-models';
import {z} from 'zod';
import {normalizeMethod} from '../common/utils/normilizers';
import {patchSchema} from '../common/utils/patch';
import {openAPISchemaConfigSchema, parameterInConfigSchema, patchMethodConfigSchema} from '../common/config';
import {checkIsHttpMethod} from '../common/openapi-models';
import {checkIsRefSchema} from '../common/utils/refs';
import {getOperationSchema} from '../common/utils/get-operation-schema';
import {findParameterIndex} from '../common/utils/find-parameter-index';

const getObjectPath = <SourceObject = any, Value = any>(
    sourceObject: SourceObject,
    path: string | Array<string> | undefined,
): Value => {
    if (!path) {
        throw new Error('Not valid path');
    }

    const pathKeys = Array.isArray(path) ? path : path.split('.');

    // @ts-expect-error
    let resultObject = sourceObject[pathKeys[0]] || null;

    if (sourceObject && pathKeys.length > 1) {
        return getObjectPath(resultObject, pathKeys.slice(1));
    }

    return resultObject;
}

const setObjectProp = <SourceObject = any, Value = any>(
    sourceObject: SourceObject,
    path: string | Array<string> | undefined,
    value: Value,
): void => {
    if (!path) {
        throw new Error('Not valid path');
    }

    const pathKeys = Array.isArray(path) ? path : path.split('.');

    if (pathKeys.length > 1) {
        // @ts-expect-error
        if (!sourceObject[pathKeys[0]]) {
            throw new Error('Not valid path');
        }

        // @ts-expect-error
        return setObjectProp(sourceObject[pathKeys[0]], pathKeys.slice(1), value);
    }

    if (pathKeys[0]) {
        // @ts-expect-error
        sourceObject[pathKeys[0]] = value;
    }
}

const descriptorSchema = z
    .object({
        type: z.literal('component-schema'),
        componentName: z.string(),
        correction: z.string().optional(),
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
                correction: z.string().optional(),
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
                correction: z.string().optional(),
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
                correction: z.string().optional(),
            })
            .strict()
    )
    .or(
        z
            .object({
                type: z.literal('endpoint'),
                path: z.string(),
                method: z.string(),
                correction: z.string().optional(),
            })
            .strict()
    );

type Descriptor = z.infer<typeof descriptorSchema>;

const configSchema = z.array(
    z
        .object({
            patchMethod: patchMethodConfigSchema,
            descriptor: descriptorSchema,
            schemaDiff: openAPISchemaConfigSchema,
        })
        .strict()
);

const processor: RuleProcessorT<typeof configSchema> = {
    configSchema,
    defaultConfig: [],
    processDocument: (openAPIFile, config, logger) => {
        // after the merge with the default value of the object, you will get an array,
        // so it is better to additionally check for the length of the array
        if (!Array.isArray(config) || !config?.length) {
            logger.error(new Error('Config should be not empty array!'), 'Config should be not empty array!');
            return openAPIFile;
        }

        config.forEach((configItem) => {
            const {descriptor, patchMethod, schemaDiff} = configItem;

            switch (descriptor.type) {
                case 'component-schema': {
                    const {componentName, correction} = descriptor;

                    const componentSchemas = openAPIFile?.document?.components?.schemas;
                    if (componentSchemas?.[componentName]) {
                        if (correction) {
                            setObjectProp(
                                componentSchemas?.[componentName],
                                correction,
                                patchSchema(
                                    logger,
                                    getObjectPath(componentSchemas[componentName], correction),
                                    patchMethod,
                                    schemaDiff,
                                ),
                            );
                        } else {
                            componentSchemas[componentName] = patchSchema(logger, componentSchemas[componentName], patchMethod, schemaDiff);
                        }
                    } else {
                        logger.warning(`Not found component with descriptor: ${JSON.stringify(descriptor)}!`);
                    }

                    break;
                }
                case 'endpoint': {
                    const pathObjSchema = openAPIFile?.document?.paths?.[descriptor.path];
                    const methods = Object.keys(pathObjSchema || {}).filter(checkIsHttpMethod);

                    const targetMethod = methods.find((pathMethod) => {
                        return normalizeMethod(pathMethod) === normalizeMethod(descriptor.method);
                    });
                    if (!targetMethod) {
                        logger.warning(`Not found endpoint (same path and method) with descriptor: ${JSON.stringify(descriptor)}!`);
                        break;
                    }

                    const endpointSchema = pathObjSchema?.[targetMethod];
                    if (endpointSchema) {
                        pathObjSchema[targetMethod] = patchSchema(logger, endpointSchema, patchMethod, schemaDiff);
                    } else {
                        logger.warning(`Not found endpoint (same method) with descriptor: ${JSON.stringify(descriptor)}!`);
                    }

                    break;
                }
                case 'endpoint-parameter': {
                    const operationSchema = getOperationSchema(openAPIFile, descriptor.path, descriptor.method);
                    if (!operationSchema) {
                        logger.warning(`Not found endpoint (same path) with descriptor: ${JSON.stringify(descriptor)}!`);
                        break;
                    }

                    const parameterIndex = findParameterIndex(operationSchema.parameters, descriptor.parameterName, descriptor.parameterIn);
                    if (parameterIndex === null) {
                        logger.warning(`Not found parameter (same parameter name and in) with descriptor: ${JSON.stringify(descriptor)}!`);
                        break;
                    }

                    const paramater = operationSchema.parameters?.[parameterIndex];
                    if (paramater && !checkIsRefSchema(paramater)) {
                        paramater.schema = patchSchema(logger, paramater.schema, patchMethod, schemaDiff);
                    }

                    break;
                }
                case 'endpoint-response': {
                    const operationSchema = getOperationSchema(openAPIFile, descriptor.path, descriptor.method);
                    if (!operationSchema) {
                        logger.warning(`Not found endpoint (same method) with descriptor: ${JSON.stringify(descriptor)}!`);
                        break;
                    }

                    const responseSchema = operationSchema.responses?.[descriptor.code];
                    if (checkIsRefSchema(responseSchema)) {
                        logger.warning(`responseSchema is ref: ${JSON.stringify(descriptor)}!`);
                        break;
                    }

                    const responseContentSchema = responseSchema?.content?.[descriptor.contentType] || null;
                    if (!responseContentSchema) {
                        logger.warning(`Not found endpoint (same code and contentType) with descriptor: ${JSON.stringify(descriptor)}!`);
                        break;
                    }

                    responseContentSchema.schema = patchSchema(logger, responseContentSchema.schema, patchMethod, schemaDiff);

                    break;
                }
                case 'endpoint-request-body': {
                    const operationSchema = getOperationSchema(openAPIFile, descriptor.path, descriptor.method);
                    if (!operationSchema) {
                        logger.warning(`Not found endpoint (same path) with descriptor: ${JSON.stringify(descriptor)}!`);
                        break;
                    }

                    const requestBodySchema = operationSchema?.requestBody;
                    if (checkIsRefSchema(requestBodySchema)) {
                        logger.warning(`requestBodySchema is ref: ${JSON.stringify(descriptor)}!`);
                        break;
                    }
                    const requestBodyContentSchema = requestBodySchema?.content?.[descriptor.contentType] || null;
                    if (!requestBodyContentSchema) {
                        logger.warning(`Not found endpoint (same requestBody) with descriptor: ${JSON.stringify(descriptor)}!`);
                        break;
                    }

                    requestBodyContentSchema.schema = patchSchema(logger, requestBodyContentSchema.schema, patchMethod, schemaDiff);

                    break;
                }
                default: {
                    logger.warning(`Unknown descriptor type: ${JSON.stringify(descriptor)}`);
                    break;
                }
            }
        });

        return openAPIFile;
    },
};

export default processor;
export {configSchema};
