import {CompositeLogger} from "./composite-logger";
import {ConsoleLogger} from "./console-logger";
import {LoggerI} from "./interface";
import {TempFileLogger} from "./temp-file-logger";

type ValueOf<T> = T[keyof T];

export type LoggerFactoryTypeLevel = ValueOf<typeof LoggerFactory.typeLevelMap>;

class LoggerFactory {
    public static typeLevelMap = {
        trace: 0,
        'not-important-info': 1,
        info: 2,
        warning: 3,
        error: 4,
        success: 5,
    } as const;

    public static createLogger({
                                   minLevel,
                                   name,
                                   verbose,
                               }: {
        minLevel: ValueOf<typeof LoggerFactory.typeLevelMap>;
        name?: string;
        verbose?: boolean
    }): LoggerI {
        const consoleLoggerTypeLevelMap: Record<ValueOf<typeof LoggerFactory.typeLevelMap>, ValueOf<typeof ConsoleLogger.typeLevelMap>> = {
            [LoggerFactory.typeLevelMap.trace]: ConsoleLogger.typeLevelMap.trace,
            [LoggerFactory.typeLevelMap['not-important-info']]: ConsoleLogger.typeLevelMap['not-important-info'],
            [LoggerFactory.typeLevelMap.info]: ConsoleLogger.typeLevelMap.info,
            [LoggerFactory.typeLevelMap.warning]: ConsoleLogger.typeLevelMap.warning,
            [LoggerFactory.typeLevelMap.error]: ConsoleLogger.typeLevelMap.error,
            [LoggerFactory.typeLevelMap.success]: ConsoleLogger.typeLevelMap.success,
        }

        const compositeLogger = new CompositeLogger([]);

        compositeLogger.addLogger(
            new ConsoleLogger({
                name,
                minLevel: consoleLoggerTypeLevelMap[minLevel],
            })
        );

        if (verbose) {
            compositeLogger.addLogger(
                new TempFileLogger({
                    name,
                })
            );
        }

        return compositeLogger;
    }
}


export {LoggerFactory};