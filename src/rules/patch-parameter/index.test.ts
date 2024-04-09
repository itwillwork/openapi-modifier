import processor from './index';

describe('patch-parameter rule', () => {
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
          patchMethod: 'merge',
          schemaDiff: {
            format: 'double',
          },
          objectDiff: {
            in: 'path',
            required: true,
          },
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
              summary: 'List all pets',
              parameters: [
                {
                  in: 'path',
                  name: 'filter',
                  required: true,
                  schema: {
                    format: 'double',
                    type: 'integer',
                  },
                },
              ],
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
          patchMethod: 'merge',
          schemaDiff: {
            format: 'double',
          },
          objectDiff: {
            in: 'path',
            required: true,
          },
        },
        fakeLogger
      )
    ).toEqual({
      ...fakeOpenAPIFile,
      document: {
        ...fakeOpenAPIFile.document,
        components: {
          parameters: {
            TestParameter: {
              name: 'filter',
              in: 'path',
              required: true,
              schema: {
                format: 'double',
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
