import {RuleProcessorT} from '../../core/rules/processor-models';
import {z} from 'zod';
import {patchSchema} from '../common/utils/patch';
import {
  anyEndpointDescriptorConfigSchema, correctionConfigSchema,
  endpointDescriptorConfigSchema,
  endpointParameterDescriptorConfigSchema, endpointParameterWithCorrectionDescriptorConfigSchema,
  openAPISchemaConfigSchema,
  parameterInConfigSchema,
  patchMethodConfigSchema
} from '../common/config';
import {getOperationSchema} from '../common/utils/get-operation-schema';
import {findParameterIndex} from '../common/utils/find-parameter-index';
import {checkIsRefSchema} from '../common/utils/refs';
import {getObjectPath, setObjectProp} from "../common/utils/object-path";
import {messagesFactory} from "../../logger/messages/factory";
import {parseAnyEndpointDescriptor} from "../common/utils/config/parse-endpoint-descriptor";
import {parseSimpleDescriptor} from "../common/utils/config/parse-simple-descriptor";

const configSchema = z
  .object({
    endpointDescriptor: anyEndpointDescriptorConfigSchema.optional(),
    parameterDescriptor: endpointParameterWithCorrectionDescriptorConfigSchema.optional(),
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
  defaultConfig: {
    patchMethod: 'merge'
  },
  processDocument: (openAPIFile, config, logger, ruleMeta) => {
    const { endpointDescriptor, parameterDescriptor, patchMethod, schemaDiff, objectDiff } = config;

    if (!patchMethod) {
      logger.errorMessage(messagesFactory.ruleNotApply.requiredConfigField(ruleMeta, 'patchMethod'));
      return openAPIFile;
    }

    if (!parameterDescriptor) {
        logger.errorMessage(messagesFactory.ruleNotApply.requiredConfigField(ruleMeta, 'parameterDescriptor'));
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

        const rawCorrection = parameterDescriptor?.correction || null;
        const parsedCorrection = parseSimpleDescriptor(rawCorrection, { isContainsName: false })?.correction;
        if (parsedCorrection) {
          setObjectProp(
              targetComponentParameter.schema,
              parsedCorrection,
              patchSchema(
                  logger,
                  getObjectPath(targetComponentParameter.schema, parsedCorrection),
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

    const parsedEndpointDescriptor = parseAnyEndpointDescriptor(endpointDescriptor, logger)
    if (!parsedEndpointDescriptor) {
      logger.errorMessage(messagesFactory.ruleNotApply.failedToParseDescriptor(ruleMeta, 'endpointDescriptor'));
      return openAPIFile;
    }

    const operationSchema = getOperationSchema(openAPIFile, parsedEndpointDescriptor.path, parsedEndpointDescriptor.method);
    if (!operationSchema) {
      logger.warning(`Empty operationSchema, not found endpoint: ${JSON.stringify(parsedEndpointDescriptor)}`);
      return openAPIFile;
    }

    const targetParameterIndex = findParameterIndex(operationSchema.parameters, parameterDescriptor.name, parameterDescriptor.in);
    if (targetParameterIndex === null) {
      logger.warning(`Not found parameter: ${JSON.stringify(parsedEndpointDescriptor)}`);
      return openAPIFile;
    }

    const targetParameterSchema = operationSchema.parameters?.[targetParameterIndex];
    if (!targetParameterSchema) {
      logger.warning(`Not found parameter: ${JSON.stringify(parsedEndpointDescriptor)}`);
      return openAPIFile;
    }

    if (checkIsRefSchema(targetParameterSchema)) {
      logger.warning(`Descriptor should not refer to links: ${JSON.stringify(parsedEndpointDescriptor)}`);
      return openAPIFile;
    }

    if (schemaDiff) {
      logger.trace(`Apply schemaDiff: ${schemaDiff}`);

      const rawCorrection = parameterDescriptor?.correction || null;
      const parsedCorrection = parseSimpleDescriptor(rawCorrection, { isContainsName: false })?.correction;
      if (parsedCorrection) {
        setObjectProp(
            targetParameterSchema.schema,
            parsedCorrection,
            patchSchema(
                logger,
                getObjectPath(targetParameterSchema.schema, parsedCorrection),
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
