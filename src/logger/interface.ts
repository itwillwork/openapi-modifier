interface LoggerI {
  trace: (message: string, obj?: any) => void;
  info: (message: string) => void;
  notImportantWarning: (message: string) => void;
  warning: (message: string) => void;
  error: (error: Error, message?: string) => void;
  errorMessage: (message?: string) => void;
  success: (message: string) => void;
  helpInfo: (message: string) => void;

  clone: (name: string) => LoggerI;
  getHelpInfo: () => string;
}

export { LoggerI };
