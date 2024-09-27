import {RuleProcessorT} from '../../core/rules/processor-models';
import {z} from 'zod';
import {normalizeMethod} from '../common/utils/normilizers';
import {forEachOperation} from '../common/utils/iterators/each-operation';
import {checkIsHttpMethod} from '../common/openapi-models';
import {anyEndpointDescriptorConfigSchema} from "../common/config";
import {
    parseAnyEndpointDescriptor,
    ParsedEndpointDescriptor
} from "../common/utils/config/parse-endpoint-descriptor";
import {isNonNil} from "../common/utils/empty";

const configSchema = z
    .object({
        enabled: z
            .array(
                anyEndpointDescriptorConfigSchema,
            )
            .optional(),
        enabledPathRegExp: z.array(z.instanceof(RegExp)).optional(),
        disabled: z
            .array(
                anyEndpointDescriptorConfigSchema,
            )
            .optional(),
        disabledPathRegExp: z.array(z.instanceof(RegExp)).optional(),
        printIgnoredEndpoints: z.boolean().optional(),
    })
    .strict();

const normalizeEndpoint = (endpoint: ParsedEndpointDescriptor): ParsedEndpointDescriptor => {
    return {
        ...endpoint,
        method: normalizeMethod(endpoint.method),
    };
};

type EndpointHash = string;

const getEndpointHash = (endpoint: ParsedEndpointDescriptor): EndpointHash => {
    return `${endpoint.method}/${endpoint.path}`;
};

const processor: RuleProcessorT<typeof configSchema> = {
    configSchema,
    defaultConfig: {},
    processDocument: (openAPIFile, config, logger) => {
        const {enabled, enabledPathRegExp, disabled, disabledPathRegExp, printIgnoredEndpoints} = config;

        const parsedEnabled = enabled ? enabled.map((descriptor) => {
            return parseAnyEndpointDescriptor(descriptor, logger);
        }).filter(isNonNil) : null;

        const normalizedEnabled = parsedEnabled ? parsedEnabled.map(normalizeEndpoint) : null;
        const normalizedEnabledPathRegExps = enabledPathRegExp || null;

        const parsedDisabled = disabled ? disabled.map((descriptor) => {
            return parseAnyEndpointDescriptor(descriptor, logger);
        }).filter(isNonNil) : null;

        const normalizedDisabled = parsedDisabled ? parsedDisabled.map(normalizeEndpoint) : null;
        const normalizedDisabledPathRegExps = disabledPathRegExp || null;

        const enabledEndpointHashSet = normalizedEnabled ? new Set(normalizedEnabled.map(getEndpointHash)) : null;
        const disabledEndpointHashSet = normalizedDisabled ? new Set(normalizedDisabled.map(getEndpointHash)) : null;

        const checkIsEnabledEndpoint = (endpoint: ParsedEndpointDescriptor) => {
            const hash = getEndpointHash(endpoint);

            const isEnabled =
                (enabledEndpointHashSet && enabledEndpointHashSet.has(hash)) ||
                (normalizedEnabledPathRegExps &&
                    normalizedEnabledPathRegExps.some((normalizedEnabledPathRegExp) => {
                        return normalizedEnabledPathRegExp.test(endpoint.path);
                    })) ||
                (!enabledEndpointHashSet && !normalizedEnabledPathRegExps);

            const isDisabled =
                (disabledEndpointHashSet && disabledEndpointHashSet.has(hash)) ||
                (normalizedDisabledPathRegExps &&
                    normalizedDisabledPathRegExps.some((normalizedDisabledPathRegExp) => {
                        return normalizedDisabledPathRegExp.test(endpoint.path);
                    }));

            return isEnabled && !isDisabled;
        };

        let usageCount: Record<EndpointHash, number> = {};
        const increaseUsageCount = (endpoint: ParsedEndpointDescriptor) => {
            const hash = getEndpointHash(endpoint);

            usageCount[hash] = (usageCount[hash] || 0) + 1;
        };

        const ignoredEndpoints: Array<ParsedEndpointDescriptor> = [];

        forEachOperation(openAPIFile, ({operationSchema, method, path}) => {
            const endpoint = normalizeEndpoint({
                path,
                method,
            });

            increaseUsageCount(endpoint);

            const pathObjSchema = openAPIFile?.document?.paths?.[path];

            if (!checkIsEnabledEndpoint(endpoint) && pathObjSchema) {
                delete pathObjSchema[method];

                ignoredEndpoints.push({
                    path,
                    method,
                });
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

        if (printIgnoredEndpoints && ignoredEndpoints.length) {
            logger.info(`Ignored endpoints: \n
        ${ignoredEndpoints.map((endpoint) => {
                const {method, path} = endpoint;

                return `[${method}] - ${path} \n`;
            })}\n`);
        }

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
export {configSchema};
