import { LoggerI } from '../../logger/interface';
import path from 'path';
import { RuleProcessorT, RuleMetaT } from './processor-models';
import { OpenAPIFileT } from '../../openapi';
import { z } from 'zod';

type RuleAnyConfigT = z.ZodObject<any>;

class RuleRunner {
  private rulePath: string;

  private ruleMeta: RuleMetaT;

  private logger: LoggerI;

  private config: z.infer<RuleAnyConfigT> | null = null;

  private processor: RuleProcessorT<RuleAnyConfigT> | null = null;

  constructor(rulePath: string, ruleMeta: RuleMetaT, logger: LoggerI) {
    this.rulePath = rulePath;
    this.ruleMeta = ruleMeta;
    this.logger = logger.clone(`rule:${ruleMeta?.ruleName}`);
  }

  init = async () => {
    const { logger } = this;

    const processorPath = path.resolve(__dirname, `../../rules/${this.rulePath}`);
    const processorImport = await import(processorPath);

    const processor = processorImport.default as RuleProcessorT<RuleAnyConfigT>;
    if (!processor) {
      const error = new Error();
      logger.error(error, `Failed to init rule "${this.ruleMeta.ruleName}", not found rule processor: "${name}"`);
      throw error;
    }

    this.processor = processor;
  };

  applyConfig = (config: z.infer<RuleAnyConfigT>) => {
    const { logger, processor } = this;

    if (!processor) {
      logger.warning(`Failed to apply rule "${this.ruleMeta.ruleName}" config, empty processor!`);
      return;
    }

    let mergedConfig;
    try {
      mergedConfig = Object.assign(processor.defaultConfig, config);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error, `Failed to init rule "${this.ruleMeta.ruleName}", failed merge default and "${JSON.stringify(config || {})}"`);
      }

      throw error;
    }

    try {
      processor.configSchema.parse(mergedConfig);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error, `Failed to init rule, not valid rule config: ${JSON.stringify(mergedConfig || {})}`);
      }

      throw error;
    }

    this.config = mergedConfig;
  };

  processDocument = async (openAPIFile: OpenAPIFileT): Promise<OpenAPIFileT> => {
    const { logger, processor, config } = this;

    if (!processor || !config) {
      logger.warning(`Failed to run rule, empty processor or config!`);
      return openAPIFile;
    }

    return processor.processDocument(openAPIFile, config, logger, this.ruleMeta);
  };
}

export { RuleRunner };
