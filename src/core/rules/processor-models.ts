import { LoggerI } from '../../logger/interface';
import { OpenAPIFileT } from '../../openapi';
import { z } from 'zod';

export type RuleMetaT = {
  ruleName: string;
};

export type RuleProcessorT<T extends z.ZodObject<any> | z.ZodArray<any>> = {
  configSchema: T;
  defaultConfig: z.infer<T>;
  processDocument: (openAPIFile: OpenAPIFileT, config: z.infer<T>, logger: LoggerI, ruleMeta: RuleMetaT) => Promise<OpenAPIFileT> | OpenAPIFileT;
};
