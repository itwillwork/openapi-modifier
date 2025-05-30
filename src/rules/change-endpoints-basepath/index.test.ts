import processor from './index';

describe('change-endpoints-basepath rule', () => {
  test('regular', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      paths: {
        '/api/v1/pets': {
          get: {
            summary: '',
            tags: [],
            responses: {},
          },
        },
      },
    });

    expect(
      processor.processDocument(
        fakeOpenAPIFile,
        {
          map: { '/api/v1': '' },
        },
        fakeLogger,
          {ruleName: ''}
      )
    ).toEqual({
      ...fakeOpenAPIFile,
      document: {
        ...fakeOpenAPIFile.document,
        paths: {
          '/pets': {
            get: {
              summary: '',
              tags: [],
              responses: {},
            },
          },
        },
      },
    });

    expect(fakeLogger.warning).toBeCalledTimes(0);
  });

  test('regular, logger warning', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      paths: {
        '/api/v1/pets': {
          get: {
            summary: '',
            tags: [],
            responses: {},
          },
        },
      },
    });

    expect(
      processor.processDocument(
        fakeOpenAPIFile,
        {
          map: { '/api/v2': '' },
        },
        fakeLogger,
          {ruleName: ''}
      )
    ).toEqual({
      ...fakeOpenAPIFile,
    });

    expect(fakeLogger.warning).toBeCalledLoggerMethod(/Not found endpoints with prefix/, 1);
  });

  test('usage option: map', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      paths: {
        '/api/v1/pets': {
          get: {
            summary: '',
            tags: [],
            responses: {},
          },
        },
      },
    });

    expect(
      processor.processDocument(
        fakeOpenAPIFile,
        {
          map: { '/api/v1': '/proxy' },
        },
        fakeLogger,
          {ruleName: ''}
      )
    ).toEqual({
      ...fakeOpenAPIFile,
      document: {
        ...fakeOpenAPIFile.document,
        paths: {
          '/proxy/pets': {
            get: {
              summary: '',
              tags: [],
              responses: {},
            },
          },
        },
      },
    });

    expect(fakeLogger.warning).toBeCalledTimes(0);
  });

  test('operations collision', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      paths: {
        '/proxy/pets': {
          get: {
            summary: '',
            tags: [],
            responses: {},
          },
        },
        '/api/v1/pets': {
          get: {
            summary: '',
            tags: [],
            responses: {},
          },
        },
      },
    });

    expect(
      processor.processDocument(
        fakeOpenAPIFile,
        {
          map: { '/api/v1': '/proxy' },
        },
        fakeLogger,
          {ruleName: ''}
      )
    ).toEqual({
      ...fakeOpenAPIFile,
      document: {
        ...fakeOpenAPIFile.document,
      },
    });

    expect(fakeLogger.warning).toBeCalledTimes(0);
    expect(fakeLogger.errorMessage).toBeCalledLoggerMethod(/operaion conflicts/, 1);
  });

  test('operations collision, usage config.ignoreOperationCollisions', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      paths: {
        '/proxy/pets': {
          get: {
            summary: '',
            tags: [],
            responses: {},
          },
        },
        '/api/v1/pets': {
          get: {
            summary: '',
            tags: [],
            responses: {},
          },
        },
      },
    });

    expect(
      processor.processDocument(
        fakeOpenAPIFile,
        {
          map: { '/api/v1': '/proxy' },
          ignoreOperationCollisions: true,
        },
        fakeLogger,
          {ruleName: ''}
      )
    ).toEqual({
      ...fakeOpenAPIFile,
      document: {
        ...fakeOpenAPIFile.document,
        paths: {
          '/proxy/pets': {
            get: {
              summary: '',
              tags: [],
              responses: {},
            },
          },
        },
      },
    });

    expect(fakeLogger.warning).toBeCalledTimes(0);
    expect(fakeLogger.error).toBeCalledTimes(0);
  });
});
