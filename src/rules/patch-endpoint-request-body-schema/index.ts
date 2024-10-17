import {RuleProcessorT} from '../../core/rules/processor-models';
import {z} from 'zod';
import {patchSchema} from '../common/utils/patch';
import {
    anyEndpointDescriptorConfigSchema,
    correctionConfigSchema,
    openAPISchemaConfigSchema,
    patchMethodConfigSchema
} from '../common/config';
import {checkIsRefSchema} from '../common/utils/refs';
import {getOperationSchema} from '../common/utils/get-operation-schema';
import {getObjectPath, setObjectProp} from '../common/utils/object-path';
import {messagesFactory} from "../../logger/messages/factory";
import {parseAnyEndpointDescriptor} from "../common/utils/config/parse-endpoint-descriptor";
import {parseSimpleDescriptor} from "../common/utils/config/parse-simple-descriptor";

const configSchema = z.object({
    endpointDescriptor: anyEndpointDescriptorConfigSchema.optional(),
    contentType: z.string().optional(),
    correction: correctionConfigSchema.optional(),
    patchMethod: patchMethodConfigSchema.optional(),
    schemaDiff: openAPISchemaConfigSchema.optional(),
});

const processor: RuleProcessorT<typeof configSchema> = {
    configSchema,
    defaultConfig: {
        patchMethod: 'merge',
    },
    processDocument: (openAPIFile, config, logger, ruleMeta) => {
        const {patchMethod, schemaDiff, contentType, correction, endpointDescriptor} = config;

        if (!endpointDescriptor) {
            logger.errorMessage(messagesFactory.ruleNotApply.requiredConfigField(ruleMeta, 'endpointDescriptor'));
            return openAPIFile;
        }
        const parsedEndpointDescriptor = parseAnyEndpointDescriptor(endpointDescriptor, logger);
        if (!parsedEndpointDescriptor) {
            logger.errorMessage(messagesFactory.ruleNotApply.failedToParseDescriptor(ruleMeta, 'endpointDescriptor'));
            return openAPIFile;
        }

        if (!patchMethod) {
            logger.errorMessage(messagesFactory.ruleNotApply.requiredConfigField(ruleMeta, 'patchMethod'));
            return openAPIFile;
        }

        if (!schemaDiff) {
            logger.errorMessage(messagesFactory.ruleNotApply.requiredConfigField(ruleMeta, 'schemaDiff'));
            return openAPIFile;
        }

        const operationSchema = getOperationSchema(openAPIFile, parsedEndpointDescriptor.path, parsedEndpointDescriptor.method);
        if (!operationSchema) {
            logger.warning(messagesFactory.ruleNotApply.withReason(ruleMeta, `Not found endpoint (same path) with descriptor: ${JSON.stringify(parsedEndpointDescriptor)}!`));
            return openAPIFile;
        }

        const requestBodySchema = operationSchema?.requestBody;
        if (checkIsRefSchema(requestBodySchema)) {
            logger.warning(messagesFactory.ruleNotApply.withReason(ruleMeta, `requestBodySchema is ref: ${JSON.stringify(endpointDescriptor)}!`));
            return openAPIFile;
        }

        const targetRequestBodyContentSchema = requestBodySchema?.content?.[contentType as string] || null;
        if (contentType && !targetRequestBodyContentSchema) {
            logger.warning(messagesFactory.ruleNotApply.withReason(ruleMeta, `Not found endpoint (same requestBody) with contentType: "${contentType}"!`));
            return openAPIFile;
        }

        const requestBodyContentSchemas = targetRequestBodyContentSchema ? [
            targetRequestBodyContentSchema
        ] : Object.values(requestBodySchema?.content || {})

        requestBodyContentSchemas.forEach((requestBodyContentSchema) => {
            if (!requestBodyContentSchema) {
                return;
            }

            const parsedCorrection = parseSimpleDescriptor(correction, {isContainsName: false})?.correction || null;
            if (parsedCorrection) {
                setObjectProp(
                    requestBodyContentSchema.schema,
                    parsedCorrection,
                    patchSchema(
                        logger,
                        getObjectPath(requestBodyContentSchema.schema, parsedCorrection),
                        patchMethod,
                        schemaDiff,
                    ),
                );
            } else {
                requestBodyContentSchema.schema = patchSchema(logger, requestBodyContentSchema.schema, patchMethod, schemaDiff);
            }
        })


        return openAPIFile;
    },
};

export default processor;
export {configSchema};
