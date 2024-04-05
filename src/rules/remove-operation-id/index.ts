import {
    RuleProcessorT
} from "../../core/rules/processor-models";
import {
    z
} from 'zod';
import {
    forEachOperation,
} from '../base/utils';

const configSchema = z.object({
    ignore: z.array(z.string()),
});

const processor: RuleProcessorT < typeof configSchema > = {
    configSchema,
    defaultConfig: {
        ignore: [],
    },
    processDocument: (openAPIFile, config, logger) => {
        const ignoreOperationIds = config.ignore;
        const usageIgnoreOperationIds: Array < number > = [];


        forEachOperation(openAPIFile, (operation) => {
            if (operation?.operationId) {
                const ignoreOperationIdIndex = ignoreOperationIds.indexOf(operation.operationId)
                if (ignoreOperationIdIndex === -1) {
                    delete operation.operationId;
                } else {
                    usageIgnoreOperationIds[ignoreOperationIdIndex] = (usageIgnoreOperationIds[ignoreOperationIdIndex] || 0) + 1;
                }
            }
        })


        if (ignoreOperationIds?.length) {
            const notUsedIgnoreOperationIds = ignoreOperationIds.filter(
                (_, index) => {
                    return !usageIgnoreOperationIds[index]
                },
            );

            if (notUsedIgnoreOperationIds?.length) {
                logger.warning(`Not used ignore operation id: ${notUsedIgnoreOperationIds.join(', ')}`);
            }
        }

        return openAPIFile;
    }
}

export default processor;