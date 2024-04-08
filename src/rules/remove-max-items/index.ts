import { RuleProcessorT } from '../../core/rules/processor-models';
import { z } from 'zod';
import { forEachSchema } from '../common/utils/iterators/each-schema';

const configSchema = z.object({});

const processor: RuleProcessorT<typeof configSchema> = {
  configSchema,
  defaultConfig: {},
  processDocument: (openAPIFile, config, logger) => {
    forEachSchema(openAPIFile, (schema) => {
      if (schema?.maxItems !== undefined) {
        delete schema.maxItems;
      }
    });

    return openAPIFile;
  },
};

export default processor;
