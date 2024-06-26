import processor from './index';

describe('remove-max-items rule', () => {
  test('regular', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      components: {
        schemas: {
          ExmapleDTO: {
            type: 'array',
            maxItems: 1,
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

  test('regular, usage showUnusedWarning', () => {
    const fakeLogger = global.createFakeLogger();
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      components: {
        schemas: { },
      },
    });

    expect(processor.processDocument(fakeOpenAPIFile, {
      showUnusedWarning: true,
    }, fakeLogger)).toEqual({
      ...fakeOpenAPIFile,
      document: {
        ...fakeOpenAPIFile.document,
        components: {
          schemas: { },
        },
      },
    });

    expect(fakeLogger.warning).toBeCalledLoggerMethod(/Not found schemas with max-items/, 1);
  });
});
