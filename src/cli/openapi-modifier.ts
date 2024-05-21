import argv, { Arguments } from 'yargs-parser';
import { ConsoleLogger } from '../logger/console';
import {ConfigT, findConfigFile, mergeConfigs} from '../config';
import { openapiModifier } from '../index';

type ParamsT = Arguments & {
  config?: string;
  input?: string;
  output?: string;
};

const logger = new ConsoleLogger({
  name: 'openapi-modifier-cli',
  minLevel: ConsoleLogger.typeLevelMap.warning,
});

const cli = async (params: ParamsT) => {
  const configPath = params.config || 'openapi-modifier.config.js';

  logger.trace('Trying find config file...');
  const config = await findConfigFile<Partial<ConfigT>>(logger, configPath);

  const inputPath = params?.input || null;
  if (!inputPath) {
    throw new Error('Required --input param!');
  }

  const outputPath = params?.output || null;
  if (!outputPath) {
    throw new Error('Required --output param!');
  }

  logger.trace('Merging config with cli params...');
  const finalConfig = mergeConfigs(logger, config, {
    input: inputPath,
    output: outputPath,
  });

  logger.trace(`Final CLI config: ${JSON.stringify(finalConfig)}`);
  logger.trace('Trying run openapi modifier...');
  await openapiModifier(finalConfig);
};

const parsedArguments = argv(process.argv);

cli(parsedArguments)
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    logger.error(error);
    process.exit(1);
  });
