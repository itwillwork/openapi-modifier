import {RuleProcessorT} from '../../core/rules/processor-models';
import {z} from 'zod';
import {patchSchema} from '../common/utils/patch';
import {
    anyEndpointDescriptorConfigSchema, correctionConfigSchema,
    endpointDescriptorConfigSchema,
    endpointResponseDescriptorConfigSchema,
    openAPISchemaConfigSchema,
    patchMethodConfigSchema
} from '../common/config';
import {checkIsRefSchema} from '../common/utils/refs';
import {getOperationSchema} from '../common/utils/get-operation-schema';
import {getObjectPath, setObjectProp} from '../common/utils/object-path';
import {messagesFactory} from "../../logger/messages/factory";
import {parseAnyEndpointDescriptor} from "../common/utils/config/parse-endpoint-descriptor";
import {parseSimpleDescriptor} from "../common/utils/config/parse-simple-descriptor";

const configSchema = z
    .object({
        endpointDescriptor: anyEndpointDescriptorConfigSchema.optional(),
        code: z.string().optional(),
        contentType: z.string().optional(),
        correction: correctionConfigSchema.optional(),
        patchMethod: patchMethodConfigSchema.optional(),
        schemaDiff: openAPISchemaConfigSchema.optional(),
    }).strict();

const getDefaultCode = (codes: Array<string>) => {
    return codes?.find(code => /^2/.test(code)) || null;
}

const processor: RuleProcessorT<typeof configSchema> = {
    configSchema,
    defaultConfig: {
        patchMethod: 'merge',
    },
    processDocument: (openAPIFile, config, logger, ruleMeta) => {
        const {patchMethod, schemaDiff, contentType, code, correction, endpointDescriptor} = config;

        if (!endpointDescriptor) {
            logger.errorMessage(messagesFactory.ruleNotApply.requiredConfigField(ruleMeta, 'endpointDescriptor'));
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

        const parsedEndpointDescriptor = parseAnyEndpointDescriptor(endpointDescriptor, logger);
        if (!parsedEndpointDescriptor) {
            logger.errorMessage(messagesFactory.ruleNotApply.failedToParseDescriptor(ruleMeta, 'endpointDescriptor'));
            return openAPIFile;
        }

        const operationSchema = getOperationSchema(openAPIFile, parsedEndpointDescriptor.path, parsedEndpointDescriptor.method);
        if (!operationSchema) {
            logger.errorMessage(
                messagesFactory.ruleNotApply.withReason(
                    ruleMeta,
                    `Not found endpoint (same method) with descriptor: ${JSON.stringify(parsedEndpointDescriptor)}!`
                )
            );
            return openAPIFile;
        }

        const targetResponseCode = code || getDefaultCode(Object.keys(operationSchema.responses || {}));
        if (!targetResponseCode) {
            logger.errorMessage(
                messagesFactory.ruleNotApply.withReason(
                    ruleMeta,
                    `Not found any endpoint code with descriptor: ${JSON.stringify(parsedEndpointDescriptor)}!`
                )
            );
            return openAPIFile;
        }

        const responseSchema = operationSchema.responses?.[targetResponseCode as string];
        if (checkIsRefSchema(responseSchema)) {
            logger.warning(`responseSchema is ref: ${JSON.stringify(code)}!`);
            return openAPIFile;
        }

        const targetResponseContentSchema = responseSchema?.content?.[contentType as string] || null;
        if (contentType && !targetResponseContentSchema) {
            logger.errorMessage(
                messagesFactory.ruleNotApply.withReason(
                    ruleMeta,
                    `Not found endpoint (same code and contentType): ${JSON.stringify(parsedEndpointDescriptor)} ${contentType}`
                ),
            );
            return openAPIFile;
        }

        const responseContentSchemas = targetResponseContentSchema ? [
            targetResponseContentSchema
        ] : Object.values(responseSchema?.content || {})

        responseContentSchemas.forEach((responseContentSchema) => {
            const parsedCorrection = parseSimpleDescriptor(correction, {isContainsName: false})?.correction || null;
            if (parsedCorrection) {
                setObjectProp(
                    responseContentSchema.schema,
                    parsedCorrection,
                    patchSchema(
                        logger,
                        getObjectPath(responseContentSchema.schema, parsedCorrection),
                        patchMethod,
                        schemaDiff,
                    ),
                );
            } else {
                responseContentSchema.schema = patchSchema(logger, responseContentSchema.schema, patchMethod, schemaDiff);
            }
        });

        return openAPIFile;
    },
};

export default processor;
export {configSchema};
