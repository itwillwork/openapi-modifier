import { OpenAPIV2, OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import { LoggerI } from './logger/interface';
import YAML from 'yaml';
import fs from 'fs';
import path from 'path';
import jsonStringifyNice from 'json-stringify-nice';

type OpenAPIDocumentT = OpenAPIV3.Document | OpenAPIV3_1.Document;
type OpenAPIFileContextT = {
  sourcePath: string;
  sourceExtension: '.json' | '.yaml' | '.yml';
};
type OpenAPIFileT = {
  context: OpenAPIFileContextT;
  document: OpenAPIDocumentT;
};

const checkIsAvailableFileExtension = (extensions: string | null | undefined): extensions is OpenAPIFileContextT['sourceExtension'] => {
  return ['.json', '.yaml', '.yml'].includes(extensions as string);
};

const readInputFile = (baseLogger: LoggerI, inputPath: string): OpenAPIFileT => {
  const logger = baseLogger.clone('input-file');

  let contentBuffer: Buffer;
  try {
    const absoluteInputPath = path.isAbsolute(inputPath) ? inputPath : path.resolve(process.cwd(), inputPath);
    logger.trace(`Absolute input path: ${absoluteInputPath}`);
    contentBuffer = fs.readFileSync(absoluteInputPath);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, `Not found input file: ${inputPath}`);
    }

    throw error;
  }

  const content = contentBuffer.toString();

  const inputFileExtension = path.extname(inputPath) || null;
  logger.trace(`Input file extension: ${inputFileExtension}`);
  if (!checkIsAvailableFileExtension(inputFileExtension)) {
    throw new Error(`Not processable extension! ${inputFileExtension}`);
  }

  let document: OpenAPIDocumentT | null = null;
  try {
    switch (inputFileExtension) {
      case '.yml':
      case '.yaml': {
        document = YAML.parse(content);
        break;
      }
      case '.json': {
        document = JSON.parse(content);
        break;
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, `Parse input file: ${content}`);
    }

    throw error;
  }

  if (!document) {
    throw new Error('Empty input file!');
  }

  return {
    context: {
      sourcePath: inputPath,
      sourceExtension: inputFileExtension,
    },
    document,
  };
};

const writeOutputFile = (baseLogger: LoggerI, outputPath: string, file: OpenAPIFileT): void => {
  const logger = baseLogger.clone('output-file');

  const outputFileExtension = path.extname(outputPath) || null;
  logger.trace(`Input file extension: ${outputFileExtension}`);
  if (!checkIsAvailableFileExtension(outputFileExtension)) {
    throw new Error(`Not processable extension! ${outputFileExtension}`);
  }

  let content: string | null;
  try {
    switch (outputFileExtension) {
      case '.yml':
      case '.yaml': {
        content = YAML.stringify(file.document, {
          sortMapEntries: true,
        });
        break;
      }
      case '.json': {
        content = jsonStringifyNice(file.document, null, 4);
        break;
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Failed to stringified output');
    }

    throw error;
  }

  if (!content) {
    throw new Error('Empty content!');
  }

  try {
    const absoluteOutputPath = path.isAbsolute(outputPath) ? outputPath : path.resolve(process.cwd(), outputPath);
    logger.trace(`Absolute output path: ${absoluteOutputPath}`);

    fs.mkdirSync(path.dirname(absoluteOutputPath), { recursive: true });
    fs.writeFileSync(absoluteOutputPath, content);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, `Failed to output file: ${outputPath}`);
    }

    throw error;
  }
};

export { OpenAPIFileT, readInputFile, writeOutputFile };
