import { RuleProcessorT } from '../../core/rules/processor-models';
import { z } from 'zod';
import {normalizeMethod} from "../base/utils/normilizers";

const configSchema = z.object({
  enabled: z
    .array(
      z.object({
        path: z.string(),
        method: z.string(),
      })
    )
    .optional(),
  disabled: z
    .array(
      z.object({
        path: z.string(),
        method: z.string(),
      })
    )
    .optional(),
});

type EndpointT = {
  path: string;
  method: string;
};

const normalizeEndpoint = (endpoint: EndpointT): EndpointT => {
  return {
    ...endpoint,
    method: normalizeMethod(endpoint.method),
  };
};

type EndpointHash = string;

const getEndpointHash = (endpoint: EndpointT): EndpointHash => {
  return `${endpoint.method}/${endpoint.path}`;
};

const processor: RuleProcessorT<typeof configSchema> = {
  configSchema,
  defaultConfig: {},
  processDocument: (openAPIFile, config, logger) => {
    const { enabled, disabled } = config;

    const normalizedEnabled = enabled ? enabled.map(normalizeEndpoint) : null;
    const normalizedDisabled = disabled ? disabled.map(normalizeEndpoint) : null;

    const enabledEndpointHashSet = new Set((normalizedEnabled || []).map(getEndpointHash));
    const disabledEndpointHashSet = new Set((normalizedDisabled || []).map(getEndpointHash));

    const checkIsEnabledEndpoint = (endpoint: EndpointT) => {
      const hash = getEndpointHash(endpoint);
      return (enabledEndpointHashSet.size ? enabledEndpointHashSet.has(hash) : true) && !disabledEndpointHashSet.has(hash);
    };

    let usageCount: Record<EndpointHash, number> = {};
    const increaseUsageCount = (endpoint: EndpointT) => {
      const hash = getEndpointHash(endpoint);

      usageCount[hash] = (usageCount[hash] || 0) + 1;
    };

    Object.keys(openAPIFile.document?.paths || {}).forEach((pathName) => {
      Object.keys(openAPIFile.document?.paths?.[pathName] || {}).forEach((method) => {
        const endpoint = normalizeEndpoint({
          path: pathName,
          method,
        });

        increaseUsageCount(endpoint);

        const pathObj = openAPIFile?.document?.paths?.[pathName];

        if (!checkIsEnabledEndpoint(endpoint) && pathObj) {
          // @ts-expect-error bad OpenAPI types!
          delete pathObj[method];
        }
      });
    });

    if (normalizedEnabled) {
      normalizedEnabled.forEach((endpoint) => {
        const hash = getEndpointHash(endpoint);
        if (!usageCount[hash]) {
          logger.warning(`Non-existent enabled endpoint "${JSON.stringify(endpoint)}"`);
        }
      });
    }

    if (normalizedDisabled) {
      normalizedDisabled.forEach((endpoint) => {
        const hash = getEndpointHash(endpoint);
        if (!usageCount[hash]) {
          logger.warning(`Non-existent disabled endpoint "${JSON.stringify(endpoint)}"`);
        }
      });
    }

    return openAPIFile;
  },
};

export default processor;
