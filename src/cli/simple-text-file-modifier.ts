import argv, {Arguments} from 'yargs-parser';
import {ConsoleLogger} from '../logger/console';
import {findConfigFile} from '../config';
import fs from 'fs';

type ParamsT = Arguments & {
  config?: string;
  input?: string;
  output?: string;
};

type SimpleTextFileModifierConfigT = {
  addAfter?: string;
  addBefore?: string;
  replace?: Array<{searchValue: string | RegExp, replaceValue: string }>;
}

const logger = new ConsoleLogger({
  name: 'simple-text-file-modifier',
  minLevel: ConsoleLogger.typeLevelMap.warning,
});

const cli = async (params: ParamsT) => {
  if (!params.config) {
    throw new Error('Required --config param!');
  }

  logger.trace('Trying find config file...');
  const config = await findConfigFile<SimpleTextFileModifierConfigT>(logger, params.config);

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

  fs.writeFileSync(outputPath, fileContent);

  logger.success('OK');
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
