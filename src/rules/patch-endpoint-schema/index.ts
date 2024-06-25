import {RuleProcessorT} from '../../core/rules/processor-models';
import {z} from 'zod';
import {normalizeMethod} from '../common/utils/normilizers';
import {patchSchema} from '../common/utils/patch';
import {endpointDescriptorConfigSchema, openAPISchemaConfigSchema, patchMethodConfigSchema} from '../common/config';
import {checkIsHttpMethod} from '../common/openapi-models';
import {getObjectPath, setObjectProp} from '../common/utils/object-path';

const configSchema = z
    .object({
        endpointDescriptor: endpointDescriptorConfigSchema.optional(),
        descriptor: z.object({
            correction: z.string().optional(),
        }).strict().optional(),
        patchMethod: patchMethodConfigSchema.optional(),
        schemaDiff: openAPISchemaConfigSchema.optional(),
    })
    .strict();

const processor: RuleProcessorT<typeof configSchema> = {
    configSchema,
    defaultConfig: {},
    processDocument: (openAPIFile, config, logger) => {
        const {patchMethod, schemaDiff, descriptor, endpointDescriptor} = config;
        if (!endpointDescriptor || !patchMethod || !schemaDiff) {
            return openAPIFile;
        }

        const pathObjSchema = openAPIFile?.document?.paths?.[endpointDescriptor.path];
        const methods = Object.keys(pathObjSchema || {}).filter(checkIsHttpMethod);

        const targetMethod = methods.find((pathMethod) => {
            return normalizeMethod(pathMethod) === normalizeMethod(endpointDescriptor.method);
        });
        if (!targetMethod) {
            logger.warning(`Not found endpoint (same path and method) with descriptor: ${JSON.stringify(descriptor)}!`);
            return openAPIFile;
        }

        const endpointSchema = pathObjSchema?.[targetMethod];
        if (endpointSchema) {
            if (descriptor?.correction) {
                setObjectProp(
                    pathObjSchema[targetMethod],
                    descriptor.correction,
                    patchSchema(
                        logger,
                        getObjectPath(pathObjSchema[targetMethod], descriptor.correction),
                        patchMethod,
                        schemaDiff,
                    ),
                );
            } else {
                pathObjSchema[targetMethod] = patchSchema(logger, endpointSchema, patchMethod, schemaDiff);
            }
        } else {
            logger.warning(`Not found endpoint (same method) with descriptor: ${JSON.stringify(descriptor)}!`);
        }

        return openAPIFile;
    },
};

export default processor;
export {configSchema};
