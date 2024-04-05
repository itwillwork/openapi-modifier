import processor from './index';

describe('remove-max-items rule', () => {
    test('regular', () => {
        const fakeLogger = global.createFakeLogger();
        const fakeOpenAPIFile = global.createFakeOpenAPIFile({
            components: {
                schemas: {
                    ExmapleDTO: {
                        type: "array",
                        maxItems: 1,
                        items: {
                            type: "number"
                        }
                    }
                }
            }
        });

        expect(processor.processDocument(fakeOpenAPIFile, {},
            fakeLogger,
        )).toEqual({
            ...fakeOpenAPIFile,
            document: {
                ...fakeOpenAPIFile.document,
                components: {
                    schemas: {
                        ExmapleDTO: {
                            type: "array",
                            items: {
                                type: "number"
                            }
                        }
                    }
                }
            }
        });

        expect(fakeLogger.warning).toBeCalledTimes(0);
    });
});