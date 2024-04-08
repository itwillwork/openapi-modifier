import { RuleProcessorT } from '../../core/rules/processor-models';
import { z } from 'zod';
import { forEachSchemas } from '../common/utils/iterators';

const configSchema = z.object({
  enabled: z.array(z.string()).optional(),
  disabled: z.array(z.string()).optional(),
});

const processor: RuleProcessorT<typeof configSchema> = {
  configSchema,
  defaultConfig: {},
  processDocument: (openAPIFile, config, logger) => {
    const { enabled, disabled } = config;

    const enabledSet = new Set(enabled || []);
    const disabledSet = new Set(disabled || []);

    const checkIsEnabledContentType = (contentType: string) => {
      return (enabledSet.size ? enabledSet.has(contentType) : true) && !disabledSet.has(contentType);
    };

    let usageCount: Record<string, number> = {};
    const increaseUsageCount = (contentType: string) => {
      usageCount[contentType] = (usageCount[contentType] || 0) + 1;
    };

    Object.keys(openAPIFile.document?.paths || {}).forEach((pathName) => {
      Object.keys(openAPIFile.document?.paths?.[pathName] || {}).forEach((method) => {
        // @ts-expect-error bad open api types
        const methodSchema = openAPIFile.document?.paths?.[pathName]?.[method];

        // forEach - paths[name][method].responses[code].content[contentType].schema
        const responses = methodSchema?.responses || {};
        Object.keys(responses).forEach((code) => {
          const responseSchema = responses[code];

          Object.keys(responseSchema?.content).forEach((contentType) => {
            if (responseSchema?.content?.[contentType] && !checkIsEnabledContentType(contentType)) {
              delete responseSchema?.content?.[contentType];
              increaseUsageCount(contentType);
            }
          });
        });

        // forEach - paths[name][method].requestBody.content[contentType].schema
        const requestBody = methodSchema?.requestBody;
        Object.keys(requestBody?.content || {}).forEach((contentType) => {
          if (requestBody?.content?.[contentType] && !checkIsEnabledContentType(contentType)) {
            delete requestBody?.content?.[contentType];
            increaseUsageCount(contentType);
          }
        });
      });
    });

    if (enabled) {
      enabled.forEach((contentType) => {
        if (!usageCount[contentType]) {
          logger.warning(`Not usage enabled contentType "${contentType}"`);
        }
      });
    }

    if (disabled) {
      disabled.forEach((contentType) => {
        if (!usageCount[contentType]) {
          logger.warning(`Not usage disabled contentType "${contentType}"`);
        }
      });
    }

    return openAPIFile;
  },
};

export default processor;
