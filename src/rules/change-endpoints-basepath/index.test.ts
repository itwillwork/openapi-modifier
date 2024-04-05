import processor from './index';

describe('change-endpoints-basepath rule', () => {
    test('regular', () => {
        const fakeLogger = global.createFakeLogger();
        const fakeOpenAPIFile = global.createFakeOpenAPIFile({
           paths: {
                "/api/v1/pets": {
                    "get": {
                        summary: "",
                        tags: [],
                        responses: {},
                    }
                },
            }
        });

        expect(processor.processDocument(fakeOpenAPIFile, {
            fromPrefix: '/api/v1',
        },
            fakeLogger,
        )).toEqual({
            ...fakeOpenAPIFile,
            document: {
                ...fakeOpenAPIFile.document,
                paths: {
                "/pets": {
                    "get": {
                        summary: "",
                        tags: [],
                        responses: {},
                    }
                },
            },
            }
        });

        expect(fakeLogger.warning).toBeCalledTimes(0);
    });

    test('regular, logger warning', () => {
        const fakeLogger = global.createFakeLogger();
        const fakeOpenAPIFile = global.createFakeOpenAPIFile({
           paths: {
                "/api/v1/pets": {
                    "get": {
                        summary: "",
                        tags: [],
                        responses: {},
                    }
                },
            }
        });

        expect(processor.processDocument(fakeOpenAPIFile, {
            fromPrefix: '/api/v2',
        },
            fakeLogger,
        )).toEqual({
            ...fakeOpenAPIFile,
        });

          expect(fakeLogger.warning).toBeCalledLoggerMethod(/Not found endpoints with prefix/, 1);
    });

    test('usage option: toPrefix', () => {
        const fakeLogger = global.createFakeLogger();
        const fakeOpenAPIFile = global.createFakeOpenAPIFile({
             paths: {
                "/api/v1/pets": {
                    "get": {
                        summary: "",
                        tags: [],
                        responses: {},
                    }
                },
            }
        });

        expect(processor.processDocument(fakeOpenAPIFile, {
            fromPrefix: '/api/v1',
                toPrefix: "/proxy"
            },
            fakeLogger,
        )).toEqual({
            ...fakeOpenAPIFile,
            document: {
                ...fakeOpenAPIFile.document,
                paths: {
                    "/proxy/pets": {
                        "get": {
                            summary: "",
                            tags: [],
                            responses: {},
                        }
                    },
                }
            },
        });

        expect(fakeLogger.warning).toBeCalledTimes(0);
    });
});