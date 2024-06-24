import { z } from 'zod';
import deepmerge from 'deepmerge';
import { LoggerI } from '../../../logger/interface';
import { patchMethodConfigSchema, openAPISchemaConfigSchema } from '../config';

type PatchMethod = z.infer<typeof patchMethodConfigSchema>;
type OpenAPISchema = z.infer<typeof openAPISchemaConfigSchema>;

export const patchSchema = (logger: LoggerI, sourceSchema: OpenAPISchema, method: PatchMethod, ...otherSchemas: Array<OpenAPISchema>) => {
  if (!otherSchemas?.length) {
    return sourceSchema;
  }

  return otherSchemas.reduce((acc, otherSchema) => {
    switch (method) {
      case 'deepmerge': {
        return deepmerge(sourceSchema, otherSchema);
        break;
      }
      case 'merge': {
        return {
          ...acc,
          ...otherSchema,
        };
        break;
      }
      default: {
        logger.warning(`Unknown method type: ${method}`);
        return acc;
        break;
      }
    }

    return acc;
  }, sourceSchema);
};


