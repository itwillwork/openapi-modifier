import { checkIsValidConfig, ConfigT, defaultConfig, mergeConfigs } from './config';
import { ConsoleLogger } from './logger/console';
import { readInputFile, writeOutputFile } from './openapi';
import { runner } from './core/runner';

export const openapiModifier = async (config: Partial<ConfigT>) => {
  const logger = new ConsoleLogger({
    name: 'openapi-modifier',
    minLevel: config.logger?.minLevel,
  });

  logger.trace('Trying find config file...');

  const finalConfig = mergeConfigs(logger, defaultConfig, config);
  if (!checkIsValidConfig(logger, finalConfig)) {
    return;
  }

  logger.trace(`Final openapi modifier config: ${JSON.stringify(finalConfig)}`);

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
};
