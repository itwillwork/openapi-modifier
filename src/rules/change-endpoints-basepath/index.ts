import {
    RuleProcessorT
} from "../../core/rules/processor-models";
import {
    z
} from 'zod';
import {
    forEachSchemas,
} from '../base/utils';

const configSchema = z.object({
    fromPrefix: z.string(),
    toPrefix: z.string().optional(),
});

const processor: RuleProcessorT < typeof configSchema > = {
    configSchema,
    defaultConfig: {
        fromPrefix: '',
    },
    processDocument: (openAPIFile, config, logger) => {
        const {
            fromPrefix,
        } = config;
        const toPrefix = config.toPrefix || '';

        let usageCount = 0;

        const paths = openAPIFile.document?.paths;

        Object.keys(paths || {}).forEach((pathKey) => {
            const path = paths?.[pathKey];

            if (pathKey.startsWith(fromPrefix)) {
                usageCount++;

                const preparedPath = pathKey.replace(fromPrefix, toPrefix);

                // TODO refactoring
                if (paths) {
                    paths[preparedPath] = paths[pathKey];
                    delete paths[pathKey];
                }
            }
        });

        if (!usageCount) {
            logger.warning(`Not found endpoints with prefix "${fromPrefix}"`);
        }

        return openAPIFile;
    }
}

export default processor;