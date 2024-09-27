import {RuleProcessorT} from '../../core/rules/processor-models';
import {z} from 'zod';
import {patchSchema} from '../common/utils/patch';
import {
    anyComponentWithCorrectionDescriptorConfigSchema,
    componentDescriptorConfigSchema,
    openAPISchemaConfigSchema,
    patchMethodConfigSchema,
    simpleComponentDescriptorConfigSchema
} from '../common/config';
import {getObjectPath, setObjectProp} from '../common/utils/object-path';
import {parseAnyComponentWithCorrectionDescriptor} from "../common/utils/config/parse-component-descriptor";

const configSchema = z
    .object({
        descriptor: anyComponentWithCorrectionDescriptorConfigSchema.optional(),
        patchMethod: patchMethodConfigSchema.optional(),
        schemaDiff: openAPISchemaConfigSchema.optional(),
    })
    .strict();

const processor: RuleProcessorT<typeof configSchema> = {
    configSchema,
    defaultConfig: {
        patchMethod: 'deepmerge',
    },
    processDocument: (openAPIFile, config, logger) => {
        const {patchMethod, schemaDiff, descriptor} = config;

        if (!descriptor) {
            logger.errorMessage('Rule not apply: empty descriptor!');
            return openAPIFile;
        }

        const parsedDesciptor = parseAnyComponentWithCorrectionDescriptor(descriptor, logger);
        if (!parsedDesciptor) {
            logger.errorMessage('Rule not apply: failed to parse descriptor!');
            return openAPIFile;
        }

        if (!patchMethod) {
            logger.errorMessage('Rule not apply: empty patchMethod!');
            return openAPIFile;
        }

        if (!schemaDiff) {
            logger.errorMessage('Rule not apply: empty schemaDiff!');
            return openAPIFile;
        }

        const {componentName, correction} = parsedDesciptor;

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

        return openAPIFile;
    },
};

export default processor;
export {configSchema};
