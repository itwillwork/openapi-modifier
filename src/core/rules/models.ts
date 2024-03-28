import {LoggerI} from "../../logger/interface";
import {OpenAPIFileT} from "../../openapi";
import {z} from "zod";
import {ZodRawShape} from "zod/lib/types";

export type RuleProcessorT<T extends z.ZodRawShape> = {
    configSchema: z.ZodObject<T>;
    defaultConfig: T;
    processDocument: (openAPIFile: OpenAPIFileT, config: T, logger: LoggerI) => Promise<OpenAPIFileT>;
}
