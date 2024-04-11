import processor from './index';

describe('filter-endpoints rule', () => {
  test('regular', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      paths: {
        '/pets': {
          get: {
            summary: '',
            responses: {},
          },
          delete: {
            summary: '',
            responses: {},
          },
        },
      },
    });

    expect(
      processor.processDocument(
        fakeOpenAPIFile,
        {
          disabled: [
            {
              path: '/pets',
              method: 'delete',
            },
          ],
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
        '/pets': {
          get: {
            summary: '',
            responses: {},
          },
          delete: {
            summary: '',
            responses: {},
          },
        },
      },
    });

    expect(
      processor.processDocument(
        fakeOpenAPIFile,
        {
          enabled: [
            {
              path: '/animals',
              method: 'get',
            },
          ],
          disabled: [
            {
              path: '/dogs',
              method: 'get',
            },
          ],
        },
        fakeLogger
      )
    ).toEqual({
      ...fakeOpenAPIFile,
    });

    expect(fakeLogger.warning).toBeCalledLoggerMethod(/Non-existent/, 2);
  });

  test('usage option: enabled', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      paths: {
        '/pets': {
          get: {
            summary: '',
            responses: {},
          },
          delete: {
            summary: '',
            responses: {},
          },
        },
      },
    });

    expect(
      processor.processDocument(
        fakeOpenAPIFile,
        {
          enabled: [
            {
              path: '/pets',
              method: 'get',
            },
          ],
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
              responses: {},
            },
          },
        },
      },
    });
  });

  test('usage option: common parameters', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      paths: {
        '/pets': {
          parameters: [
            {
              name: 'subject',
              in: 'query',
              schema: {
                type: 'string',
              },
            },
          ],
          get: {
            summary: '',
            responses: {},
          },
          delete: {
            summary: '',
            responses: {},
          },
        },
      },
    });

    expect(
      processor.processDocument(
        fakeOpenAPIFile,
        {
          enabled: [
            {
              path: '/pets',
              method: 'get',
            },
          ],
        },
        fakeLogger
      )
    ).toEqual({
      ...fakeOpenAPIFile,
      document: {
        ...fakeOpenAPIFile.document,
        paths: {
          '/pets': {
            parameters: [
              {
                name: 'subject',
                in: 'query',
                schema: {
                  type: 'string',
                },
              },
            ],
            get: {
              summary: '',
              responses: {},
            },
          },
        },
      },
    });
  });

  test('usage option: delete empty paths', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      paths: {
        '/pets': {
          parameters: [
            {
              name: 'subject',
              in: 'query',
              schema: {
                type: 'string',
              },
            },
          ],
          get: {
            summary: '',
            responses: {},
          },
          delete: {
            summary: '',
            responses: {},
          },
        },
      },
    });

    expect(
      processor.processDocument(
        fakeOpenAPIFile,
        {
          disabled: [
            {
              path: '/pets',
              method: 'get',
            },
            {
              path: '/pets',
              method: 'delete',
            },
          ],
        },
        fakeLogger
      )
    ).toEqual({
      ...fakeOpenAPIFile,
      document: {
        ...fakeOpenAPIFile.document,
        paths: {},
      },
    });
  });

  test('usage option: disabled', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      paths: {
        '/pets': {
          get: {
            summary: '',
            responses: {},
          },
          delete: {
            summary: '',
            responses: {},
          },
        },
      },
    });

    expect(
      processor.processDocument(
        fakeOpenAPIFile,
        {
          disabled: [
            {
              path: '/pets',
              method: 'delete',
            },
          ],
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
              responses: {},
            },
          },
        },
      },
    });
  });
});
