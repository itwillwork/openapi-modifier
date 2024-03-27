import {z} from 'zod';
import fs from 'fs';
import {LoggerI} from "./logger/interface";

const configSchema = z.object({
    logger: z.object({
        minLevel: z.number().optional(),
    }).optional(),
    input: z.string().optional(),
    output: z.string().optional(),
    rules: z.array(
        z.object({
            name: z.string(),
            config: z.any().optional(),
        }),
    ).optional(),
});

type ConfigT = z.infer<typeof configSchema>;

const defaultConfig: ConfigT = {}

const createConfigLogger = (baseLogger: LoggerI): LoggerI => {
    return baseLogger.clone('config');
}

const findConfigFile = (baseLogger: LoggerI, configPath: string): any => {
    const logger = createConfigLogger(baseLogger);

    let configBuffer: Buffer;
    try {
        configBuffer = fs.readFileSync(configPath);
    } catch (error) {
        if (error instanceof Error) {
            logger.error(error, `Not found config file: ${configPath}`);
        }

        throw error;
    }

    let config = {};
    try {
        config = JSON.parse(configBuffer.toString());
    } catch (error) {
        if (error instanceof Error) {
            logger.error(error, `Parse config: ${configBuffer.toString()}`);
        }

        throw error;
    }

    return config;
}

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
}

const mergeConfigs = (baseLogger: LoggerI, ...configs: Array<Partial<ConfigT>>): ConfigT => {
    const logger = createConfigLogger(baseLogger);

    try {
        return configs.reduce((acc, config) => {
            return {
                ...acc,
                ...config,
                rules: [
                    ...(acc.rules || []),
                    ...(config.rules || []),
                ],
            }
        }, {})
    } catch (error) {
        if (error instanceof Error) {
            logger.error(error, `Failed to merge configs: ${JSON.stringify(configs || [])}`);
        }

        throw error;
    }
}

export {
    defaultConfig,
    findConfigFile,
    checkIsValidConfig,
    mergeConfigs,
    ConfigT,
}
