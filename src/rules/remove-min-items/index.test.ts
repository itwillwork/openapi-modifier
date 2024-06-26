import processor from './index';

describe('remove-min-items rule', () => {
  test('regular', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      components: {
        schemas: {
          ExmapleDTO: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'number',
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
            ExmapleDTO: {
              type: 'array',
              items: {
                type: 'number',
              },
            },
          },
        },
      },
    });

    expect(fakeLogger.warning).toBeCalledTimes(0);
  });

  test('regular, use showUnusedWarning', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      components: {
        schemas: {},
      },
    });

    expect(processor.processDocument(fakeOpenAPIFile, {
      showUnusedWarning: true,
    }, fakeLogger)).toEqual({
      ...fakeOpenAPIFile,
      document: {
        ...fakeOpenAPIFile.document,
      },
    });

    expect(fakeLogger.warning).toBeCalledLoggerMethod(/Not found schemas with min-items/, 1);
  });
});
