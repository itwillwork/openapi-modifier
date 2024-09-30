import { forEachSchema } from './each-schema';

describe('forEachSchema', () => {
  test('regular', () => {
    const fakeLogger = global.createFakeLogger();
    const callback = jest.fn(() => {});
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
            },
          },
        },
        parameters: {
          TestParameter: {
            name: 'test',
            in: 'path',
            schema: {
              type: 'number',
            },
          },
        },
        responses: {
          '200': {
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
          TestSchemaAnyOfDTO: {
            oneOf: [
              {
                type: 'number',
              },
              {
                anyOf: [
                  {
                    type: 'number',
                  },
                ],
              },
              {
                allOf: [
                  {
                    type: 'number',
                  },
                ],
              },
            ],
          },
          TestObjectDTO: {
            type: 'object',
            properties: {
              TestObjectField: {
                type: 'number',
              },
            },
          },
          TestObjectWithRefAdditionalPropertiesDTO: {
            type: 'object',
            properties: {
              TestObjectField: {
                type: 'number',
              },
            },
            additionalProperties: {
              $ref: '#/components/schemas/TestSchemaDTO',
            },
          },
          TestObjectWithSchemaAdditionalPropertiesDTO: {
            type: 'object',
            properties: {
              TestObjectField: {
                type: 'number',
              },
            },
            additionalProperties: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/DictAdditionalServiceDto',
              },
            },
          },
          TestSchemaRefOneOfDTO: {
            type: 'string',
          },
          TestObjectWithOneOfDTO: {
            type: 'object',
            oneOf: [
              {
                $ref: '#/components/schemas/TestSchemaRefOneOfDTO',
              }
            ]
          },
          TestSchemaRefAllOfDTO: {
            type: 'string',
          },
          TestObjectWithAllOfDTO: {
            type: 'object',
            allOf: [
              {
                $ref: '#/components/schemas/TestSchemaRefAllOfDTO',
              }
            ]
          },
          TestSchemaRefAnyOfDTO: {
            type: 'string',
          },
          TestObjectWithAnyOfDTO: {
            type: 'object',
            anyOf: [
              {
                $ref: '#/components/schemas/TestSchemaRefAnyOfDTO',
              }
            ]
          },
        },
      },
      paths: {
        '/api/v1/pets': {
          parameters: [
            {
              name: 'test',
              in: 'query',
              schema: {
                type: 'number',
              },
            },
          ],
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
              404: {
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

    forEachSchema(fakeOpenAPIFile, callback);

    expect(callback).toBeCalledTimes(34);
  });
});
