import processor from './index';

describe('remove-parameter rule', () => {
  test('regular', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      paths: {
        '/pets': {
          get: {
            summary: 'List all pets',
            parameters: [
              {
                in: 'query',
                name: 'filter',
                schema: {
                  format: 'int64',
                  type: 'integer',
                },
              },
            ],
            responses: {},
          },
        },
      },
    });

    expect(
      processor.processDocument(
        fakeOpenAPIFile,
        {
          endpointDescriptor: {
            path: '/pets',
            method: 'GET',
          },
          parameterDescriptor: {
            name: 'filter',
            in: 'query',
          },
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
              summary: 'List all pets',
              parameters: [],
              responses: {},
            },
          },
        },
      },
    });

    expect(fakeLogger.warning).toBeCalledTimes(0);
  });
  test('regular, simple descriptor', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      paths: {
        '/pets': {
          get: {
            summary: 'List all pets',
            parameters: [
              {
                in: 'query',
                name: 'filter',
                schema: {
                  format: 'int64',
                  type: 'integer',
                },
              },
            ],
            responses: {},
          },
        },
      },
    });

    expect(
      processor.processDocument(
        fakeOpenAPIFile,
        {
          endpointDescriptor: 'GET /pets',
          parameterDescriptor: {
            name: 'filter',
            in: 'query',
          },
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
              summary: 'List all pets',
              parameters: [],
              responses: {},
            },
          },
        },
      },
    });

    expect(fakeLogger.warning).toBeCalledTimes(0);
  });

  test('regular, components.parameters', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      components: {
        parameters: {
          TestParameter: {
            name: 'filter',
            in: 'query',
            schema: {
              format: 'int64',
              type: 'integer',
            },
          },
          TestPageParameter: {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
            },
          },
        },
      },
    });

    expect(
      processor.processDocument(
        fakeOpenAPIFile,
        {
          parameterDescriptor: {
            name: 'filter',
            in: 'query',
          },
        },
        fakeLogger,
          {ruleName: ''}
      )
    ).toEqual({
      ...fakeOpenAPIFile,
      document: {
        ...fakeOpenAPIFile.document,
        components: {
          parameters: {
            TestPageParameter: {
              name: 'page',
              in: 'query',
              schema: {
                type: 'integer',
              },
            },
          },
        },
      },
    });

    expect(fakeLogger.warning).toBeCalledTimes(0);
  });
});
