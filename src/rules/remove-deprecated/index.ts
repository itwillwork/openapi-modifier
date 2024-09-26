import {RuleProcessorT} from '../../core/rules/processor-models';
import {z} from 'zod';
import {normalizeMethod} from '../common/utils/normilizers';
import {
  componentDescriptorConfigSchema,
  endpointDescriptorConfigSchema,
  parameterDescriptorConfigSchema
} from '../common/config';
import {checkIsRefSchema, resolveRef} from '../common/utils/refs';
import {forEachOperation} from '../common/utils/iterators/each-operation';
import {forEachSchema} from '../common/utils/iterators/each-schema';
import {checkIsObjectSchema} from '../common/utils/object-schema';
import {deepClone} from "../common/utils/deep-clone";
import {messagesFactory} from "../../logger/messages/messagesFactory";

const configSchema = z
  .object({
    ignoreComponents: z.array(componentDescriptorConfigSchema).optional(),
    ignoreEndpoints: z.array(endpointDescriptorConfigSchema).optional(),
    ignoreEndpointParameters: z.array(parameterDescriptorConfigSchema).optional(),
    showDeprecatedDescriptions: z.boolean().optional(),
  })
  .strict();

const processor: RuleProcessorT<typeof configSchema> = {
  configSchema,
  defaultConfig: {},
  processDocument: (openAPIFile, config, logger) => {
    const { ignoreComponents, ignoreEndpoints, ignoreEndpointParameters, showDeprecatedDescriptions } = config;

    const sourceOpenAPIFile = deepClone(openAPIFile);

    const usageIgnoreComponents = ignoreComponents?.reduce<Record<string, number>>((acc, item) => {
      acc[item.componentName] = 0;
      return acc;
    }, {}) || {};

    const componentSchemas = openAPIFile.document?.components?.schemas;
    Object.keys(componentSchemas || {}).forEach((name) => {
      if (!componentSchemas) {
        return;
      }

      const schema = componentSchemas?.[name];

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

      if (
          !checkIsRefSchema(schema) &&
          schema?.deprecated &&
          !checkIsIgnoredComponent({ name })
      ) {
        logger.trace(`Deleted component - "${name}"`);

        if (showDeprecatedDescriptions) {
          logger.notImportantInfo(messagesFactory.deprecated.field(name, schema?.description));
        }

        delete componentSchemas[name];
      }

      if (checkIsRefSchema(schema) && !checkIsIgnoredComponent({ name })) {
        const resolvedSchema = resolveRef(sourceOpenAPIFile, schema);
        if (resolvedSchema?.deprecated) {
          logger.trace(`Deleted component by resolving ref - "${name}"`);

          if (showDeprecatedDescriptions) {
            logger.notImportantInfo(messagesFactory.deprecated.fieldByRef(name, resolvedSchema?.description));
          }

          delete componentSchemas?.[name];
        }
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

        if (showDeprecatedDescriptions) {
          logger.notImportantInfo(messagesFactory.deprecated.endpoint(method, path, pathObjSchema[method]?.description));
        }

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

            if (showDeprecatedDescriptions) {
              logger.notImportantInfo(messagesFactory.deprecated.endpointParameter(method, path, parameter.name, parameter.in, parameter?.description));
            }

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
            if (showDeprecatedDescriptions) {
              logger.notImportantInfo(messagesFactory.deprecated.field(propertyKey, propertySchema?.description));
            }

            delete properties[propertyKey];
          }

          if (checkIsRefSchema(propertySchema)) {
            const resolvedPropertySchema = resolveRef(sourceOpenAPIFile, propertySchema);
            if (resolvedPropertySchema?.deprecated) {
              logger.trace(`Deleted property by resolving ref - "${propertyKey}"`);

              if (showDeprecatedDescriptions) {
                logger.notImportantInfo(messagesFactory.deprecated.fieldByRef(propertyKey, resolvedPropertySchema?.description));
              }

              delete properties[propertyKey];
            }
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
