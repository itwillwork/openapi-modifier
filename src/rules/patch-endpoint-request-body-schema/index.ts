import {RuleProcessorT} from '../../core/rules/processor-models';
import {z} from 'zod';
import {patchSchema} from '../common/utils/patch';
import {endpointDescriptorConfigSchema, openAPISchemaConfigSchema, patchMethodConfigSchema} from '../common/config';
import {checkIsRefSchema} from '../common/utils/refs';
import {getOperationSchema} from '../common/utils/get-operation-schema';
import {getObjectPath, setObjectProp} from '../common/utils/object-path';

const configSchema = z.object({
    endpointDescriptor: endpointDescriptorConfigSchema.optional(),
    descriptor: z.object({
        contentType: z.string(),
        correction: z.string().optional(),
    }).strict().optional(),
    patchMethod: patchMethodConfigSchema.optional(),
    schemaDiff: openAPISchemaConfigSchema.optional(),
});

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
            logger.warning(`Not found endpoint (same path) with descriptor: ${JSON.stringify(descriptor)}!`);
            return openAPIFile;
        }

        const requestBodySchema = operationSchema?.requestBody;
        if (checkIsRefSchema(requestBodySchema)) {
            logger.warning(`requestBodySchema is ref: ${JSON.stringify(descriptor)}!`);
            return openAPIFile;
        }
        const requestBodyContentSchema = requestBodySchema?.content?.[descriptor.contentType] || null;
        if (!requestBodyContentSchema) {
            logger.warning(`Not found endpoint (same requestBody) with descriptor: ${JSON.stringify(descriptor)}!`);
            return openAPIFile;
        }

        if (descriptor.correction) {
            setObjectProp(
                requestBodyContentSchema.schema,
                descriptor.correction,
                patchSchema(
                    logger,
                    getObjectPath(requestBodyContentSchema.schema, descriptor.correction),
                    patchMethod,
                    schemaDiff,
                ),
            );
        } else {
            requestBodyContentSchema.schema = patchSchema(logger, requestBodyContentSchema.schema, patchMethod, schemaDiff);
        }

        return openAPIFile;
    },
};

export default processor;
export {configSchema};
