import { z } from 'zod';
import fs from 'fs';
import { LoggerI } from './logger/interface';
import path from 'path';
import YAML from 'yaml';
import { AnyPipelineRule } from './rules/generated-types';

const configSchema = z
  .object({
    logger: z
      .object({
        minLevel: z.number().optional(),
      })
      .strict()
      .optional(),
    input: z.string().optional(),
    output: z.string().optional(),
    pipeline: z
      .array(
        z
          .object({
            rule: z.string(),
            disabled: z.boolean().optional(),
            config: z.any().optional(),
          })
          .strict()
      )
      .optional(),
  })
  .strict();

type ConfigT = Omit<z.infer<typeof configSchema>, 'pipeline'> & {
  pipeline?: Array<AnyPipelineRule>;
};

const defaultConfig: ConfigT = {};

const createConfigLogger = (baseLogger: LoggerI): LoggerI => {
  return baseLogger.clone('config');
};

function diagnosticTSFile(logger: LoggerI, fileNames: string[], options: any): boolean {
  // see: https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API#a-minimal-compiler
  const ts = require('typescript');

  let program = ts.createProgram(fileNames, { ...options, noEmit: true });
  let emitResult = program.emit();

  let allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

  allDiagnostics.forEach((diagnostic: any) => {
    if (diagnostic.file) {
      let { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!);
      let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      logger.warning(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
    } else {
      logger.warning(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
    }
  });

  return !allDiagnostics?.length;
}

const findConfigFile = async <T>(baseLogger: LoggerI, configPath: string): Promise<T> => {
  const logger = createConfigLogger(baseLogger);

  const absoluteConfigPath = path.isAbsolute(configPath) ? configPath : path.resolve(process.cwd(), configPath);

  const configFileExtension = path.extname(configPath) || null;
  switch (configFileExtension) {
    case '.yaml':
    case '.yml': {
      let configContent: string = '';
      try {
        const configBuffer = fs.readFileSync(absoluteConfigPath);
        configContent = configBuffer.toString();
      } catch (error) {
        if (error instanceof Error) {
          logger.error(error, `Not found config file: ${absoluteConfigPath}`);
        }

        throw error;
      }

      try {
        return YAML.parse(configContent);
      } catch (error) {
        if (error instanceof Error) {
          logger.error(error, `Parse config: ${configContent}`);
        }

        throw error;
      }
      break;
    }
    case '.json': {
      let configContent: string = '';
      try {
        const configBuffer = fs.readFileSync(absoluteConfigPath);
        configContent = configBuffer.toString();
      } catch (error) {
        if (error instanceof Error) {
          logger.error(error, `Not found config file: ${absoluteConfigPath}`);
        }

        throw error;
      }

      try {
        return JSON.parse(configContent);
      } catch (error) {
        if (error instanceof Error) {
          logger.error(error, `Parse config: ${configContent}`);
        }

        throw error;
      }
      break;
    }
    case '.js': {
      try {
        const processorImport = await import(absoluteConfigPath);
        return processorImport.default;
      } catch (error) {
        if (error instanceof Error) {
          logger.error(error, `Failed to proccess config file: ${absoluteConfigPath}`);
        }

        throw error;
      }
      break;
    }
    case '.ts': {
      const isValidTSFile = diagnosticTSFile(logger, [absoluteConfigPath], {});
      if (!isValidTSFile) {
        const error = new Error('Not valid TS config file!');
        logger.error(error, `Failed to proccess config file: ${absoluteConfigPath}`);
        throw error;
      }

      let configContent: string = '';
      try {
        const configBuffer = fs.readFileSync(absoluteConfigPath);
        configContent = configBuffer.toString();
      } catch (error) {
        if (error instanceof Error) {
          logger.error(error, `Not found config file: ${absoluteConfigPath}`);
        }

        throw error;
      }

      const absoluteCompiledConfigPath = `${absoluteConfigPath.slice(0, -2)}cjs`;

      const ts = require('typescript');
      try {
        // see: https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API#a-simple-transform-function
        let result = ts.transpileModule(configContent, { compilerOptions: { module: ts.ModuleKind.CommonJS } });

        fs.writeFileSync(absoluteCompiledConfigPath, result.outputText);

        const processorImport = await import(absoluteCompiledConfigPath);
        return processorImport.default;
      } catch (error) {
        if (error instanceof Error) {
          logger.error(error, `Failed to proccess config file: ${absoluteConfigPath}`);
        }

        throw error;
      } finally {
        if (fs.existsSync(absoluteCompiledConfigPath)) {
          fs.unlinkSync(absoluteCompiledConfigPath);
        }
      }
      break;
    }
    default: {
      const error = new Error(`
                Not processable config file extension! 
                Config path: ${absoluteConfigPath}
            `);
      logger.error(error);
      throw error;
    }
  }
};

const checkIsValidConfig = (baseLogger: LoggerI, config: any): config is ConfigT => {
  const logger = createConfigLogger(baseLogger);

  try {
    configSchema.parse(config);

    return true;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, `Not valid config: ${JSON.stringify(config || {})}`);
    }

    throw error;
  }
};

const mergeConfigs = (baseLogger: LoggerI, ...configs: Array<Partial<ConfigT>>): ConfigT => {
  const logger = createConfigLogger(baseLogger);

  try {
    return configs.reduce((acc, config) => {
      return {
        ...acc,
        ...config,
        pipeline: [...(acc.pipeline || []), ...(config.pipeline || [])],
      };
    }, {});
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, `Failed to merge configs: ${JSON.stringify(configs || [])}`);
    }

    throw error;
  }
};

export { defaultConfig, findConfigFile, checkIsValidConfig, mergeConfigs, ConfigT };
