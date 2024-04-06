import { RuleProcessorT } from '../../core/rules/processor-models';
import { z } from 'zod';
import { forEachSchemas } from '../base/utils';

const configSchema = z.object({});

const processor: RuleProcessorT<typeof configSchema> = {
  configSchema,
  defaultConfig: {},
  processDocument: (openAPIFile, config, logger) => {
    forEachSchemas(openAPIFile, (schema) => {
      if (schema?.minItems !== undefined) {
        delete schema.minItems;
      }
    });

    return openAPIFile;
  },
};

export default processor;
