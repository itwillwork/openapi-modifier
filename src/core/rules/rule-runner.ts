import { LoggerI } from '../../logger/interface';
import path from 'path';
import { RuleProcessorT, RuleMetaT } from './processor-models';
import { OpenAPIFileT } from '../../openapi';
import { z } from 'zod';
import {messagesFactory} from "../../logger/messages/factory";

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
      logger.error(
          error,
          messagesFactory.ruleNotApply.withReason(
              this.ruleMeta,
              `Not found rule processor: "${this.rulePath}"`,
          ),
      );
      throw error;
    }

    this.processor = processor;
  };

  applyConfig = (config: z.infer<RuleAnyConfigT>) => {
    const { logger, processor } = this;

    if (!processor) {
      logger.warning(
          messagesFactory.ruleNotApply.withReason(
              this.ruleMeta,
              `empty processor!`,
          ),
      );
      return;
    }

    let mergedConfig;
    try {
      mergedConfig = Object.assign(processor.defaultConfig, config);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
            error,
            messagesFactory.ruleNotApply.withReason(
                this.ruleMeta,
                `Failed merge default config ("${JSON.stringify(processor.defaultConfig || {})}") and custom config ("${JSON.stringify(config || {})})"`,
            ),
        );
      }

      throw error;
    }

    try {
      processor.configSchema.parse(mergedConfig);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
            error,
            messagesFactory.ruleNotApply.withReason(
                this.ruleMeta,
                `Not valid rule config: ${JSON.stringify(mergedConfig || {})}`,
            ),
        );
      }

      throw error;
    }

    this.config = mergedConfig;
  };

  processDocument = async (openAPIFile: OpenAPIFileT): Promise<OpenAPIFileT> => {
    const { logger, processor, config } = this;

    if (!processor) {
      logger.warning(messagesFactory.ruleNotApply.withReason(this.ruleMeta, `empty rule processor`));
      return openAPIFile;
    }

    if (!config) {
      logger.warning(messagesFactory.ruleNotApply.withReason(this.ruleMeta, `empty rule config`));
      return openAPIFile;
    }

    return processor.processDocument(openAPIFile, config, logger, this.ruleMeta);
  };
}

export { RuleRunner };
