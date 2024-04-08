import { forEachSchema } from './each-schema';

describe('forEachSchema', () => {
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

    forEachSchema(fakeOpenAPIFile, callback);

    expect(callback).toBeCalledTimes(12);
  });
});

