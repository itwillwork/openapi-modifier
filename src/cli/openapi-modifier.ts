import argv, {Arguments} from 'yargs-parser';
import {LoggerFactory} from '../logger/factory';
import {ConfigT, findConfigFile, getAbsoluteConfigPath, mergeConfigs} from '../config';
import {openapiModifier} from '../index';
import fs from 'fs';
import path from 'path';

const printHelp = (args: string[]): boolean => {
    const HELP = `Usage:
  openapi-modifier --input <path> --output <path> [options]
  openapi-modifier skill [rule-name]

Options:
  --input <path>   Input OpenAPI document (required)
  --output <path>  Output OpenAPI document (required)
  --config <path> Configuration file (defaults to openapi-modifier.config.{js,ts,json,yaml,yml})
  --verbose       Enable verbose logging
  --minLevel <n>  Minimum log level
  -h, --help      Show this help

AI agents:
  Run "openapi-modifier skill" before editing configurations.
  Run "openapi-modifier skill <rule-name>" for each rule you use or modify.
  Instructions are printed in English from the installed package version.
    `;

    if (args.includes('--help') || args.includes('-h') || args[0] === 'help') {
        process.stdout.write(HELP);
        return true;
    }
    return false;
};

const printSkills = (args: string[]): boolean => {
    if (args[0] !== 'skill') {
        return false;
    }
    if (args.length > 2) {
        throw new Error('Usage: openapi-modifier skill [rule-name]');
    }
    const root = path.resolve(__dirname, '../../..');
    const ruleName = args[1];
    const skillsDirectory = path.join(root, 'dist-docs/skills');
    if (ruleName && !fs.readdirSync(skillsDirectory).includes(`${ruleName}.md`)) {
        throw new Error(`Unknown rule: ${ruleName}. Run "openapi-modifier skill" to list rules.`);
    }
    const file = ruleName ? path.join(root, 'dist-docs/skills', `${ruleName}.md`) : path.join(root, 'llms.txt');
    if (!fs.existsSync(file)) {
        throw new Error(ruleName
            ? `Unknown rule: ${ruleName}. Run "openapi-modifier skill" to list rules.`
            : 'Missing llms.txt. Run "npm run tools:generate-skills" when building from source.');
    }
    process.stdout.write(fs.readFileSync(file, 'utf8'));
    return true;
};

type ParamsT = Arguments & {
    config?: string;
    input?: string;
    output?: string;
    verbose?: string;
};

const DEFAULT_CONFIG_PATHS = ['openapi-modifier.config.js', 'openapi-modifier.config.ts', 'openapi-modifier.config.json', 'openapi-modifier.config.yaml', 'openapi-modifier.config.yml'] as const;

const cli = async (params: ParamsT) => {
    const args = process.argv.slice(2);
    if (printHelp(args) || printSkills(args)) {
        return;
    }

    const logger = LoggerFactory.createLogger({
        name: 'openapi-modifier-cli',
        minLevel: LoggerFactory.typeLevelMap["not-important-warning"],
        verbose: !!params?.verbose,
    });

    try {
        const configPath = params.config;

        let config: Partial<ConfigT> | null = null;
        if (configPath) {
            logger.trace(`Trying find config file... ${configPath}`);
            config = await findConfigFile<Partial<ConfigT>>(logger, configPath);
        } else {
            for (const defaultConfigPath of DEFAULT_CONFIG_PATHS) {
                if (config) {
                    // the configuration file has already been found
                    continue;
                }

                const absoluteDefaultConfigPath = getAbsoluteConfigPath(defaultConfigPath);
                if (fs.existsSync(absoluteDefaultConfigPath)) {
                    logger.trace(`Trying find config file... ${absoluteDefaultConfigPath}`);
                    config = await findConfigFile<Partial<ConfigT>>(logger, defaultConfigPath);
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

        const loggerConfig: ConfigT['logger'] = {};

        const verbose = params?.verbose || null;
        if (verbose) {
            loggerConfig.verbose = true;
        }

        const minLevel = params?.minLevel || null;
        if (minLevel) {
            loggerConfig.minLevel = parseInt(minLevel, 10);
        }

        logger.trace('Merging config with cli params...');
        const finalConfig = mergeConfigs(logger, config, {
            input: inputPath,
            output: outputPath,
            logger: loggerConfig
        });

        logger.trace(`Final CLI config`, finalConfig);
        logger.trace('Trying run openapi modifier...');
        await openapiModifier(finalConfig, logger);
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
