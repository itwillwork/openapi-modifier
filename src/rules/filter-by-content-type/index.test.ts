import processor from './index';

describe('filter-by-content-type rule', () => {
  test('regular', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      paths: {
        '/pets': {
          get: {
            summary: 'List all pets',
            responses: {
              '403': {
                description: '',
                content: {
                  'multipart/form-data': {
                    schema: {
                      type: 'number',
                    },
                  },
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
          disabled: ['multipart/form-data'],
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
              responses: {
                '403': {
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

  test('regular, components.requestBodies', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      components: {
        requestBodies: {
          TestRequestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'number',
                },
              },
              '*/*': {
                schema: {
                  type: 'object',
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
          disabled: ['multipart/form-data'],
        },
        fakeLogger,
          {ruleName: ''}
      )
    ).toEqual({
      ...fakeOpenAPIFile,
      document: {
        ...fakeOpenAPIFile.document,
        components: {
          requestBodies: {
            TestRequestBody: {
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
    });

    expect(fakeLogger.warning).toBeCalledTimes(0);
  });

  test('regular, components.responses', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      components: {
        responses: {
          200: {
            description: '',
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'number',
                },
              },
              '*/*': {
                schema: {
                  type: 'object',
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
          disabled: ['multipart/form-data'],
        },
        fakeLogger,
          {ruleName: ''}
      )
    ).toEqual({
      ...fakeOpenAPIFile,
      document: {
        ...fakeOpenAPIFile.document,
        components: {
          responses: {
            200: {
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
            responses: {
              200: {
                description: '',
                content: {
                  '*/*': {
                    schema: {
                      type: 'string',
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
          enabled: ['txt'],
          disabled: ['application/json'],
        },
        fakeLogger,
          {ruleName: ''}
      )
    ).toEqual({
      ...fakeOpenAPIFile,
    });

    expect(fakeLogger.warning).toBeCalledLoggerMethod(/Not usage/, 2);
  });

  test('usage option: enabled', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      paths: {
        '/pets': {
          get: {
            summary: 'List all pets',
            responses: {
              '403': {
                description: '',
                content: {
                  'multipart/form-data': {
                    schema: {
                      type: 'number',
                    },
                  },
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
          enabled: ['*/*'],
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
              responses: {
                '403': {
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
  });

  test('usage option: disabled', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      paths: {
        '/pets': {
          get: {
            summary: 'List all pets',
            responses: {
              '403': {
                description: '',
                content: {
                  'multipart/form-data': {
                    schema: {
                      type: 'number',
                    },
                  },
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
          disabled: ['*/*'],
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
              responses: {
                '403': {
                  description: '',
                  content: {
                    'multipart/form-data': {
                      schema: {
                        type: 'number',
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
  });
});
