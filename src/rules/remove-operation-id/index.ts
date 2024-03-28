import {RuleProcessorT} from "../../core/rules/processor-models";
import {z} from 'zod';

const configSchema = z.object({
    ignoreOperationIds: z.array(z.string()),
});

const processor: RuleProcessorT<typeof configSchema> = {
    configSchema,
    defaultConfig: {
        ignoreOperationIds: [],
    },
    processDocument: (openAPIFile, config, logger) => {
        logger.warning('Test!');

        return openAPIFile;
    }
}

export default processor;
