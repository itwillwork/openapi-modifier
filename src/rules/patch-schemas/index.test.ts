import processor from './index';

describe('patch-schemas rule', () => {
  test('regular, component', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      components: {
        schemas: {
          TestSchemaDTO: {
            type: 'string',
          },
          TestArraySchemaDTO: {
            type: 'array',
            items: {
              type: 'number',
            },
          },
        },
      },
    });

    expect(
      processor.processDocument(
        fakeOpenAPIFile,
        [
          {
            patchMethod: 'merge',
            descriptor: {
              type: 'component-schema',
              componentName: 'TestSchemaDTO',
            },
            schemaDiff: {
              enum: ['1', '2'],
            },
          },
          {
            patchMethod: 'replace',
            descriptor: {
              type: 'component-schema',
              componentName: 'TestArraySchemaDTO',
            },
            schemaDiff: {
              items: {
                type: 'string',
              },
            },
          },
        ],
        fakeLogger
      )
    ).toEqual({
      ...fakeOpenAPIFile,
      document: {
        ...fakeOpenAPIFile.document,
        components: {
          schemas: {
            TestSchemaDTO: {
              type: 'string',
              enum: ['1', '2'],
            },
            TestArraySchemaDTO: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
    });

    expect(fakeLogger.warning).toBeCalledTimes(0);
  });

  test('regular, endpoint', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      paths: {
        '/pets': {
          get: {
            summary: '',
            responses: {
              '401': {
                description: 'Test 401',
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
        '/all-pets': {
          get: {
            summary: '',
            responses: {
              '401': {
                description: 'Test 401',
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
        [
          {
            patchMethod: 'merge',
            descriptor: {
              type: 'endpoint',
              path: '/pets',
              method: 'GET',
            },
            schemaDiff: {
              responses: {
                '200': {
                  description: 'Test 200',
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
          {
            patchMethod: 'replace',
            descriptor: {
              type: 'endpoint',
              path: '/all-pets',
              method: 'GET',
            },
            schemaDiff: {
              responses: {
                '200': {
                  description: 'Test 200',
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
        ],
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
              responses: {
                '200': {
                  description: 'Test 200',
                  content: {
                    '*/*': {
                      schema: {
                        type: 'object',
                      },
                    },
                  },
                },
                '401': {
                  description: 'Test 401',
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
          '/all-pets': {
            get: {
              summary: '',
              responses: {
                '200': {
                  description: 'Test 200',
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

  test('regular, endpoint-response', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      paths: {
        '/pets': {
          get: {
            summary: '',
            responses: {
              '401': {
                description: 'Test 401',
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
        '/all-pets': {
          get: {
            summary: '',
            responses: {
              '401': {
                description: 'Test 401',
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
        [
          {
            patchMethod: 'merge',
            descriptor: {
              type: 'endpoint-response',
              path: '/pets',
              method: 'GET',
              code: '401',
              contentType: '*/*',
            },
            schemaDiff: {
              type: 'string',
            },
          },
          {
            patchMethod: 'replace',
            descriptor: {
              type: 'endpoint-response',
              path: '/all-pets',
              method: 'GET',
              code: '401',
              contentType: '*/*',
            },
            schemaDiff: {
              type: 'string',
            },
          },
        ],
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
              responses: {
                '401': {
                  description: 'Test 401',
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
          '/all-pets': {
            get: {
              summary: '',
              responses: {
                '401': {
                  description: 'Test 401',
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
      },
    });

    expect(fakeLogger.warning).toBeCalledTimes(0);
  });

  test('regular, endpoint-request-body', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      paths: {
        '/pets': {
          post: {
            description: '',
            requestBody: {
              content: {
                '*/*': {
                  schema: {
                    type: 'string',
                  },
                },
              },
            },
            responses: {},
          },
        },
        '/all-pets': {
          post: {
            description: '',
            requestBody: {
              content: {
                '*/*': {
                  schema: {
                    type: 'object',
                  },
                },
              },
            },
            responses: {},
          },
        },
      },
    });

    expect(
      processor.processDocument(
        fakeOpenAPIFile,
        [
          {
            patchMethod: 'merge',
            descriptor: {
              type: 'endpoint-request-body',
              path: '/pets',
              method: 'POST',
              contentType: '*/*',
            },
            schemaDiff: {
              enum: ['1', '2'],
            },
          },
          {
            patchMethod: 'replace',
            descriptor: {
              type: 'endpoint-request-body',
              path: '/all-pets',
              method: 'POST',
              contentType: '*/*',
            },
            schemaDiff: {
              type: 'string',
            },
          },
        ],
        fakeLogger
      )
    ).toEqual({
      ...fakeOpenAPIFile,
      document: {
        ...fakeOpenAPIFile.document,
        paths: {
          '/pets': {
            post: {
              description: '',
              requestBody: {
                content: {
                  '*/*': {
                    schema: {
                      type: 'string',
                      enum: ['1', '2'],
                    },
                  },
                },
              },
              responses: {},
            },
          },
          '/all-pets': {
            post: {
              description: '',
              requestBody: {
                content: {
                  '*/*': {
                    schema: {
                      type: 'string',
                    },
                  },
                },
              },
              responses: {},
            },
          },
        },
      },
    });

    expect(fakeLogger.warning).toBeCalledTimes(0);
  });

  test('regular, endpoint-parameter', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      paths: {
        '/pets': {
          post: {
            description: '',
            parameters: [
              {
                in: 'query',
                name: 'filter',
                schema: {
                  type: 'string',
                },
              },
            ],
            responses: {},
          },
        },
        '/all-pets': {
          post: {
            description: '',
            parameters: [
              {
                in: 'query',
                name: 'filter',
                schema: {
                  type: 'number',
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
        [
          {
            patchMethod: 'merge',
            descriptor: {
              type: 'endpoint-parameter',
              path: '/pets',
              method: 'POST',
              parameterName: 'filter',
              parameterIn: 'query',
            },
            schemaDiff: {
              enum: ['1', '2'],
            },
          },
          {
            patchMethod: 'replace',
            descriptor: {
              type: 'endpoint-parameter',
              path: '/all-pets',
              method: 'POST',
              parameterName: 'filter',
              parameterIn: 'query',
            },
            schemaDiff: {
              type: 'string',
            },
          },
        ],
        fakeLogger
      )
    ).toEqual({
      ...fakeOpenAPIFile,
      document: {
        ...fakeOpenAPIFile.document,
        paths: {
          '/pets': {
            post: {
              description: '',
              parameters: [
                {
                  in: 'query',
                  name: 'filter',
                  schema: {
                    type: 'string',
                    enum: ['1', '2'],
                  },
                },
              ],
              responses: {},
            },
          },
          '/all-pets': {
            post: {
              description: '',
              parameters: [
                {
                  in: 'query',
                  name: 'filter',
                  schema: {
                    type: 'string',
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

  test('config is not array', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      paths: {},
    });

    expect(
      processor.processDocument(
        fakeOpenAPIFile,
        {
          // @ts-expect-error
          patchMethod: 'merge',
          descriptor: {
            type: 'endpoint-request-body',
            path: '/pets',
            method: 'POST',
            contentType: '*/*',
          },
          schemaDiff: {
            enum: ['1', '2'],
          },
        },
        fakeLogger
      )
    ).toEqual({
      ...fakeOpenAPIFile,
    });

    expect(fakeLogger.warning).toBeCalledTimes(0);
    expect(fakeLogger.error).toBeCalledLoggerMethod(/Config should be not empty array/, 1);
  });

  test('regular, component with correction', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      components: {
        schemas: {
          TestObjectDTO: {
            type: 'object',
            properties: {
              TestArraySchemaDTO: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: ['1', '2'],
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
            [
              {
                patchMethod: 'replace',
                descriptor: {
                  type: 'component-schema',
                  componentName: 'TestObjectDTO',
                  correction: 'properties.TestArraySchemaDTO.items'
                },
                schemaDiff: {
                  type: 'string',
                  enum: ['3', '4'],
                },
              },
            ],
            fakeLogger
        )
    ).toEqual({
      ...fakeOpenAPIFile,
      document: {
        ...fakeOpenAPIFile.document,
          components: {
              schemas: {
                  TestObjectDTO: {
                      type: 'object',
                      properties: {
                          TestArraySchemaDTO: {
                              type: 'array',
                              items: {
                                  type: 'string',
                                  enum: ['3', '4'],
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

});
