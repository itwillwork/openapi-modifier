import processor from './index';
import { z } from 'zod';
import { parameterInConfigSchema } from '../common/config';

describe('remove-deprecated rule', () => {
  test('regular', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      components: {
        schemas: {
          TestDeprecatedSchemaDTO: {
            deprecated: true,
            type: 'string',
          },
          TestObjectSchemaWithDeprecatedFieldDTO: {
            type: 'object',
            properties: {
              testField: {
                type: 'number',
              },
              deprecatedField: {
                deprecated: true,
                type: 'number',
              },
            },
          },
          TestDeprecatedArraySchemaDTO: {
            type: 'array',
            deprecated: true,
            items: {
              type: 'string',
            },
          },
        },
      },
      paths: {
        '/deprecated-endpoint': {
          get: {
            deprecated: true,
            summary: '',
            responses: {},
          },
          post: {
            summary: '',
            responses: {},
          },
        },
        '/deprecated-parameter': {
          post: {
            parameters: [
              {
                in: 'query',
                name: 'filter',
                schema: {
                  type: 'integer',
                },
              },
              {
                in: 'query',
                name: 'deprecated-filter',
                deprecated: true,
                schema: {
                  type: 'string',
                },
              },
            ],
            summary: '',
            responses: {},
          },
        },
        '/deprecated-body-field': {
          post: {
            summary: '',
            requestBody: {
              content: {
                '*/*': {
                  schema: {
                    type: 'object',
                    properties: {
                      testField: {
                        type: 'number',
                      },
                      deprecatedField: {
                        deprecated: true,
                        type: 'number',
                      },
                    },
                  },
                },
              },
            },
            responses: {},
          },
        },
        '/deprecated-response': {
          post: {
            summary: '',
            responses: {
              '200': {
                description: '',
                content: {
                  '*/*': {
                    schema: {
                      type: 'object',
                      properties: {
                        testField: {
                          type: 'number',
                        },
                        deprecatedField: {
                          deprecated: true,
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
      },
    });

    expect(processor.processDocument(fakeOpenAPIFile, {}, fakeLogger, {ruleName: ''})).toEqual({
      ...fakeOpenAPIFile,
      document: {
        ...fakeOpenAPIFile.document,
        components: {
          schemas: {
            TestObjectSchemaWithDeprecatedFieldDTO: {
              type: 'object',
              properties: {
                testField: {
                  type: 'number',
                },
              },
            },
          },
        },
        paths: {
          '/deprecated-endpoint': {
            post: {
              summary: '',
              responses: {},
            },
          },
          '/deprecated-parameter': {
            post: {
              parameters: [
                {
                  in: 'query',
                  name: 'filter',
                  schema: {
                    type: 'integer',
                  },
                },
              ],
              summary: '',
              responses: {},
            },
          },
          '/deprecated-body-field': {
            post: {
              summary: '',
              requestBody: {
                content: {
                  '*/*': {
                    schema: {
                      type: 'object',
                      properties: {
                        testField: {
                          type: 'number',
                        },
                      },
                    },
                  },
                },
              },
              responses: {},
            },
          },
          '/deprecated-response': {
            post: {
              summary: '',
              responses: {
                '200': {
                  description: '',
                  content: {
                    '*/*': {
                      schema: {
                        type: 'object',
                        properties: {
                          testField: {
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
        },
      },
    });

    expect(fakeLogger.warning).toBeCalledTimes(0);
    expect(fakeLogger.error).toBeCalledTimes(0);
  });

  test('regular, with ignores', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      components: {
        schemas: {
          TestDeprecatedSchemaDTO: {
            deprecated: true,
            type: 'string',
          },
        },
      },
      paths: {
        '/deprecated-endpoint': {
          get: {
            deprecated: true,
            summary: '',
            responses: {},
          },
          post: {
            summary: '',
            responses: {},
          },
        },
        '/deprecated-parameter': {
          post: {
            parameters: [
              {
                in: 'query',
                name: 'filter',
                schema: {
                  type: 'integer',
                },
              },
              {
                in: 'query',
                name: 'deprecated-filter',
                deprecated: true,
                schema: {
                  type: 'string',
                },
              },
            ],
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
          ignoreEndpointParameters: [{
            path: '/deprecated-parameter',
            method: 'post',
            name: 'deprecated-filter',
            in: 'query',
          }],
          ignoreEndpoints: [{
            path: '/deprecated-endpoint',
            method: 'get',
          }],
          ignoreComponents: [{
            componentName: 'TestDeprecatedSchemaDTO',
          }],
        },
        fakeLogger,
          {ruleName: ''}
      )
    ).toEqual({
      ...fakeOpenAPIFile,
      document: {
        ...fakeOpenAPIFile.document,
        components: {
          schemas: {
            TestDeprecatedSchemaDTO: {
              deprecated: true,
              type: 'string',
            },
          },
        },
        paths: {
          '/deprecated-endpoint': {
            get: {
              deprecated: true,
              summary: '',
              responses: {},
            },
            post: {
              summary: '',
              responses: {},
            },
          },
          '/deprecated-parameter': {
            post: {
              parameters: [
                {
                  in: 'query',
                  name: 'filter',
                  schema: {
                    type: 'integer',
                  },
                },
                {
                  in: 'query',
                  name: 'deprecated-filter',
                  deprecated: true,
                  schema: {
                    type: 'string',
                  },
                },
              ],
              summary: '',
              responses: {},
            },
          },
        },
      },
    });

    expect(fakeLogger.warning).toBeCalledTimes(0);
    expect(fakeLogger.error).toBeCalledTimes(0);
  });

  test('regular, with $ref', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      components: {
        schemas: {
          TestDTO: {
            type: 'object',
            properties: {
              testField: {
                type: 'number',
              },
              deprecatedField: {
                $ref: '#/components/schemas/TestDeprecatedSchemaDTO',
              },
            },
          },
          TestDeprecatedSchemaDTO: {
            deprecated: true,
            type: 'string',
          },
          TestRefSchemaDTO: {
            $ref: '#/components/schemas/TestDeprecatedSchemaDTO',
          },
          IgnoredRefSchemaDTO: {
            $ref: '#/components/schemas/TestDeprecatedSchemaDTO',
          },
        },
      },
    });

    expect(
      processor.processDocument(
        fakeOpenAPIFile,
        {
          ignoreComponents: [
            {
              componentName: 'IgnoredRefSchemaDTO'
            }
          ]
        },
        fakeLogger,
          {ruleName: ''}
      )
    ).toEqual({
      ...fakeOpenAPIFile,
      document: {
        ...fakeOpenAPIFile.document,
        components: {
          schemas: {
            TestDTO: {
              type: 'object',
              properties: {
                testField: {
                  type: 'number',
                },
              }
            },
            IgnoredRefSchemaDTO: {
              $ref: '#/components/schemas/TestDeprecatedSchemaDTO',
            },
          },
        },
      },
    });

    expect(fakeLogger.warning).toBeCalledTimes(0);
    expect(fakeLogger.error).toBeCalledTimes(0);
  });
});
