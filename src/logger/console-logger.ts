import chalk from 'chalk';
import debug, { Debugger } from 'debug';
import { LoggerI } from './interface';

class ConsoleLogger implements LoggerI {
  public static typeLevelMap = {
    trace: 0,
    'not-important-info': 1,
    info: 2,
    warning: 3,
    error: 4,
    success: 5,
  } as const;

  public static debugPrefix = 'openapi-modifier';

  private minLevel: number = 1;

  private debug: Debugger;

  private logsPrefix: string;

  constructor({ minLevel, name }: { minLevel?: number; name?: string }) {
    if (minLevel !== undefined) {
      this.minLevel = minLevel;
    }

    this.debug = debug(`${ConsoleLogger.debugPrefix}:${name}`);
    this.logsPrefix = name ? `${name}: ` : '';
  }

  private checkIsAllowed = (level: keyof typeof ConsoleLogger.typeLevelMap): boolean => {
    return ConsoleLogger.typeLevelMap[level] >= this.minLevel;
  };

  private debugTrace = (message: string) => {
    if (this.debug.enabled) {
      this.debug(message);
    }
  };

  clone = (name: string): ConsoleLogger => {
    return new ConsoleLogger({
      minLevel: this.minLevel,
      name,
    });
  };

  trace = (message: string) => {
    this.debugTrace(message);

    if (!this.checkIsAllowed('trace')) {
      return;
    }

    console.log(this.logsPrefix + message);
  };

  info = (message: string) => {
    this.debugTrace(message);

    if (!this.checkIsAllowed('info')) {
      return;
    }

    console.info(this.logsPrefix + message);
  };

  notImportantInfo = (message: string) => {
    this.debugTrace(message);

    if (!this.checkIsAllowed('not-important-info')) {
      return;
    }

    console.log(chalk.grey(this.logsPrefix + message));
  };

  error = (error: Error, message?: string) => {
    this.debugTrace('Error');
    if (message) {
      this.debugTrace(message);
    }

    if (!this.checkIsAllowed('error')) {
      return;
    }

    if (message) {
      console.log(chalk.bold.red(this.logsPrefix + message));
      this.debugTrace(message);
    }

    console.log(chalk.bold.red('Error details:'));
    console.error(error);
  };

  errorMessage = (message?: string) => {
    this.debugTrace('Error message');
    if (message) {
      this.debugTrace(message);
    }

    if (!this.checkIsAllowed('error')) {
      return;
    }

    if (message) {
      console.log(chalk.bold.red(this.logsPrefix + message));
      this.debugTrace(message);
    }

    console.log(chalk.bold.red('Error details:'));
    console.error(message);
  };

  warning = (message: string) => {
    this.debugTrace(message);

    if (!this.checkIsAllowed('warning')) {
      return;
    }

    console.log(chalk.bold.yellow(this.logsPrefix + message));
  };

  success = (message: string) => {
    this.debugTrace(message);

    if (!this.checkIsAllowed('success')) {
      return;
    }

    console.log(chalk.bold.green(this.logsPrefix + message));
  };

  helpInfo = (message: string) => {
    this.debugTrace(message);

    console.log(chalk.bold.grey(this.logsPrefix + message));
  }

  getHelpInfo = (): string => {
    if (this.debug.enabled) {
      // TODO message
      return `For see more logs env DEBUG=df*`
    }

    return ``
  };
}

export { ConsoleLogger };
