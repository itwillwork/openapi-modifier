import {RuleProcessorT} from '../../core/rules/processor-models';
import {z} from 'zod';
import {patchSchema} from '../common/utils/patch';
import {endpointDescriptorConfigSchema, openAPISchemaConfigSchema, patchMethodConfigSchema} from '../common/config';
import {checkIsRefSchema} from '../common/utils/refs';
import {getOperationSchema} from '../common/utils/get-operation-schema';
import {getObjectPath, setObjectProp} from '../common/utils/object-path';

const configSchema = z
    .object({
        endpointDescriptor: endpointDescriptorConfigSchema.optional(),
        descriptor: z.object({
            code: z.string(),
            contentType: z.string(),
            correction: z.string().optional(),
        }).strict().optional(),
        patchMethod: patchMethodConfigSchema.optional(),
        schemaDiff: openAPISchemaConfigSchema.optional(),
    }).strict();

const processor: RuleProcessorT<typeof configSchema> = {
    configSchema,
    defaultConfig: {},
    processDocument: (openAPIFile, config, logger) => {
        const {patchMethod, schemaDiff, descriptor, endpointDescriptor} = config;
        if (!descriptor || !endpointDescriptor || !patchMethod || !schemaDiff) {
            return openAPIFile;
        }

        const {contentType, correction} = descriptor;

        const operationSchema = getOperationSchema(openAPIFile, endpointDescriptor.path, endpointDescriptor.method);
        if (!operationSchema) {
            logger.warning(`Not found endpoint (same method) with descriptor: ${JSON.stringify(descriptor)}!`);
            return openAPIFile;
        }

        const responseSchema = operationSchema.responses?.[descriptor.code];
        if (checkIsRefSchema(responseSchema)) {
            logger.warning(`responseSchema is ref: ${JSON.stringify(descriptor)}!`);
            return openAPIFile;
        }

        const responseContentSchema = responseSchema?.content?.[descriptor.contentType] || null;
        if (!responseContentSchema) {
            logger.warning(`Not found endpoint (same code and contentType) with descriptor: ${JSON.stringify(descriptor)}!`);
            return openAPIFile;
        }

        if (descriptor.correction) {
            setObjectProp(
                responseContentSchema.schema,
                descriptor.correction,
                patchSchema(
                    logger,
                    getObjectPath(responseContentSchema.schema, descriptor.correction),
                    patchMethod,
                    schemaDiff,
                ),
            );
        } else {
            responseContentSchema.schema = patchSchema(logger, responseContentSchema.schema, patchMethod, schemaDiff);
        }

        return openAPIFile;
    },
};

export default processor;
export {configSchema};
