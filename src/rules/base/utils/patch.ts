import {z} from "zod";
import deepmerge from "deepmerge";
import {LoggerI} from "../../../logger/interface";

export const patchMethodConfigSchema = z.union([z.literal('merge'), z.literal('replace')]).optional();

// TODO renaming
export const openAPISchemaConfigSchema = z.any();

type PatchMethod = z.infer<typeof patchMethodConfigSchema>;
type OpenAPISchema = z.infer<typeof openAPISchemaConfigSchema>;

export const patchSchema = (logger: LoggerI, sourceSchema: OpenAPISchema, method: PatchMethod, ...otherSchemas: Array<OpenAPISchema>) => {
    if (!otherSchemas?.length) {
        return sourceSchema;
    }

    return otherSchemas.reduce((acc, otherSchema) => {
        switch (method) {
            case 'merge': {
                return deepmerge(sourceSchema, otherSchema);
                break;
            }
            case 'replace': {
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
