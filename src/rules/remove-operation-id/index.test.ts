import processor from './index';

describe('remove-operation-id rule', () => {
  test('regular', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      paths: {
        '/pets': {
          get: {
            summary: '',
            operationId: 'listPets',
            tags: [],
            responses: {},
          },
        },
        '/pet/:id': {
          get: {
            summary: '',
            operationId: 'petDetails',
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
          ignore: [],
        },
        fakeLogger
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
          '/pet/:id': {
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

  test('usage option: ignore', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      paths: {
        '/pets': {
          get: {
            summary: '',
            operationId: 'listPets',
            tags: [],
            responses: {},
          },
        },
        '/pet/:id': {
          get: {
            summary: '',
            operationId: 'petDetails',
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
          ignore: ['listPets'],
        },
        fakeLogger
      )
    ).toEqual({
      ...fakeOpenAPIFile,
      document: {
        ...fakeOpenAPIFile.document,
        paths: {
          '/pets': {
            get: {
              summary: '',
              operationId: 'listPets',
              tags: [],
              responses: {},
            },
          },
          '/pet/:id': {
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

  test('usage option: ignore, logger warning', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      paths: {
        '/pets': {
          get: {
            operationId: 'listPets',
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
          ignore: ['OperationId'],
        },
        fakeLogger
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

    expect(fakeLogger.warning).toBeCalledLoggerMethod(/OperationId/, 1);
  });
});
