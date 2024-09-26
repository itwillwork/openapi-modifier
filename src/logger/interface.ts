interface LoggerI {
  trace: (message: string) => void;
  notImportantInfo: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
  error: (error: Error, message?: string) => void;
  errorMessage: (message?: string) => void;
  success: (message: string) => void;
  clone: (name: string) => LoggerI;
}

export { LoggerI };
