import argv, { Arguments } from 'yargs-parser';
import { findConfigFile, getAbsoluteConfigPath } from '../config';
import fs from 'fs';
import path from 'path';
import {LoggerFactory} from "../logger/factory";

type ParamsT = Arguments & {
  config?: string;
  input?: string;
  output?: string;
  verbose?: string;
};

type SimpleTextFileModifierConfigT = {
  addAfter?: string;
  addBefore?: string;
  replace?: Array<{ searchValue: string | RegExp; replaceValue: string }>;
};

const DEFAULT_CONFIG_PATHS = [
  'simple-text-file-modifier.config.js',
  'simple-text-file-modifier.config.ts',
  'simple-text-file-modifier.config.json',
  'simple-text-file-modifier.config.yaml',
  'simple-text-file-modifier.config.yml',
] as const;

const cli = async (params: ParamsT) => {
  const logger = LoggerFactory.createLogger({
    name: 'simple-text-file-modifier',
    minLevel: LoggerFactory.typeLevelMap.warning,
    verbose: !!params?.verbose,
  });

  try {
    const configPath = params.config;

    let config: Partial<SimpleTextFileModifierConfigT> | null = null;
    if (configPath) {
      logger.trace(`Trying find config file... ${configPath}`);
      config = await findConfigFile<Partial<SimpleTextFileModifierConfigT>>(logger, configPath);
    } else {
      for (const defaultConfigPath of DEFAULT_CONFIG_PATHS) {
        if (config) {
          // the configuration file has already been found
          continue;
        }

        const absoluteDefaultConfigPath = getAbsoluteConfigPath(defaultConfigPath);
        if (fs.existsSync(absoluteDefaultConfigPath)) {
          logger.trace(`Trying find config file... ${absoluteDefaultConfigPath}`);
          config = await findConfigFile<Partial<SimpleTextFileModifierConfigT>>(logger, defaultConfigPath);
        }
      }
    }

    if (!config) {
      throw new Error(`The configuration file was not found, set the path to it (via the --config parameter) or create one of the configuration files: ${DEFAULT_CONFIG_PATHS.join(', ')}`);
    }

    const inputPath = params?.input || null;
    if (!inputPath) {
      throw new Error('Required --input param!');
    }

    const outputPath = params?.output || null;
    if (!outputPath) {
      throw new Error('Required --output param!');
    }

    let fileContent = fs.readFileSync(inputPath).toString();

    if (config?.replace) {
      config.replace.forEach((item) => {
        fileContent = fileContent.replace(item.searchValue, item.replaceValue);
      });
    }

    if (config?.addBefore) {
      fileContent = config.addBefore + fileContent;
    }

    if (config?.addAfter) {
      fileContent = fileContent + config.addAfter;
    }

    fs.mkdirSync(path.dirname(outputPath), {recursive: true});
    fs.writeFileSync(outputPath, fileContent);

    logger.success('OK');
  } finally {
    logger.helpInfo(logger.getHelpInfo());
  }
};

const parsedArguments = argv(process.argv);

cli(parsedArguments)
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
