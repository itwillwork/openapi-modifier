import { RuleProcessorT } from '../../core/rules/processor-models';
import { z } from 'zod';
import { forEachOperation } from '../common/utils/iterators/each-operation';

const configSchema = z
  .object({
    ignore: z.array(z.string()),
  })
  .strict();

const processor: RuleProcessorT<typeof configSchema> = {
  configSchema,
  defaultConfig: {
    ignore: [],
  },
  processDocument: (openAPIFile, config, logger) => {
    const ignoreOperationIds = config.ignore;
    const usageIgnoreOperationIds: Array<number> = [];

    forEachOperation(openAPIFile, ({ operationSchema }) => {
      if (operationSchema?.operationId) {
        const ignoreOperationIdIndex = ignoreOperationIds.indexOf(operationSchema.operationId);
        if (ignoreOperationIdIndex === -1) {
          delete operationSchema.operationId;
        } else {
          usageIgnoreOperationIds[ignoreOperationIdIndex] = (usageIgnoreOperationIds[ignoreOperationIdIndex] || 0) + 1;
        }
      }
    });

    if (ignoreOperationIds?.length) {
      const notUsedIgnoreOperationIds = ignoreOperationIds.filter((_, index) => {
        return !usageIgnoreOperationIds[index];
      });

      if (notUsedIgnoreOperationIds?.length) {
        logger.warning(`Not used ignore operation id: ${notUsedIgnoreOperationIds.join(', ')}`);
      }
    }

    return openAPIFile;
  },
};

export default processor;
export {
  configSchema,
}