import { RuleProcessorT } from '../../core/rules/processor-models';
import { z } from 'zod';
import { normalizeMethod } from '../common/utils/normilizers';
import { parameterInConfigSchema } from '../common/config';
import { checkIsRefSchema } from '../common/utils/refs';
import { forEachOperation } from '../common/utils/iterators/each-operation';
import { forEachSchema } from '../common/utils/iterators/each-schema';
import { checkIsObjectSchema } from '../common/utils/object-schema';

const descriptorSchema = z
  .object({
    type: z.literal('component-schema'),
    componentName: z.string(),
  })
  .strict()
  .or(
    z
      .object({
        type: z.literal('endpoint-parameter'),
        path: z.string(),
        method: z.string(),
        parameterName: z.string(),
        parameterIn: parameterInConfigSchema,
      })
      .strict()
  )
  .or(
    z
      .object({
        type: z.literal('endpoint'),
        path: z.string(),
        method: z.string(),
      })
      .strict()
  );

type Descriptor = z.infer<typeof descriptorSchema>;

const configSchema = z
  .object({
    ignore: z.array(descriptorSchema).optional(),
  })
  .strict();

const processor: RuleProcessorT<typeof configSchema> = {
  configSchema,
  defaultConfig: {},
  processDocument: (openAPIFile, config, logger) => {
    const { ignore } = config;

    const componentSchemas = openAPIFile.document?.components?.schemas;
    Object.keys(componentSchemas || {}).forEach((name) => {
      const schema = componentSchemas?.[name];
      if (checkIsRefSchema(schema)) {
        return;
      }

      const checkIsIgnoredComponent = ({ name }: { name: string }): boolean => {
        if (!ignore) {
          return false;
        }

        return ignore.some((item) => {
          return item.type === 'component-schema' && item.componentName === name;
        });
      };

      if (schema?.deprecated && !checkIsIgnoredComponent({ name }) && componentSchemas) {
        logger.trace(`Deleted component - "${name}"`);
        delete componentSchemas[name];
      }
    });

    forEachOperation(openAPIFile, ({ operationSchema, method, path }) => {
      const pathObjSchema = openAPIFile?.document?.paths?.[path];

      const checkIsIgnoredEndpoint = ({ path, method }: { path: string; method: string }): boolean => {
        if (!ignore) {
          return false;
        }

        return ignore.some((item) => {
          return item.type === 'endpoint' && item.path === path && normalizeMethod(item.method) === normalizeMethod(method);
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
            if (!ignore) {
              return false;
            }

            return ignore.some((item) => {
              return (
                item.type === 'endpoint-parameter' &&
                item.path === path &&
                normalizeMethod(item.method) === normalizeMethod(method) &&
                item.parameterName === parameterName &&
                item.parameterIn === parameterIn
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

    return openAPIFile;
  },
};

export default processor;
export { configSchema };
