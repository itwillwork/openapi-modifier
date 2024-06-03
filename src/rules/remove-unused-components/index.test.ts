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

    expect(processor.processDocument(fakeOpenAPIFile, {}, fakeLogger)).toEqual({
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
      },
    });

    expect(fakeLogger.warning).toBeCalledTimes(0);
  });

  test('regular config.ignore', () => {
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

    expect(processor.processDocument(fakeOpenAPIFile, {
      ignore: ['Notifications'],
    }, fakeLogger)).toEqual({
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

});
