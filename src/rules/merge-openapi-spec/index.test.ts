import processor from './index';

describe('merge-openapi-spec rule', () => {
  test('regular', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      paths: {
        '/pets': {
          get: {
            summary: 'List all pets',
            responses: {
              '200': {
                description: '',
                content: {
                  '*/*': {
                    schema: {
                      type: 'object',
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    expect(
      processor.processDocument(
        fakeOpenAPIFile,
        {
          path: __dirname + '/__mocks__/new-api-for-new-feature.yaml',
        },
        fakeLogger
      )
    ).toEqual({
      ...fakeOpenAPIFile,
      document: {
        ...fakeOpenAPIFile.document,
        components: {
          schemas: {
            Pet: {
              type: 'object',
              required: ['id', 'name'],
              properties: {
                id: {
                  type: 'integer',
                  format: 'int64',
                },
                name: {
                  type: 'string',
                },
              },
            },
          },
        },
        paths: {
          '/notifications': {
            get: {
              summary: 'Get all notifications',
              responses: {
                '200': {
                  content: {
                    '*/*': {
                      schema: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Pet',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '/pets': {
            get: {
              summary: 'List all pets',
              responses: {
                '200': {
                  description: '',
                  content: {
                    '*/*': {
                      schema: {
                        type: 'object',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    expect(fakeLogger.warning).toBeCalledTimes(0);
  });

  test('collision paths', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      paths: {
        '/notifications': {
          get: {
            summary: 'List all pets',
            responses: {
              '200': {
                description: '',
                content: {
                  '*/*': {
                    schema: {
                      type: 'object',
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    expect(
        processor.processDocument(
            fakeOpenAPIFile,
            {
              path: __dirname + '/__mocks__/collision/paths.yaml',
            },
            fakeLogger
        )
    ).toEqual({
      ...fakeOpenAPIFile,
      document: {
        ...fakeOpenAPIFile.document,
      },
    });

    expect(fakeLogger.warning).toBeCalledTimes(0);
    expect(fakeLogger.error).toBeCalledLoggerMethod(/operaion conflicts/, 1);
  });
});
