import { RuleProcessorT } from '../../core/rules/processor-models';
import { z } from 'zod';
import { forEachSchemas } from '../base/utils';

const configSchema = z.object({
  map: z.object({}),
});

const processor: RuleProcessorT<typeof configSchema> = {
  configSchema,
  defaultConfig: {
    map: {},
  },
  processDocument: (openAPIFile, config, logger) => {
    // TODO improve zod validation
    const map: Record<string, string> = config.map;

    let usageCount: Record<string, number> = {};
    const increaseUsageCount = (fromPrefix: string) => {
      usageCount[fromPrefix] = (usageCount[fromPrefix] || 0) + 1;
    };

    const paths = openAPIFile.document?.paths;

    Object.keys(paths || {}).forEach((pathKey) => {
      Object.keys(map).forEach((fromPrefix) => {
        const toPrefix = map[fromPrefix] || '';

        const path = paths?.[pathKey];

        if (pathKey.startsWith(fromPrefix)) {
          increaseUsageCount(fromPrefix);

          const preparedPath = pathKey.replace(fromPrefix, toPrefix);

          // TODO refactoring
          if (paths) {
            paths[preparedPath] = paths[pathKey];
            delete paths[pathKey];
          }
        }
      });
    });

    Object.keys(map).forEach((fromPrefix) => {
      if (!usageCount[fromPrefix]) {
        logger.warning(`Not found endpoints with prefix "${fromPrefix}"`);
      }
    });

    return openAPIFile;
  },
};

export default processor;
