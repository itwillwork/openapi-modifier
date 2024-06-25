import processor from './index';

describe('patch-schemas rule', () => {
  test('regular, use deepmerge', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      components: {
        schemas: {
          TestSchemaDTO: {
            type: 'string',
            enum: ['1', '2'],
          },
        },
      },
    });

    expect(
      processor.processDocument(
        fakeOpenAPIFile,
          {
            patchMethod: 'deepmerge',
            descriptor: {
              componentName: 'TestSchemaDTO',
            },
            schemaDiff: {
              enum: ['3', '4'],
            },
          },
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
              enum: ['1', '2', '3', '4'],
            },
          },
        },
      },
    });

    expect(fakeLogger.warning).toBeCalledTimes(0);
  });

  test('regular, use merge', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      components: {
        schemas: {
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
              {
                patchMethod: 'merge',
                descriptor: {
                  componentName: 'TestArraySchemaDTO',
                },
                schemaDiff: {
                  items: {
                    type: 'string',
                  },
                },
              },
            fakeLogger
        )
    ).toEqual({
      ...fakeOpenAPIFile,
      document: {
        ...fakeOpenAPIFile.document,
        components: {
          schemas: {
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

  test('regular, use merge with correction', () => {
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
              {
                patchMethod: 'merge',
                descriptor: {
                  componentName: 'TestObjectDTO',
                  correction: 'properties.TestArraySchemaDTO.items'
                },
                schemaDiff: {
                  type: 'string',
                  enum: ['3', '4'],
                },
              },
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
