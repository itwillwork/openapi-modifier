interface LoggerI {
    trace: (message: string) => void;
    info: (message: string) => void;
    warning: (message: string) => void;
    error: (error: Error, message?: string) => void;
    success: (message: string) => void;
    clone: (debugPostfix: string) => LoggerI;
}

export {LoggerI}
