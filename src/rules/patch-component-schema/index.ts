import {RuleProcessorT} from '../../core/rules/processor-models';
import {z} from 'zod';
import {patchSchema} from '../common/utils/patch';
import {openAPISchemaConfigSchema, patchMethodConfigSchema} from '../common/config';
import {getObjectPath, setObjectProp} from '../common/utils/object-path';

const configSchema = z
    .object({
        descriptor: z.object({
            componentName: z.string(),
            correction: z.string().optional(),
        }).strict().optional(),
        patchMethod: patchMethodConfigSchema.optional(),
        schemaDiff: openAPISchemaConfigSchema.optional(),
    })
    .strict();

const processor: RuleProcessorT<typeof configSchema> = {
    configSchema,
    defaultConfig: {
        patchMethod: 'merge',
    },
    processDocument: (openAPIFile, config, logger) => {
        const {patchMethod, schemaDiff, descriptor} = config;
        if (!descriptor || !patchMethod || !schemaDiff) {
            return openAPIFile;
        }

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

        return openAPIFile;
    },
};

export default processor;
export {configSchema};
