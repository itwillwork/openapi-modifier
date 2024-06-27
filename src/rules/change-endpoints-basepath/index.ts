import { RuleProcessorT } from '../../core/rules/processor-models';
import { z } from 'zod';
import { forEachSchema } from '../common/utils/iterators/each-schema';
import { HttpMethods } from '../common/openapi-models';
import { forEachOperation } from '../common/utils/iterators/each-operation';
import {messagesFactory} from "../../logger/messages-factory";

const configSchema = z
  .object({
    map: z.record(z.string(), z.string()),
    ignoreOperarionCollisions: z.boolean().optional(),
  })
  .strict();

type OperationHashT = string;

const getOperationHash = ({ method, path }: { method: HttpMethods; path: string }): OperationHashT => `[${method}] - ${path}`;

const changeBasePath = (sourcePath: string, fromPrefix: string, toPrefix: string): string => {
  return sourcePath.replace(fromPrefix, toPrefix);
};

const processor: RuleProcessorT<typeof configSchema> = {
  configSchema,
  defaultConfig: {
    map: {},
    ignoreOperarionCollisions: false,
  },
  processDocument: (openAPIFile, config, logger) => {
    const { map, ignoreOperarionCollisions } = config;

    logger.trace(`Check paths ..`);

    if (!ignoreOperarionCollisions) {
      const sourceOperationHashes: Array<OperationHashT> = [];
      const collisionOperationHashes: Array<OperationHashT> = [];

      forEachOperation(openAPIFile, ({ path, method }) => {
        const operationHash = getOperationHash({ method, path });
        sourceOperationHashes.push(operationHash);
      });

      forEachOperation(openAPIFile, ({ path, method }) => {
        Object.keys(map).forEach((fromPrefix) => {
          const toPrefix = map[fromPrefix] || '';

          if (path.startsWith(fromPrefix)) {
            const preparedPath = changeBasePath(path, fromPrefix, toPrefix);

            const preparedOperationHash = getOperationHash({ method, path: preparedPath });

            if (sourceOperationHashes.includes(preparedOperationHash)) {
              collisionOperationHashes.push(preparedOperationHash);
            }
          }
        });
      });

      if (collisionOperationHashes?.length) {
        const errorMessage = `Failed to change endpoint basepath's, operaion conflicts: \n ${collisionOperationHashes.join('\n')}`;
        logger.errorMessage(errorMessage)
        return openAPIFile;
      }
    }

    const pathsSchema = openAPIFile.document?.paths;

    let usageCount: Record<string, number> = {};
    const increaseUsageCount = (fromPrefix: string) => {
      usageCount[fromPrefix] = (usageCount[fromPrefix] || 0) + 1;
    };

    Object.keys(pathsSchema || {}).forEach((pathKey) => {
      Object.keys(map).forEach((fromPrefix) => {
        const toPrefix = map[fromPrefix] || '';

        if (pathKey.startsWith(fromPrefix)) {
          logger.trace(`Matching "${pathKey}" with "${fromPrefix}"`);

          increaseUsageCount(fromPrefix);

          const preparedPath = changeBasePath(pathKey, fromPrefix, toPrefix);
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
        logger.warning(
            messagesFactory.configField.notUsaged(
            `map.${fromPrefix}`,
            `Not found endpoints with prefix "${fromPrefix}"`,
          ),
        );
      }
    });

    return openAPIFile;
  },
};

export default processor;
export { configSchema };
