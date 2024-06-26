import {RuleProcessorT} from '../../core/rules/processor-models';
import {z} from 'zod';
import {patchSchema} from '../common/utils/patch';
import {
    endpointDescriptorConfigSchema,
    endpointRequestBodyDescriptorConfigSchema,
    openAPISchemaConfigSchema,
    patchMethodConfigSchema
} from '../common/config';
import {checkIsRefSchema} from '../common/utils/refs';
import {getOperationSchema} from '../common/utils/get-operation-schema';
import {getObjectPath, setObjectProp} from '../common/utils/object-path';
import {messagesFactory} from "../../logger/messages-factory";

const configSchema = z.object({
    endpointDescriptor: endpointDescriptorConfigSchema.optional(),
    descriptor: endpointRequestBodyDescriptorConfigSchema.optional(),
    descriptorCorrection: z.string().optional(),
    patchMethod: patchMethodConfigSchema.optional(),
    schemaDiff: openAPISchemaConfigSchema.optional(),
});

const processor: RuleProcessorT<typeof configSchema> = {
    configSchema,
    defaultConfig: {},
    processDocument: (openAPIFile, config, logger) => {
        const {patchMethod, schemaDiff, descriptor, descriptorCorrection, endpointDescriptor} = config;

        if (!descriptor) {
            logger.errorMessage(messagesFactory.ruleNotApply.requiredConfigField('descriptor'));
            return openAPIFile;
        }

        if (!endpointDescriptor) {
            logger.errorMessage(messagesFactory.ruleNotApply.requiredConfigField('endpointDescriptor'));
            return openAPIFile;
        }

        if (!patchMethod) {
            logger.errorMessage(messagesFactory.ruleNotApply.requiredConfigField('patchMethod'));
            return openAPIFile;
        }

        if (!schemaDiff) {
            logger.errorMessage(messagesFactory.ruleNotApply.requiredConfigField('schemaDiff'));
            return openAPIFile;
        }

        const {contentType} = descriptor;

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

        if (descriptorCorrection) {
            setObjectProp(
                requestBodyContentSchema.schema,
                descriptorCorrection,
                patchSchema(
                    logger,
                    getObjectPath(requestBodyContentSchema.schema, descriptorCorrection),
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
