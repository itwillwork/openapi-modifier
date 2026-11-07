import { ConfigT } from '../config';
import { LoggerI } from '../logger/interface';
import { OpenAPIFileT } from '../openapi';
import { RuleRunner } from './rules/rule-runner';
import {messagesFactory} from "../logger/messages/factory";
import { OpenAPIDiffer } from '../logger/differ';

export const runner = async (config: ConfigT, sourceOpenAPIFile: OpenAPIFileT, baseLogger: LoggerI): Promise<OpenAPIFileT> => {
  const logger = baseLogger.clone('runner');

  let openAPIFile = sourceOpenAPIFile;

  const pipeline = config.pipeline || [];
  const shouldTraceStepDiff = config.logger?.minLevel === 0;
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
        const differ = shouldTraceStepDiff ? new OpenAPIDiffer(openAPIFile.document) : undefined;
        openAPIFile = await ruleRunner.processDocument(openAPIFile);

        if (differ) {
          logger.trace(messagesFactory.pipeline.ruleDiff({
            ruleName: rulePath,
            step: index + 1,
            total: pipeline.length,
            result: differ.getDiff(openAPIFile.document),
          }));
        }
      } else if (shouldTraceStepDiff) {
        logger.trace(messagesFactory.pipeline.ruleSkipped({
          ruleName: rulePath,
          step: index + 1,
          total: pipeline.length,
        }));
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
