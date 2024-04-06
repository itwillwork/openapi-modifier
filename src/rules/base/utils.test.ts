import { forEachSchemas, forEachOperation } from './utils';

describe('forEachSchemas', () => {
  test('regular', () => {
    const fakeLogger = global.createFakeLogger();
    const callback = jest.fn(() => {});
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
        },
      },
      paths: {
        '/api/v1/pets': {
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

    forEachSchemas(fakeOpenAPIFile, callback);

    expect(callback).toBeCalledTimes(12);
  });
});

describe('forEachOperation', () => {
  test('regular', () => {
    const fakeLogger = global.createFakeLogger();
    const callback = jest.fn(() => {});
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      paths: {
        '/api/v1/pets': {
          post: {
            description: '',
            responses: {},
          },
        },
      },
    });

    forEachOperation(fakeOpenAPIFile, callback);

    expect(callback).toBeCalledTimes(1);
  });
});
