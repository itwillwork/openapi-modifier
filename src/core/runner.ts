import { ConfigT } from '../config';
import { LoggerI } from '../logger/interface';
import { OpenAPIFileT } from '../openapi';
import { RuleRunner } from './rules/rule-runner';
import {messagesFactory} from "../logger/messages/factory";

export const runner = async (config: ConfigT, sourceOpenAPIFile: OpenAPIFileT, baseLogger: LoggerI): Promise<OpenAPIFileT> => {
  const logger = baseLogger.clone('runner');

  let openAPIFile = sourceOpenAPIFile;

  const pipeline = config.pipeline || [];
  if (!pipeline?.length) {
    logger.warning(messagesFactory.failedRun.emptyPipeline);
  }

  logger.info(`Start pipeline execution...`);

  for (let index = 0; index < pipeline.length; index++) {
    const pipelineItem = pipeline[index];

    logger.info(`Pipeline item execution [${index + 1}/${pipeline.length}] - ${Math.round((index + 1) / pipeline.length * 100)}%`);

    try {
      const rulePath = pipelineItem.rule;
      const ruleRunner = new RuleRunner(rulePath,{ ruleName: rulePath }, logger);
      await ruleRunner.init();

      await ruleRunner.applyConfig(pipelineItem.config || {});

      if (!pipelineItem.disabled) {
        openAPIFile = await ruleRunner.processDocument(openAPIFile);
      }
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error, messagesFactory.failedRun.failedRunPipelineItem(pipelineItem));
      }

      throw error;
    }
  }

  logger.info(`Finish pipeline execution`);

  return openAPIFile;
};
