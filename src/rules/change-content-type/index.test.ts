import processor from './index';

describe('change-content-type rule', () => {
  test('regular', () => {
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
          map: {
            '*/*': 'application/json',
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
          '/api/v1/pets': {
            get: {
              summary: '',
              tags: [],
              responses: {
                200: {
                  description: '',
                  content: {
                    'application/json': {
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
      },
    });

    expect(fakeLogger.warning).toBeCalledTimes(0);
  });

  test('regular, common requestBodies', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      components: {
        requestBodies: {
          TestRequestBody: {
            content: {
              '*/*': {
                schema: {
                  type: 'number',
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
          map: {
            '*/*': 'application/json',
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
          requestBodies: {
            TestRequestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'number',
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

  test('regular, common responses', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      components: {
        responses: {
          '200': {
            description: '',
            content: {
              '*/*': {
                schema: {
                  type: 'number',
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
          map: {
            '*/*': 'application/json',
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
          responses: {
            '200': {
              description: '',
              content: {
                'application/json': {
                  schema: {
                    type: 'number',
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
          map: {
            'test/test': '',
          },
        },
        fakeLogger,
          {ruleName: ''}
      )
    ).toEqual({
      ...fakeOpenAPIFile,
    });

    expect(fakeLogger.warning).toBeCalledLoggerMethod(/is not used/, 1);
  });
});
