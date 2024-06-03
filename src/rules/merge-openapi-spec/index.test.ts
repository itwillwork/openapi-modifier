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

  test('collision operations/paths', () => {
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

  test('collision operations/paths, usage config.ignoreOperarionCollisions', () => {
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
          ignoreOperarionCollisions: true,
        },
        fakeLogger
      )
    ).toEqual({
      ...fakeOpenAPIFile,
      document: {
        ...fakeOpenAPIFile.document,
        paths: {
          ...fakeOpenAPIFile.document.paths,
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
                  description: '',
                },
              },
            },
          },
        },
      },
    });

    expect(fakeLogger.warning).toBeCalledTimes(0);
    expect(fakeLogger.error).toBeCalledTimes(0);
  });

  test('collision components', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      components: {
        schemas: {
          Pet: {
            type: 'string',
          },
        },
      },
    });

    expect(
      processor.processDocument(
        fakeOpenAPIFile,
        {
          path: __dirname + '/__mocks__/collision/components.yaml',
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
    expect(fakeLogger.error).toBeCalledLoggerMethod(/component conflicts/, 1);
  });

  test('collision components, usage config.ignoreComponentCollisions', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      components: {
        schemas: {
          Pet: {
            type: 'string',
          },
        },
      },
    });

    expect(
      processor.processDocument(
        fakeOpenAPIFile,
        {
          path: __dirname + '/__mocks__/collision/components.yaml',
          ignoreComponentCollisions: true,
        },
        fakeLogger
      )
    ).toEqual({
      ...fakeOpenAPIFile,
      document: {
        ...fakeOpenAPIFile.document,
        components: {
          ...fakeOpenAPIFile.document.components,
          schemas: {
            ...fakeOpenAPIFile.document.components?.schemas,
            Pet: {
              type: 'object',
              required: ['id'],
              properties: {
                id: {
                  type: 'integer',
                  format: 'int64',
                },
              },
            },
          },
        },
      },
    });

    expect(fakeLogger.warning).toBeCalledTimes(0);
    expect(fakeLogger.error).toBeCalledTimes(0);
  });
});
