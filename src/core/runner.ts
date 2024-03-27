import {ConfigT} from "../config";
import {LoggerI} from "../logger/interface";
import {OpenAPI, OpenAPIFileT} from "../openapi";

export const runner = async (config: ConfigT, openAPIFile: OpenAPIFileT, logger: LoggerI): Promise<OpenAPIFileT> => {
    const ruleEntries = Object.entries(config.rules);

    for (const ruleEntry of ruleEntries) {
        const [ruleName, ruleConfig] = ruleEntry;

        const processor = await import(`./rules/${ruleName}`);
        const ruleProcessor = processor.default as RuleProcessorT<any>;
        if (!ruleProcessor) {
            throw new Error(`not found rule processor for rule: "${ruleName}"`);
        }

        await ruleProcessor({
            
        });
    }

}
