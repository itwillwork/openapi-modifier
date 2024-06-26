import {RuleProcessorT} from '../../core/rules/processor-models';
import {z} from 'zod';
import {normalizeMethod} from '../common/utils/normilizers';
import {
  componentDescriptorConfigSchema,
  endpointDescriptorConfigSchema,
  parameterDescriptorConfigSchema
} from '../common/config';
import {checkIsRefSchema} from '../common/utils/refs';
import {forEachOperation} from '../common/utils/iterators/each-operation';
import {forEachSchema} from '../common/utils/iterators/each-schema';
import {checkIsObjectSchema} from '../common/utils/object-schema';

const configSchema = z
  .object({
    ignoreComponents: z.array(componentDescriptorConfigSchema).optional(),
    ignoreEndpoints: z.array(endpointDescriptorConfigSchema).optional(),
    ignoreEndpointParameters: z.array(parameterDescriptorConfigSchema).optional(),
  })
  .strict();

const processor: RuleProcessorT<typeof configSchema> = {
  configSchema,
  defaultConfig: {},
  processDocument: (openAPIFile, config, logger) => {
    const { ignoreComponents, ignoreEndpoints, ignoreEndpointParameters } = config;

    const usageIgnoreComponents = ignoreComponents?.reduce<Record<string, number>>((acc, item) => {
      acc[item.componentName] = 0;
      return acc;
    }, {}) || {};

    const componentSchemas = openAPIFile.document?.components?.schemas;
    Object.keys(componentSchemas || {}).forEach((name) => {
      const schema = componentSchemas?.[name];
      if (checkIsRefSchema(schema)) {
        return;
      }

      const checkIsIgnoredComponent = ({ name }: { name: string }): boolean => {
        if (!ignoreComponents) {
          return false;
        }

        const shouldIgnore = ignoreComponents.some((item) => {
          return item.componentName === name;
        });

        if (!usageIgnoreComponents[name]) {
          usageIgnoreComponents[name] = 0;
        }

        usageIgnoreComponents[name] += 1;

        return shouldIgnore;
      };

      if (schema?.deprecated && !checkIsIgnoredComponent({ name }) && componentSchemas) {
        logger.trace(`Deleted component - "${name}"`);
        delete componentSchemas[name];
      }
    });

    forEachOperation(openAPIFile, ({ operationSchema, method, path }) => {
      const pathObjSchema = openAPIFile?.document?.paths?.[path];

      const checkIsIgnoredEndpoint = ({ path, method }: { path: string; method: string }): boolean => {
        if (!ignoreEndpoints) {
          return false;
        }

        return ignoreEndpoints.some((item) => {
          return item.path === path && normalizeMethod(item.method) === normalizeMethod(method);
        });
      };

      if (
        operationSchema.deprecated &&
        pathObjSchema &&
        !checkIsIgnoredEndpoint({
          path,
          method,
        })
      ) {
        logger.trace(`Deleted endpoint - "${JSON.stringify({ path, method })}"`);
        delete pathObjSchema[method];
      }

      if (operationSchema?.parameters) {
        operationSchema.parameters = operationSchema.parameters.filter((parameter) => {
          const checkIsIgnoredEndpointParameter = ({ path, method, parameterName, parameterIn }: { path: string; method: string; parameterName: string; parameterIn: string }): boolean => {
            if (!ignoreEndpointParameters) {
              return false;
            }

            return ignoreEndpointParameters.some((item) => {
              return (
                item.path === path &&
                normalizeMethod(item.method) === normalizeMethod(method) &&
                item.name === parameterName &&
                item.in === parameterIn
              );
            });
          };

          if (
            !checkIsRefSchema(parameter) &&
            parameter?.deprecated &&
            !checkIsIgnoredEndpointParameter({
              path,
              method,
              parameterName: parameter.name,
              parameterIn: parameter.in,
            })
          ) {
            logger.trace(`Deleted parameter - "${JSON.stringify(parameter)}"`);
            return false;
          }

          return true;
        });
      }
    });

    forEachSchema(openAPIFile, (schema) => {
      if (checkIsObjectSchema(schema)) {
        const properties = schema?.properties || {};
        Object.keys(properties).forEach((propertyKey) => {
          const propertySchema = properties[propertyKey];

          if (!checkIsRefSchema(propertySchema) && propertySchema?.deprecated) {
            logger.trace(`Deleted property - "${propertyKey}"`);
            delete properties[propertyKey];
          }
        });
      }
    });

    Object.keys(usageIgnoreComponents).forEach((componentName) => {
      if (!usageIgnoreComponents[componentName]) {
        logger.warning(`Not usaged ignore component: "${componentName}"`);
      }
    });

    return openAPIFile;
  },
};

export default processor;
export { configSchema };
