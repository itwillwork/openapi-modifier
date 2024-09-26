import fs from 'fs';
import tmp, {FileResult} from 'tmp';
import {LoggerI} from './interface';

class TempFileLogger implements LoggerI {
    private tmpFile: FileResult;

    private logsPrefix: string;

    constructor({name, tmpFile}: { name?: string; tmpFile?: FileResult }) {
        this.tmpFile = tmpFile || tmp.fileSync({
            keep: true,
            postfix: 'verbose-logs.log',
            prefix: 'npm-openapi-modifier'
        });

        this.logsPrefix = name ? `${name}: ` : '';
    }

    private writeLog = (message: string) => {
        const log = `[${new Date().toISOString()} ${this.logsPrefix}] - ${message}`;
        fs.appendFileSync(this.tmpFile.fd, new Buffer(log));
    }

    clone = (name: string): TempFileLogger => {
        return new TempFileLogger({
            name,
            tmpFile: this.tmpFile,
        });
    };

    trace = (message: string, obj: any) => {
        this.writeLog(`[trace]: ` + message + JSON.stringify(obj || {}, null, 4));
    };

    info = (message: string) => {
        this.writeLog(`[info]: ` + message);
    };

    notImportantInfo = (message: string) => {
        this.writeLog(`[not important info]: ` + message);
    };

    error = (error: Error, message?: string) => {
        this.writeLog(`[error]: ` + message);
        this.writeLog(`[error message]: ` + error.message);
        this.writeLog(`[error stack]: ` + error.stack);
        this.writeLog(`[error object]: ` + error);
    };

    errorMessage = (message?: string) => {
        this.writeLog(`[error message]: ` + message);
    };

    warning = (message: string) => {
        this.writeLog(`[warning]: ` + message);
    };

    success = (message: string) => {
        this.writeLog(`[success]: ` + message);
    };

    helpInfo = (message: string) => {
        this.writeLog(`[help info]: ` + message);
    };

    getHelpInfo = (): string => {
        return `A complete log of this run can be found in: ${tmp.tmpdir + this.tmpFile.name}`;
    };
}

export {TempFileLogger};
