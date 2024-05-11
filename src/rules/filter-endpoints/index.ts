import { RuleProcessorT } from '../../core/rules/processor-models';
import { z } from 'zod';
import { normalizeMethod } from '../common/utils/normilizers';
import { forEachOperation } from '../common/utils/iterators/each-operation';
import { checkIsHttpMethod } from '../common/openapi-models';

const configSchema = z
  .object({
    enabled: z
      .array(
        z
          .object({
            path: z.string(),
            method: z.string(),
          })
          .strict()
      )
      .optional(),
    enabledPathRegExp: z
        .array(
            z.instanceof( RegExp )
        )
        .optional(),
    disabled: z
      .array(
        z
          .object({
            path: z.string(),
            method: z.string(),
          })
          .strict()
      )
      .optional(),
    disabledPathRegExp: z
        .array(
            z.instanceof( RegExp )
        )
        .optional(),
  })
  .strict();

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
    const { enabled, enabledPathRegExp, disabled, disabledPathRegExp } = config;

    const normalizedEnabled = enabled ? enabled.map(normalizeEndpoint) : null;
    const normalizedEnabledPathRegExps = enabledPathRegExp || null;

    const normalizedDisabled = disabled ? disabled.map(normalizeEndpoint) : null;
    const normalizedDisabledPathRegExps = disabledPathRegExp || null;

    const enabledEndpointHashSet = normalizedEnabled ? new Set((normalizedEnabled).map(getEndpointHash)) : null;
    const disabledEndpointHashSet = normalizedDisabled ? new Set((normalizedDisabled).map(getEndpointHash)) : null;

    const checkIsEnabledEndpoint = (endpoint: EndpointT) => {
      const hash = getEndpointHash(endpoint);

      const isEnabled = (
          enabledEndpointHashSet && enabledEndpointHashSet.has(hash)
      ) || (
          normalizedEnabledPathRegExps && normalizedEnabledPathRegExps.some(normalizedEnabledPathRegExp => {
            return normalizedEnabledPathRegExp.test(endpoint.path);
          })
      ) || (!enabledEndpointHashSet && !normalizedEnabledPathRegExps);

      const isDisabled = (
          disabledEndpointHashSet && disabledEndpointHashSet.has(hash)
      ) || (
          normalizedDisabledPathRegExps && normalizedDisabledPathRegExps.some(normalizedDisabledPathRegExp => {
            return normalizedDisabledPathRegExp.test(endpoint.path)
          })
      );

      return isEnabled && !isDisabled;
    };

    let usageCount: Record<EndpointHash, number> = {};
    const increaseUsageCount = (endpoint: EndpointT) => {
      const hash = getEndpointHash(endpoint);

      usageCount[hash] = (usageCount[hash] || 0) + 1;
    };

    forEachOperation(openAPIFile, ({ operationSchema, method, path }) => {
      const endpoint = normalizeEndpoint({
        path,
        method,
      });

      increaseUsageCount(endpoint);

      const pathObjSchema = openAPIFile?.document?.paths?.[path];

      if (!checkIsEnabledEndpoint(endpoint) && pathObjSchema) {
        delete pathObjSchema[method];
      }
    });

    const paths = openAPIFile.document?.paths;
    Object.keys(paths || {}).forEach((pathKey) => {
      const path = paths?.[pathKey];

      const methods = Object.keys(path || {}).filter(checkIsHttpMethod);
      if (!methods?.length && paths?.[pathKey]) {
        delete paths[pathKey];
      }
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
