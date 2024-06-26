import { RuleProcessorT } from '../../core/rules/processor-models';
import { z } from 'zod';
import { forEachSchema } from '../common/utils/iterators/each-schema';
import { checkIsRefSchema } from '../common/utils/refs';

const configSchema = z.object({
  showUnusedWarning: z.boolean().optional(),
}).strict();

const processor: RuleProcessorT<typeof configSchema> = {
  configSchema,
  defaultConfig: {
    showUnusedWarning: false,
  },
  processDocument: (openAPIFile, config, logger) => {
    const { showUnusedWarning } = config;

    let usageCount = 0;

    forEachSchema(openAPIFile, (schema) => {
      if (!checkIsRefSchema(schema) && schema?.minItems !== undefined) {
        delete schema.minItems;
        usageCount += 1;
      }
    });

    if (usageCount === 0 && showUnusedWarning) {
      logger.warning(`Not found schemas with min-items!`)
    }

    return openAPIFile;
  },
};

export default processor;
export { configSchema };
