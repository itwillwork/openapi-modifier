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

  for (const pipelineItem of pipeline) {
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

  return openAPIFile;
};
