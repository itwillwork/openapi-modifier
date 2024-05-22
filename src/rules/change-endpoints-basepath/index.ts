import { RuleProcessorT } from '../../core/rules/processor-models';
import { z } from 'zod';
import { forEachSchema } from '../common/utils/iterators/each-schema';

const configSchema = z
  .object({
    map: z.record(z.string(), z.string()),
  })
  .strict();

const processor: RuleProcessorT<typeof configSchema> = {
  configSchema,
  defaultConfig: {
    map: {},
  },
  processDocument: (openAPIFile, config, logger) => {
    const { map } = config;

    let usageCount: Record<string, number> = {};
    const increaseUsageCount = (fromPrefix: string) => {
      usageCount[fromPrefix] = (usageCount[fromPrefix] || 0) + 1;
    };

    logger.trace(`Check paths ..`);

    const pathsSchema = openAPIFile.document?.paths;

    Object.keys(pathsSchema || {}).forEach((pathKey) => {
      Object.keys(map).forEach((fromPrefix) => {
        const toPrefix = map[fromPrefix] || '';

        if (pathKey.startsWith(fromPrefix)) {
          logger.trace(`Matching "${pathKey}" with "${fromPrefix}"`);

          increaseUsageCount(fromPrefix);

          const preparedPath = pathKey.replace(fromPrefix, toPrefix);

          if (pathsSchema) {
            pathsSchema[preparedPath] = pathsSchema[pathKey];
            delete pathsSchema[pathKey];
          }
        }
      });
    });

    logger.trace(`Usage count: ${JSON.stringify(usageCount)}`);

    Object.keys(map).forEach((fromPrefix) => {
      if (!usageCount[fromPrefix]) {
        logger.warning(`Not found endpoints with prefix "${fromPrefix}"`);
      }
    });

    return openAPIFile;
  },
};

export default processor;
export {
  configSchema,
}