import { LoggerI } from './src/logger/interface';
import { OpenAPIFileT } from './src/openapi';

expect.extend({
  toBeCalledLoggerMethod(actual: any, messageRegExp: RegExp, count?: number) {
    const expectedCount = typeof count === 'number' ? count : 1;

    let actualCount = 0;

    const calls = actual?.mock?.calls || [];
    calls.forEach((parameters: Array<any>) => {
      parameters.forEach((parameter: any) => {
        if (typeof parameter === 'string' && messageRegExp.test(parameter)) {
          actualCount++;
        }
      });
    });

    const pass = actualCount === expectedCount;
    return {
      pass,
      message: pass
        ? () => `expected number of logger method calls ${actualCount} not to be ${expectedCount} with message like "${messageRegExp}"`
        : () => `expected number of logger method calls ${actualCount} to be ${expectedCount} with message like "${messageRegExp}"`,
    };
  },
});

global.createFakeLogger = () => {
  const logger: LoggerI = {
    trace: jest.fn(() => {}),
    info: jest.fn(() => {}),
    notImportantInfo: jest.fn(() => {}),
    warning: jest.fn(() => {}),
    error: jest.fn(() => {}),
    errorMessage: jest.fn(() => {}),
    success: jest.fn(() => {}),
    clone: jest.fn(() => {
      return logger;
    }),
  };

  return logger;
};

global.createFakeOpenAPIFile = (document: Partial<OpenAPIFileT['document']>): OpenAPIFileT => {
  return {
    context: {
      sourcePath: '',
      sourceExtension: '.json',
    },
    // @ts-expect-error wrong OpenAPI type
    document: {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Fake Test OpenAPI',
        license: {
          name: 'MIT',
        },
      },
      ...document,
    },
  };
};
