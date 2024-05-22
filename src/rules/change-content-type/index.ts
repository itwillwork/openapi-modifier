import { RuleProcessorT } from '../../core/rules/processor-models';
import { z } from 'zod';
import { checkIsRefSchema } from '../common/utils/refs';
import { forEachOperation } from '../common/utils/iterators/each-operation';

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
    const increaseUsageCount = (contentType: string) => {
      usageCount[contentType] = (usageCount[contentType] || 0) + 1;
    };

    logger.trace(`Check components.requestBodies ...`);

    // forEach - components.requestBodies[name].content.[contentType].schema
    Object.keys(openAPIFile.document?.components?.requestBodies || {}).forEach((name) => {
      const requestBodySchema = openAPIFile.document?.components?.requestBodies?.[name];
      if (checkIsRefSchema(requestBodySchema)) {
        return;
      }

      Object.keys(requestBodySchema?.content || {}).forEach((contentType) => {
        const newContentType = map[contentType];
        if (requestBodySchema?.content?.[contentType] && newContentType) {
          logger.trace(`Change content-type - components.requestBodies[${name}].content.[${contentType}].schema`);
          requestBodySchema.content[newContentType] = requestBodySchema?.content?.[contentType];
          delete requestBodySchema?.content?.[contentType];
          increaseUsageCount(contentType);
        }
      });
    });

    logger.trace(`Check components.responses ...`);

    // forEach - components.responses[code].content.[contentType].schema
    Object.keys(openAPIFile.document?.components?.responses || {}).forEach((code) => {
      const responsesCodeSchema = openAPIFile.document?.components?.responses?.[code];
      if (checkIsRefSchema(responsesCodeSchema)) {
        return;
      }

      Object.keys(responsesCodeSchema?.content || {}).forEach((contentType) => {
        const newContentType = map[contentType];
        if (responsesCodeSchema?.content?.[contentType] && newContentType) {
          logger.trace(`Change content-type - components.responses[${code}].content.[${contentType}].schema`);
          responsesCodeSchema.content[newContentType] = responsesCodeSchema?.content?.[contentType];
          delete responsesCodeSchema?.content?.[contentType];
          increaseUsageCount(contentType);
        }
      });
    });

    logger.trace(`Check paths ...`);

    forEachOperation(openAPIFile, ({ operationSchema, path, method }) => {
      logger.trace(`Check operation responses ...`);

      // forEach - paths[path][method].responses[code].content[contentType].schema
      const responses = operationSchema?.responses || {};
      Object.keys(responses).forEach((code) => {
        const responseSchema = responses[code];
        if (checkIsRefSchema(responseSchema)) {
          return;
        }

        Object.keys(responseSchema?.content || {}).forEach((contentType) => {
          const newContentType = map[contentType];
          if (responseSchema?.content?.[contentType] && newContentType) {
            logger.trace(`Change content-type - paths[${path}][${method}].responses[${code}].content[${contentType}].schema`);
            responseSchema.content[newContentType] = responseSchema?.content?.[contentType];
            delete responseSchema?.content?.[contentType];
            increaseUsageCount(contentType);
          }
        });
      });

      logger.trace(`Check operation requestBody ...`);

      // forEach - paths[path][method].requestBody.content[contentType].schema
      const requestBody = operationSchema?.requestBody;
      if (!checkIsRefSchema(requestBody)) {
        Object.keys(requestBody?.content || {}).forEach((contentType) => {
          const newContentType = map[contentType];
          if (requestBody?.content?.[contentType] && newContentType) {
            logger.trace(`Change content-type - paths[${path}][${method}].requestBody.content[${contentType}].schema`);
            requestBody.content[newContentType] = requestBody?.content?.[contentType];
            delete requestBody?.content?.[contentType];
            increaseUsageCount(contentType);
          }
        });
      }
    });

    logger.trace(`Usage count: ${JSON.stringify(usageCount)}`);

    Object.keys(map).forEach((contentType) => {
      if (!usageCount[contentType]) {
        logger.warning(`Not usage contentType "${contentType}"`);
      }
    });

    return openAPIFile;
  },
};

export default processor;
export {
  configSchema,
}
