import {
    RuleProcessorT
} from "../../core/rules/processor-models";
import {
    z
} from 'zod';
import {
    forEachSchemas,
} from '../base/utils';

const configSchema = z.object({
    map: z.object({}),
});

const processor: RuleProcessorT<typeof configSchema> = {
    configSchema,
    defaultConfig: {
        map: {}
    },
    processDocument: (openAPIFile, config, logger) => {
        // TODO refactoring improve zod validation
        const map: Record<string, string> = config.map;

        let usageCount: Record<string, number> = {};
        const increaseUsageCount = (contentType: string) => {
            usageCount[contentType] = (usageCount[contentType] || 0) + 1;
        }

        Object.keys(openAPIFile.document?.paths || {}).forEach(pathName => {
            Object.keys(openAPIFile.document?.paths?.[pathName] || {}).forEach(method => {
                // @ts-expect-error bad open api types
                const methodSchema = openAPIFile.document?.paths?.[pathName]?.[method];

                // forEach - paths[name][method].responses[code].content[contentType].schema
                const responses = methodSchema?.responses || {};
                Object.keys(responses).forEach(code => {
                    const responseSchema = responses[code];

                    Object.keys(responseSchema?.content).forEach(contentType => {
                        const newContentType = map[contentType];
                        if (responseSchema?.content?.[contentType]) {
                            responseSchema.content[newContentType] = responseSchema?.content?.[contentType];
                            delete responseSchema?.content?.[contentType];
                            increaseUsageCount(contentType);
                        }
                    });
                });

                // forEach - paths[name][method].requestBody.content[contentType].schema
                const requestBody = methodSchema?.requestBody;
                Object.keys(requestBody?.content || {}).forEach(contentType => {
                    const newContentType = map[contentType];
                    if (requestBody?.content?.[contentType]) {
                        requestBody.content[newContentType] = requestBody?.content?.[contentType];
                        delete requestBody?.content?.[contentType];
                        increaseUsageCount(contentType);
                    }
                });
            });
        });

        Object.keys(map).forEach(contentType => {
            if (!usageCount[contentType]) {
                logger.warning(`Not usaged contentType "${contentType}"`);
            }
        });

        return openAPIFile;
    }
}

export default processor;