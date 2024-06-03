import { RuleProcessorT } from '../../core/rules/processor-models';
import { z } from 'zod';
import { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import path from 'path';
import fs from 'fs';
import YAML from 'yaml';
import deepmerge from 'deepmerge';
import {forEachOperation} from "../common/utils/iterators/each-operation";
import {HttpMethods} from "../common/openapi-models";
import {OpenAPIFileT} from "../../openapi";
import {forEachComponent} from "../common/utils/iterators/each-component";

const configSchema = z
  .object({
    path: z.string().optional(),
    ignoreOperarionCollisions: z.boolean().optional(),
    ignoreComponentCollisions: z.boolean().optional(),
  })
  .strict();

type ComponentHashT = string;

const getComponentHash = ({
                            name,
                          }: {
  name: string;
}): ComponentHashT => `${name}`;

type OperationHashT = string;

const getOperationHash = ({
    method,
    path,
                          }: {
  method: HttpMethods;
  path: string;
}): OperationHashT => `[${method}] - ${path}`;

const processor: RuleProcessorT<typeof configSchema> = {
  configSchema,
  defaultConfig: {},
  processDocument: (openAPIFile, config, logger) => {
    const { path: openAPIFilePath, ignoreOperarionCollisions, ignoreComponentCollisions } = config;

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

    if (!ignoreOperarionCollisions) {
      const sourceFileOperationsHashes: Array<OperationHashT> = [];

      forEachOperation(openAPIFile, ({method, path}) => {
        const operationHash = getOperationHash({
          method,
          path,
        });

        sourceFileOperationsHashes.push(operationHash);
      });

      let operationHashCollisions: Array<OperationHashT> = [];

      forEachOperation({ document } as OpenAPIFileT, ({method, path}) => {
        const operationHash = getOperationHash({
          method,
          path,
        });

        if (sourceFileOperationsHashes.includes(operationHash)) {
          operationHashCollisions.push(operationHash);
        }
      });

      if (operationHashCollisions?.length) {
        const errorMessage = `Failed to merge openapi's, operaion conflicts: \n ${operationHashCollisions.join('\n')}`;
        logger.error(new Error(errorMessage), errorMessage);
        return openAPIFile;
      }
    }

    if (!ignoreComponentCollisions) {
      const sourceFileComponentHashes: Array<ComponentHashT> = [];

      forEachComponent(openAPIFile, ({name}) => {
        const componentHash = getComponentHash({
          name,
        });

        sourceFileComponentHashes.push(componentHash);
      });

      let componentHashCollisions: Array<ComponentHashT> = [];

      forEachComponent({ document } as OpenAPIFileT, ({name}) => {
        const componentHash = getComponentHash({
          name,
        });

        if (sourceFileComponentHashes.includes(componentHash)) {
          componentHashCollisions.push(componentHash);
        }
      });

      if (componentHashCollisions?.length) {
        const errorMessage = `Failed to merge openapi's, component conflicts: \n ${componentHashCollisions.join('\n')}`;
        logger.error(new Error(errorMessage), errorMessage);
        return openAPIFile;
      }
    }

    openAPIFile.document = deepmerge(openAPIFile.document as any, document);

    return openAPIFile;
  },
};

export default processor;
export { configSchema };
