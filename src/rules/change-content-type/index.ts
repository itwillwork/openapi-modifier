import {RuleProcessorT} from '../../core/rules/processor-models';
import {z} from 'zod';
import {checkIsRefSchema} from "../common/utils/refs";
import {forEachOperation} from "../common/utils/iterators/each-operation";

const configSchema = z.object({
    map: z.record(z.string(), z.string()),
});

const processor: RuleProcessorT<typeof configSchema> = {
    configSchema,
    defaultConfig: {
        map: {},
    },
    processDocument: (openAPIFile, config, logger) => {
        const {map} = config;

        let usageCount: Record<string, number> = {};
        const increaseUsageCount = (contentType: string) => {
            usageCount[contentType] = (usageCount[contentType] || 0) + 1;
        };

        forEachOperation(openAPIFile, ({operationSchema}) => {
            // forEach - paths[name][method].responses[code].content[contentType].schema
            const responses = operationSchema?.responses || {};
            Object.keys(responses).forEach((code) => {
                const responseSchema = responses[code];
                if (checkIsRefSchema(responseSchema)) {
                    return;
                }

                Object.keys(responseSchema?.content || {}).forEach((contentType) => {
                    const newContentType = map[contentType];
                    if (responseSchema?.content?.[contentType]) {
                        responseSchema.content[newContentType] = responseSchema?.content?.[contentType];
                        delete responseSchema?.content?.[contentType];
                        increaseUsageCount(contentType);
                    }
                });
            });

            // forEach - paths[name][method].requestBody.content[contentType].schema
            const requestBody = operationSchema?.requestBody;
            if (!checkIsRefSchema(requestBody)) {
                Object.keys(requestBody?.content || {}).forEach((contentType) => {
                    const newContentType = map[contentType];
                    if (requestBody?.content?.[contentType]) {
                        requestBody.content[newContentType] = requestBody?.content?.[contentType];
                        delete requestBody?.content?.[contentType];
                        increaseUsageCount(contentType);
                    }
                });
            }
        });

        Object.keys(map).forEach((contentType) => {
            if (!usageCount[contentType]) {
                logger.warning(`Not usage contentType "${contentType}"`);
            }
        });

        return openAPIFile;
    },
};

export default processor;
