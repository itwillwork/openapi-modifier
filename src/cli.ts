import argv, {Arguments} from 'yargs-parser';
import {ConsoleLogger} from './logger/console';
import {checkIsValidConfig, defaultConfig, findConfigFile, mergeConfigs} from "./config";
import {readInputFile, writeOutputFile} from "./openapi";
import {runner} from "./core/runner";

type ParamsT = Arguments & {
    config?: string;
    input?: string;
    output?: string;
}

const logger = new ConsoleLogger({
    debugPostfix: 'cli'
});

const cli = async (params: ParamsT) => {
    if (!params.config) {
        throw new Error('Required --config param!');
    }

    logger.trace('Trying find config file...');
    const config = findConfigFile(logger, params.config);

    const finalConfig = mergeConfigs(logger, defaultConfig, config);
    if (!checkIsValidConfig(logger, finalConfig)) {
        return;
    }

    const inputPath = params?.input || finalConfig?.input || null;
    if (!inputPath) {
        throw new Error('Required --input param!');
    }

    const outputPath = params?.output || finalConfig?.output || null;
    if (!outputPath) {
        throw new Error('Required --output param!');
    }

    logger.trace('Reading input file...');
    const inputOpenAPIFile = readInputFile(logger, inputPath)

    logger.trace('Running...');
    const outputOpenAPIFile = await runner(finalConfig, inputOpenAPIFile, logger);

    logger.trace('Writing output file...');
    writeOutputFile(logger, outputPath, outputOpenAPIFile);

    logger.success('OK!');
}

const parsedArguments = argv(process.argv);

cli(parsedArguments)
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        logger.error(error);
        process.exit(1);
    });
