import { RuleProcessorT } from '../../core/rules/processor-models';
import { z } from 'zod';
import { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import { forEachSchema } from '../common/utils/iterators/each-schema';
import {
  anyComponentDescriptorConfigSchema,
  componentDescriptorConfigSchema,
  simpleComponentDescriptorConfigSchema
} from "../common/config";
import {parseAnyComponentDescriptor} from "../common/utils/config/parse-component-descriptor";
import {isNonNil} from "../common/utils/empty";

type ComponentsObject = OpenAPIV3.ComponentsObject | OpenAPIV3_1.ComponentsObject;

const configSchema = z
  .object({
    ignore: z.array(
        z.union([
          simpleComponentDescriptorConfigSchema,
          componentDescriptorConfigSchema,
          z.instanceof(RegExp),
        ]),
    ).optional(),
    printDeletedComponents: z.boolean().optional(),
  })
  .strict();

const REF_SEPARATOR = '/';

const shortenRef = (ref: string) => {
  return ref.split(REF_SEPARATOR).slice(0, 4).join(REF_SEPARATOR);
};

const processor: RuleProcessorT<typeof configSchema> = {
  configSchema,
  defaultConfig: {},
  processDocument: (openAPIFile, config, logger) => {
    const { ignore, printDeletedComponents } = config;

    const ignoredComponentRegExps = (ignore || []).map(item => {
      if (item instanceof RegExp) {
        return item;
      }

      return null;
    }).filter(isNonNil);

    const ignoredComponentNames = (ignore || []).map(item => {
      if (item instanceof RegExp) {
        return null;
      }

      return parseAnyComponentDescriptor(item, logger);
    }).map(componentDescriptor => componentDescriptor?.componentName).filter(isNonNil);

    logger.trace(`Ignore component names: ${ignoredComponentNames}`);
    const ignoredComponentNamesSet = new Set<string>(ignoredComponentNames);
    const usageIgnoredComponentNames = ignoredComponentNames.reduce<Record<string, number>>((acc, componentName) => {
      acc[componentName] = 0;

      return acc;
    }, {});

    const components: ComponentsObject = openAPIFile.document.components || {};

    let hasUnusedComponents = true;
    while (hasUnusedComponents) {
      logger.trace(`New iteration of removing unused components ...`);

      let usagedCount: Record<string, number> = {};

      Object.keys(components).forEach((component) => {
        Object.keys(components[component as keyof ComponentsObject] || {}).forEach((key) => {
          const isIgnored = ignoredComponentNamesSet?.has(key) || ignoredComponentRegExps.some((ignoredComponentRegExp) => {
            return ignoredComponentRegExp.test(key);
          });

          if (isIgnored) {
            if (!usageIgnoredComponentNames[key]) {
              usageIgnoredComponentNames[key] = 0
            }

            usageIgnoredComponentNames[key] += 1;
            return;
          }

          usagedCount[`#/components/${component}/${key}`] = 0;
        });
      });

      logger.trace('usageIgnoredComponentNames', usageIgnoredComponentNames);

      forEachSchema(openAPIFile, (schema) => {
        logger.trace('forEachSchema the callback was called', schema);

        if ('$ref' in schema) {
          const shortenedRef = shortenRef(schema['$ref']);

          usagedCount[shortenedRef] = (usagedCount[shortenedRef] || 0) + 1;
        }
      });

      logger.trace('usagedCount', usagedCount);

      hasUnusedComponents = false;
      Object.keys(usagedCount).forEach((ref) => {
        if (!usagedCount[ref]) {
          logger.trace('Removing ref ... - ', ref);

          hasUnusedComponents = true;

          const [, , component, key] = ref.split(REF_SEPARATOR);
          const componentsObj = openAPIFile.document.components?.[component as keyof ComponentsObject];
          if (componentsObj) {
            if (printDeletedComponents) {
              logger.info(`Deleted the "${key}" component ("${component}") as not used`);
            }

            delete componentsObj[key];
          }
        }
      });
    }

    Object.keys(usageIgnoredComponentNames).forEach((ignoredComponentName) => {
      if (!usageIgnoredComponentNames[ignoredComponentName]) {
        logger.warning(`Not usaged ignore component: "${ignoredComponentName}"`);
      }
    });

    return openAPIFile;
  },
};

export default processor;
export { configSchema };
