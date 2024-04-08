import { RuleProcessorT } from '../../core/rules/processor-models';
import { z } from 'zod';
import { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import path from 'path';
import fs from 'fs';
import YAML from 'yaml';
import deepmerge from 'deepmerge';

const configSchema = z.object({
  path: z.string().optional(),
});

const processor: RuleProcessorT<typeof configSchema> = {
  configSchema,
  defaultConfig: {},
  processDocument: (openAPIFile, config, logger) => {
    const { path: openAPIFilePath } = config;

    if (!openAPIFilePath) {
      logger.warning(`Empty path: ${path}`);
      return openAPIFile;
    }

    let contentBuffer: Buffer;
    try {
      const absoluteInputPath = path.isAbsolute(openAPIFilePath) ? openAPIFilePath : path.resolve(process.cwd(), openAPIFilePath);
      logger.trace(`Absolute input path: ${absoluteInputPath}`);
      contentBuffer = fs.readFileSync(absoluteInputPath);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error, `Not found input file: ${openAPIFilePath}`);
      }

      throw error;
    }

    const content = contentBuffer.toString();

    const inputFileExtension = path.extname(openAPIFilePath) || null;
    logger.trace(`Input file extension: ${inputFileExtension}`);

    let document: any | null = null;
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
        default: {
          logger.warning(`Not processable extension! ${inputFileExtension}`);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error, `Parse input file: ${content}`);
      }

      return openAPIFile;
    }

    openAPIFile.document = deepmerge(openAPIFile.document as any, document);

    return openAPIFile;
  },
};

export default processor;
