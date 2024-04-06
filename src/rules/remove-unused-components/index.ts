import {RuleProcessorT} from "../../core/rules/processor-models";
import {z} from 'zod';
import {OpenAPIV3, OpenAPIV3_1} from "openapi-types";
import { forEachSchemas } from '../base/utils';

type ComponentsObject = OpenAPIV3.ComponentsObject | OpenAPIV3_1.ComponentsObject;

const configSchema = z.object({});

const REF_SEPARATOR = '/';

const shortenRef = (ref: string) => {
    return ref.split(REF_SEPARATOR).slice(0, 4).join(REF_SEPARATOR);
}

const processor: RuleProcessorT<typeof configSchema> = {
    configSchema,
    defaultConfig: {},
    processDocument: (openAPIFile, config, logger) => {
        const components: ComponentsObject = openAPIFile.document.components || {};

        let hasUnusedComponents = true;
        while (hasUnusedComponents) {
            let usagedCount: Record<string, number> = {};

            Object.keys(components).forEach((component) => {
                Object.keys(components[component as keyof ComponentsObject] || {}).forEach((key) => {
                    usagedCount[`#/components/${component}/${key}`] = 0;
                });
            });

            forEachSchemas(openAPIFile, (schema) => {
                if ('$ref' in schema) {
                    const shortenedRef = shortenRef(schema['$ref']);

                    usagedCount[shortenedRef] = (usagedCount[shortenedRef] || 0) + 1;
                }
            });

            hasUnusedComponents = false;
            Object.keys(usagedCount).forEach(ref => {
                if (!usagedCount[ref]) {
                    hasUnusedComponents = true;

                    const [,, component, key] = ref.split(REF_SEPARATOR);
                    const componentsObj = openAPIFile.document.components?.[component as keyof ComponentsObject];
                    if (componentsObj) {
                        delete componentsObj[key];
                    }
                }
            })
        }

        return openAPIFile;
    }
}

export default processor;