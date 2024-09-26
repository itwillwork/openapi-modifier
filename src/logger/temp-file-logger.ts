import fs from 'fs';
import tmp, {FileResult} from 'tmp';
import {LoggerI} from './interface';

class TempFileLogger implements LoggerI {
    private tmpFile: FileResult;

    private logsPrefix: string;

    public static createTmpFile = () => {
        return tmp.fileSync({
            keep: true,
            postfix: 'verbose-logs.log',
            prefix: 'npm-openapi-modifier'
        });
    }

    constructor({name, tmpFile}: { name?: string; tmpFile?: FileResult }) {
        this.tmpFile = tmpFile || TempFileLogger.createTmpFile();

        this.logsPrefix = name ? `${name}: ` : '';
    }

    private writeLog = (level: string, message: string) => {
        const log = `[${new Date().toISOString()} ${this.logsPrefix} ${level}] - ${message}\n`;
        fs.appendFileSync(this.tmpFile.fd, new Buffer(log));
    }

    clone = (name: string): TempFileLogger => {
        return new TempFileLogger({
            name,
            tmpFile: this.tmpFile,
        });
    };

    trace = (message: string, obj: any) => {
        const stringifiedObj = obj ? JSON.stringify(obj || {}, null, 4) : '';
        this.writeLog('trace', message + stringifiedObj);
    };

    info = (message: string) => {
        this.writeLog('info', message);
    };

    notImportantWarning = (message: string) => {
        this.writeLog('not important warning', message);
    };

    error = (error: Error, message?: string) => {
        this.writeLog(`error`, message || '');
        this.writeLog(`error message`, error.message);
        this.writeLog(`error stack`, error.stack as string);
        // @ts-expect-error
        this.writeLog(`error object`, error);
    };

    errorMessage = (message?: string) => {
        this.writeLog(`error message`, message || '');
    };

    warning = (message: string) => {
        this.writeLog(`warning`, message);
    };

    success = (message: string) => {
        this.writeLog(`success`, message);
    };

    helpInfo = (message: string) => {
        this.writeLog(`help info`, message);
    };

    getHelpInfo = (): string => {
        return `A complete log of this run can be found in: ${this.tmpFile.name}`;
    };
}

export {TempFileLogger};
