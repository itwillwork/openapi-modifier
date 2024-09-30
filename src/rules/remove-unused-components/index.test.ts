import processor from './index';

describe('remove-unused-components rule', () => {
  test('regular', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      components: {
        schemas: {
          Date: {
            type: 'string',
          },
          AttributesDTO: {
            type: 'string',
          },
          Pet: {
            type: 'object',
            properties: {
              date: {
                $ref: '#/components/schemas/Date',
              },
              attributes: {
                type: 'object',
                additionalProperties: {
                  $ref: '#/components/schemas/AttributesDTO',
                },
              },
              testWithOf: {
                $ref: '#/components/schemas/TestObjectWithOfDTO',
              },
              testWithDiscriminator: {
                $ref: '#/components/schemas/TestObjectWithDiscriminatorDto',
              },
            },
          },
          TestSchemaRefOneOfDTO: {
            type: 'string',
          },
          TestSchemaRefAllOfDTO: {
            type: 'string',
          },
          TestSchemaRefAnyOfDTO: {
            type: 'string',
          },
          TestObjectWithOfDTO: {
            "type": "object",
            "properties": {
              "anyOfProperty": {
                type: 'object',
                anyOf: [
                  {
                    $ref: '#/components/schemas/TestSchemaRefAnyOfDTO',
                  }
                ]
              },
              "allOfProperty": {
                type: 'object',
                allOf: [
                  {
                    $ref: '#/components/schemas/TestSchemaRefAllOfDTO',
                  }
                ]
              },
              "oneOfProperty": {
                type: 'object',
                oneOf: [
                  {
                    $ref: '#/components/schemas/TestSchemaRefOneOfDTO',
                  }
                ]
              },
            }
          },
          "TestDiscriminatorVariantObject": {
            "type": "object",
            "properties": {
              "foo": {
                "type": "string"
              }
            }
          },
          "TestObjectWithDiscriminatorDto": {
            "discriminator": {
              "mapping": {
                "TEST_DISCRIMINATOR": "#/components/schemas/TestDiscriminatorVariantObject"
              },
              "propertyName": "action"
            },
            "type": "object",
            "properties": {
              "action": {
                "description": "Test discriminator property",
                "enum": [
                  "TEST_DISCRIMINATOR"
                ],
                "type": "string"
              }
            }
          },
          Notification: {
            type: 'object',
            properties: {
              date: {
                $ref: '#/components/schemas/Date',
              },
            },
          },
          Notifications: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Notification',
            },
          },
        },
      },
      paths: {
        '/pets': {
          get: {
            summary: 'Get all pets',
            responses: {
              '200': {
                description: '',
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
      },
    });

    expect(processor.processDocument(fakeOpenAPIFile, {}, fakeLogger, { ruleName: ''})).toEqual({
      ...fakeOpenAPIFile,
      document: {
        ...fakeOpenAPIFile.document,
        components: {
          schemas: {
            Date: {
              type: 'string',
            },
            AttributesDTO: {
              type: 'string',
            },
            Pet: {
              type: 'object',
              properties: {
                date: {
                  $ref: '#/components/schemas/Date',
                },
                attributes: {
                  type: 'object',
                  additionalProperties: {
                    $ref: '#/components/schemas/AttributesDTO',
                  },
                },
                testWithOf: {
                  $ref: '#/components/schemas/TestObjectWithOfDTO',
                },
                testWithDiscriminator: {
                  $ref: '#/components/schemas/TestObjectWithDiscriminatorDto',
                },
              },
            },
            TestSchemaRefOneOfDTO: {
              type: 'string',
            },
            TestSchemaRefAllOfDTO: {
              type: 'string',
            },
            TestSchemaRefAnyOfDTO: {
              type: 'string',
            },
            TestObjectWithOfDTO: {
              "type": "object",
              "properties": {
                "anyOfProperty": {
                  type: 'object',
                  anyOf: [
                    {
                      $ref: '#/components/schemas/TestSchemaRefAnyOfDTO',
                    }
                  ]
                },
                "allOfProperty": {
                  type: 'object',
                  allOf: [
                    {
                      $ref: '#/components/schemas/TestSchemaRefAllOfDTO',
                    }
                  ]
                },
                "oneOfProperty": {
                  type: 'object',
                  oneOf: [
                    {
                      $ref: '#/components/schemas/TestSchemaRefOneOfDTO',
                    }
                  ]
                },
              }
            },
            "TestDiscriminatorVariantObject": {
              "type": "object",
              "properties": {
                "foo": {
                  "type": "string"
                }
              }
            },
            "TestObjectWithDiscriminatorDto": {
              "discriminator": {
                "mapping": {
                  "TEST_DISCRIMINATOR": "#/components/schemas/TestDiscriminatorVariantObject"
                },
                "propertyName": "action"
              },
              "type": "object",
              "properties": {
                "action": {
                  "description": "Test discriminator property",
                  "enum": [
                    "TEST_DISCRIMINATOR"
                  ],
                  "type": "string"
                }
              }
            },
          },
        },
        paths: {
          '/pets': {
            get: {
              summary: 'Get all pets',
              responses: {
                '200': {
                  description: '',
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
        },
      },
    });

    expect(fakeLogger.warning).toBeCalledTimes(0);
  });

  test('regular, usage config.ignore', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      components: {
        schemas: {
          Date: {
            type: 'string',
          },
          AttributesDTO: {
            type: 'string',
          },
          Pet: {
            type: 'object',
            properties: {
              date: {
                $ref: '#/components/schemas/Date',
              },
              attributes: {
                type: 'object',
                additionalProperties: {
                  $ref: '#/components/schemas/AttributesDTO',
                },
              },
            },
          },
          TestIgnoreDescriptionDTO: {
            type: 'string',
          },
          Notification: {
            type: 'object',
            properties: {
              date: {
                $ref: '#/components/schemas/Date',
              },
            },
          },
          Notifications: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Notification',
            },
          },
        },
      },
      paths: {
        '/pets': {
          get: {
            summary: 'Get all pets',
            responses: {
              '200': {
                description: '',
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
      },
    });

    expect(
      processor.processDocument(
        fakeOpenAPIFile,
        {
          ignore: [{
            componentName: 'Notifications',
          },
          'TestIgnoreDescriptionDTO'
          ],
        },
        fakeLogger,
          {ruleName: ''}
      )
    ).toEqual({
      ...fakeOpenAPIFile,
      document: {
        ...fakeOpenAPIFile.document,
        paths: {
          ...fakeOpenAPIFile.document.paths,
        },
      },
    });

    expect(fakeLogger.warning).toBeCalledTimes(0);
  });

  test('regular, show not usaged warning', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      components: {
        schemas: {
          Date: {
            type: 'string',
          },
          AttributesDTO: {
            type: 'string',
          },
          Pet: {
            type: 'object',
            properties: {
              date: {
                $ref: '#/components/schemas/Date',
              },
              attributes: {
                type: 'object',
                additionalProperties: {
                  $ref: '#/components/schemas/AttributesDTO',
                },
              },
            },
          },
          Notification: {
            type: 'object',
            properties: {
              date: {
                $ref: '#/components/schemas/Date',
              },
            },
          },
          Notifications: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Notification',
            },
          },
        },
      },
      paths: {
        '/pets': {
          get: {
            summary: 'Get all pets',
            responses: {
              '200': {
                description: '',
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
      },
    });

    expect(
      processor.processDocument(
        fakeOpenAPIFile,
        {
          ignore: [{
            componentName: 'Notifications',
          }, {
            componentName: 'TestNotUsagedComponent',
          }],
        },
        fakeLogger,
          {ruleName: ''}
      )
    ).toEqual({
      ...fakeOpenAPIFile,
      document: {
        ...fakeOpenAPIFile.document,
        paths: {
          ...fakeOpenAPIFile.document.paths,
        },
      },
    });

    expect(fakeLogger.warning).toBeCalledLoggerMethod(/Not usaged ignore component/, 1);
  });
});
