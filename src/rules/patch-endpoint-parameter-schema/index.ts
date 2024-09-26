import {RuleProcessorT} from '../../core/rules/processor-models';
import {z} from 'zod';
import {patchSchema} from '../common/utils/patch';
import {
  endpointDescriptorConfigSchema,
  endpointParameterDescriptorConfigSchema,
  openAPISchemaConfigSchema,
  parameterInConfigSchema,
  patchMethodConfigSchema
} from '../common/config';
import {getOperationSchema} from '../common/utils/get-operation-schema';
import {findParameterIndex} from '../common/utils/find-parameter-index';
import {checkIsRefSchema} from '../common/utils/refs';
import {getObjectPath, setObjectProp} from "../common/utils/object-path";
import {messagesFactory} from "../../logger/messages/factory";

const configSchema = z
  .object({
    endpointDescriptor: endpointDescriptorConfigSchema.optional(),
    parameterDescriptor: endpointParameterDescriptorConfigSchema.optional(),
    parameterDescriptorCorrection: z.string().optional(),
    patchMethod: patchMethodConfigSchema.optional(),
    schemaDiff: openAPISchemaConfigSchema.optional(),
    objectDiff: z
      .object({
        name: z.string().optional(),
        in: parameterInConfigSchema.optional(),
        required: z.boolean().optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

const processor: RuleProcessorT<typeof configSchema> = {
  configSchema,
  defaultConfig: {},
  processDocument: (openAPIFile, config, logger) => {
    const { endpointDescriptor, parameterDescriptor, parameterDescriptorCorrection, patchMethod, schemaDiff, objectDiff } = config;

    if (!patchMethod) {
      logger.errorMessage(messagesFactory.ruleNotApply.requiredConfigField('patchMethod'));
      return openAPIFile;
    }

    if (!parameterDescriptor) {
        logger.errorMessage(messagesFactory.ruleNotApply.requiredConfigField('parameterDescriptor'));
      return openAPIFile;
    }

    if (!endpointDescriptor) {
      logger.trace(`Empty descriptor: ${JSON.stringify(endpointDescriptor)}`);

      const componentParameterSchemas = openAPIFile?.document?.components?.parameters || {};
      const targetComponentParameterKey = Object.keys(componentParameterSchemas || {}).find((key) => {
        const componentParameterSchema = componentParameterSchemas[key];
        if (checkIsRefSchema(componentParameterSchema)) {
          return false;
        }

        if (componentParameterSchema.name === parameterDescriptor.name && componentParameterSchema.in === parameterDescriptor.in) {
          return true;
        }
      });

      if (!targetComponentParameterKey) {
          logger.warning(`Rule not apply: not found parameter with descriptor ${parameterDescriptor} !`);
        return openAPIFile;
      }

      const targetComponentParameter = componentParameterSchemas[targetComponentParameterKey];
      if (!targetComponentParameter || checkIsRefSchema(targetComponentParameter)) {
        return openAPIFile;
      }

      if (schemaDiff) {
        logger.trace(`Apply schemaDiff: ${schemaDiff}`);

        if (parameterDescriptorCorrection) {
          setObjectProp(
              targetComponentParameter.schema,
              parameterDescriptorCorrection,
              patchSchema(
                  logger,
                  getObjectPath(targetComponentParameter.schema, parameterDescriptorCorrection),
                  patchMethod,
                  schemaDiff,
              ),
          );
        } else {
          targetComponentParameter.schema = patchSchema(logger, targetComponentParameter.schema, patchMethod, schemaDiff);
        }
      }

      if (objectDiff) {
        logger.trace(`Apply objectDiff: ${objectDiff}`);

        if (objectDiff?.name !== undefined) {
          targetComponentParameter.name = objectDiff.name;
        }

        if (objectDiff?.in !== undefined) {
          targetComponentParameter.in = objectDiff.in;
        }

        if (objectDiff?.required !== undefined) {
          targetComponentParameter.required = objectDiff.required;
        }
      }

      return openAPIFile;
    }

    const operationSchema = getOperationSchema(openAPIFile, endpointDescriptor.path, endpointDescriptor.method);
    if (!operationSchema) {
      logger.warning(`Empty operationSchema, not found endpoint: ${JSON.stringify(endpointDescriptor)}`);
      return openAPIFile;
    }

    const targetParameterIndex = findParameterIndex(operationSchema.parameters, parameterDescriptor.name, parameterDescriptor.in);
    if (targetParameterIndex === null) {
      logger.warning(`Not found parameter: ${JSON.stringify(endpointDescriptor)}`);
      return openAPIFile;
    }

    const targetParameterSchema = operationSchema.parameters?.[targetParameterIndex];
    if (!targetParameterSchema) {
      logger.warning(`Not found parameter: ${JSON.stringify(endpointDescriptor)}`);
      return openAPIFile;
    }

    if (checkIsRefSchema(targetParameterSchema)) {
      logger.warning(`Descriptor should not refer to links: ${JSON.stringify(endpointDescriptor)}`);
      return openAPIFile;
    }

    if (schemaDiff) {
      logger.trace(`Apply schemaDiff: ${schemaDiff}`);

      if (parameterDescriptorCorrection) {
        setObjectProp(
            targetParameterSchema.schema,
            parameterDescriptorCorrection,
            patchSchema(
                logger,
                getObjectPath(targetParameterSchema.schema, parameterDescriptorCorrection),
                patchMethod,
                schemaDiff,
            ),
        );
      } else {
        targetParameterSchema.schema = patchSchema(logger, targetParameterSchema.schema, patchMethod, schemaDiff);
      }
    }

    if (objectDiff) {
      logger.trace(`Apply objectDiff: ${objectDiff}`);

      if (objectDiff?.name !== undefined) {
        targetParameterSchema.name = objectDiff.name;
      }

      if (objectDiff?.in !== undefined) {
        targetParameterSchema.in = objectDiff.in;
      }

      if (objectDiff?.required !== undefined) {
        targetParameterSchema.required = objectDiff.required;
      }
    }

    return openAPIFile;
  },
};

export default processor;
export { configSchema };
