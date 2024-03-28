import {ConfigT} from "../config";
import {LoggerI} from "../logger/interface";
import {OpenAPIFileT} from "../openapi";
import {RuleRunner} from "./rules/rule-runner";


export const runner = async (config: ConfigT, sourceOpenAPIFile: OpenAPIFileT, baseLogger: LoggerI): Promise<OpenAPIFileT> => {
    const logger = baseLogger.clone('runner');

    let openAPIFile = sourceOpenAPIFile;

    const ruleEntries = config.rules || [];
    if (!ruleEntries?.length) {
        logger.warning(`Empty rules!`);
    }

    for (const ruleEntry of ruleEntries) {
        try {
            const ruleRunner = new RuleRunner(ruleEntry.name, logger);
            await ruleRunner.init();
            await ruleRunner.applyConfig(ruleEntry.config);
            openAPIFile = await ruleRunner.processDocument(openAPIFile);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error, `Failed to process rule ${ruleEntry.name}`)
            }

            throw error;
        }
    }

    return openAPIFile;
}
