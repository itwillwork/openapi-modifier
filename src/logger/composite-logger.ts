import {LoggerI} from './interface';

class CompositeLogger implements LoggerI {
    private loggers: LoggerI[] = [];

    constructor(loggers: LoggerI[]) {
        this.loggers = loggers;
    }

    addLogger = (logger: LoggerI) => {
        this.loggers.push(logger);
    }

    clone = (name: string): CompositeLogger => {
        return new CompositeLogger(
            this.loggers.map(logger => {
                return logger.clone(name);
            })
        );
    };

    trace = (message: string, obj?: any) => {
        this.loggers.forEach(logger => {
            return logger.trace(message, obj);
        });
    };

    info = (message: string) => {
        this.loggers.forEach(logger => {
            return logger.info(message);
        });
    };

    notImportantWarning = (message: string) => {
        this.loggers.forEach(logger => {
            return logger.notImportantWarning(message);
        });
    };

    error = (error: Error, message?: string) => {
        this.loggers.forEach(logger => {
            return logger.error(error, message);
        });
    };

    errorMessage = (message?: string) => {
        this.loggers.forEach(logger => {
            return logger.errorMessage(message);
        });
    };

    warning = (message: string) => {
        this.loggers.forEach(logger => {
            return logger.warning(message);
        });
    };

    success = (message: string) => {
        this.loggers.forEach(logger => {
            return logger.success(message);
        });
    };

    helpInfo = (message: string) => {
        this.loggers.forEach(logger => {
            return logger.helpInfo(message);
        });
    };

    getHelpInfo = (): string => {
        return this.loggers.map((logger) => {
            return logger.getHelpInfo();
        }).filter(message => !!message).join('\n');
    };
}

export {CompositeLogger};
