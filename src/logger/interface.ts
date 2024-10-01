interface LoggerI {
  trace: (message: string, obj?: any) => void;
  info: (message: string) => void;
  notImportantWarning: (message: string) => void;
  warning: (message: string) => void;
  error: (error: Error, message?: string) => void;
  errorMessage: (message?: string) => void;
  success: (message: string) => void;

  // service methods
  clone: (name: string) => LoggerI;
  getHelpInfo: () => string;
  helpInfo: (message: string) => void;
}

export { LoggerI };
