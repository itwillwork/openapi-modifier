import {RuleProcessorT} from '../../core/rules/processor-models';
import {z} from 'zod';
import {patchSchema} from '../common/utils/patch';
import {
    endpointDescriptorConfigSchema,
    endpointResponseDescriptorConfigSchema,
    openAPISchemaConfigSchema,
    patchMethodConfigSchema
} from '../common/config';
import {checkIsRefSchema} from '../common/utils/refs';
import {getOperationSchema} from '../common/utils/get-operation-schema';
import {getObjectPath, setObjectProp} from '../common/utils/object-path';
import {messagesFactory} from "../../logger/messages-factory";

const configSchema = z
    .object({
        endpointDescriptor: endpointDescriptorConfigSchema.optional(),
        descriptor: endpointResponseDescriptorConfigSchema.optional(),
        descriptorCorrection: z.string().optional(),
        patchMethod: patchMethodConfigSchema.optional(),
        schemaDiff: openAPISchemaConfigSchema.optional(),
    }).strict();

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
            logger.errorMessage(
                messagesFactory.ruleNotApply.withReason(
                    `Not found endpoint (same code and contentType) with descriptor: ${JSON.stringify(descriptor)}!`
                ),
            );
            return openAPIFile;
        }

        if (descriptorCorrection) {
            setObjectProp(
                responseContentSchema.schema,
                descriptorCorrection,
                patchSchema(
                    logger,
                    getObjectPath(responseContentSchema.schema, descriptorCorrection),
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
