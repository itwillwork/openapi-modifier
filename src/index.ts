import {checkIsValidConfig, ConfigT, defaultConfig, mergeConfigs} from './config';
import {LoggerFactory, LoggerFactoryTypeLevel} from './logger/factory';
import {readInputFile, writeOutputFile} from './openapi';
import {runner} from './core/runner';
import {AnyPipelineRule} from './rules/generated-types';
import {LoggerI} from "./logger/interface";

export const openapiModifier = async (config: Partial<ConfigT>, forcedLogger?: LoggerI) => {
    const logger = forcedLogger || LoggerFactory.createLogger({
        name: 'openapi-modifier',
        verbose: config.logger?.verbose,
        minLevel: config.logger?.minLevel as LoggerFactoryTypeLevel,
    });

    try {
        logger.trace('Trying find config file...');

        const finalConfig = mergeConfigs(logger, defaultConfig, config);
        if (!checkIsValidConfig(logger, finalConfig)) {
            return;
        }

        logger.trace(`Final openapi modifier config:`, finalConfig);

        const inputPath = finalConfig?.input || null;
        if (!inputPath) {
            throw new Error('Required input field config!');
        }

        const outputPath = finalConfig?.output || null;
        if (!outputPath) {
            throw new Error('Required output field config!');
        }

        logger.trace('Reading input file...');
        const inputOpenAPIFile = readInputFile(logger, inputPath);

        logger.trace('Running...');
        const outputOpenAPIFile = await runner(finalConfig, inputOpenAPIFile, logger);

        logger.trace('Writing output file...');
        writeOutputFile(logger, outputPath, outputOpenAPIFile);

        logger.success('OK!');
    } finally {
        if (!forcedLogger) {
            logger.helpInfo(logger.getHelpInfo());
        }
    }
};

export {AnyPipelineRule, ConfigT};
