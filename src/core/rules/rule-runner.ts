import {LoggerI} from "../../logger/interface";
import path from "path";
import {RuleProcessorT} from "./processor-models";
import {OpenAPIFileT} from "../../openapi";
import {z} from "zod";

type RuleAnyConfigT = z.ZodObject<any>;

class RuleRunner {
    private name: string;

    private logger: LoggerI;

    private config: z.infer<RuleAnyConfigT> | null = null;

    private processor: RuleProcessorT<RuleAnyConfigT> | null = null;

    constructor(name: string, logger: LoggerI) {
        this.name = name;
        this.logger = logger.clone(`rule:${name}`);
    }

    init = async () => {
        const {logger, name} = this;

        const processorPath = path.resolve(__dirname, `../../rules/${name}`);
        const processorImport = await import(processorPath);

        const processor = processorImport.default as RuleProcessorT<RuleAnyConfigT>;
        if (!processor) {
            const error = new Error();
            logger.error(error, `Failed to init rule "${this.name}", not found rule processor: "${name}"`);
            throw error;
        }

        this.processor = processor;
    }

    applyConfig = (config: RuleAnyConfigT) => {
        const {logger, processor} = this;

        if (!processor) {
            logger.warning(`Failed to apply rule "${this.name}" config, empty processor!`);
            return;
        }

        let mergedConfig;
        try {
            mergedConfig = {
                ...processor.defaultConfig,
                ...(config || {}),
            };
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error, `Failed to init rule "${this.name}", failed merge default and "${JSON.stringify(config || {})}"`);
            }

            throw error;
        }

        try {
            processor.configSchema.strict().parse(mergedConfig);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error, `Failed to init rule, not valid rule config: ${JSON.stringify(mergedConfig || {})}`);
            }

            throw error;
        }

        this.config = mergedConfig;
    }

    processDocument = async (openAPIFile: OpenAPIFileT): Promise<OpenAPIFileT> => {
        const {logger, processor, config} = this;

        if (!processor || !config) {
            logger.warning(`Failed to run rule, empty processor or config!`);
            return openAPIFile;
        }

        return processor.processDocument(openAPIFile, config, logger)
    }
}

export {RuleRunner}
