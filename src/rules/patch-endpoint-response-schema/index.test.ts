import processor from './index';

describe('patch-endpoint-response-schema rule', () => {
    test('regular, use merge', () => {
        const fakeLogger = global.createFakeLogger();
        const fakeOpenAPIFile = global.createFakeOpenAPIFile({
            paths: {
                '/all-pets': {
                    get: {
                        summary: '',
                        responses: {
                            '401': {
                                description: 'Test 401',
                                content: {
                                    '*/*': {
                                        schema: {
                                            type: 'object',
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
                    patchMethod: 'merge',
                    endpointDescriptor: {
                        path: '/all-pets',
                        method: 'GET',
                    },
                    descriptor: {
                        code: '401',
                        contentType: '*/*',
                    },
                    schemaDiff: {
                        type: 'string',
                    },
                },
                fakeLogger
            )
        ).toEqual({
            ...fakeOpenAPIFile,
            document: {
                ...fakeOpenAPIFile.document,
                paths: {
                    '/all-pets': {
                        get: {
                            summary: '',
                            responses: {
                                '401': {
                                    description: 'Test 401',
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
            },
        });

        expect(fakeLogger.warning).toBeCalledTimes(0);
    });

    test('regular, use deeepmerge', () => {
        const fakeLogger = global.createFakeLogger();
        const fakeOpenAPIFile = global.createFakeOpenAPIFile({
            paths: {
                '/pets': {
                    get: {
                        summary: '',
                        responses: {
                            '401': {
                                description: 'Test 401',
                                content: {
                                    '*/*': {
                                        schema: {
                                            type: 'object',
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
                    patchMethod: 'deepmerge',
                    endpointDescriptor: {
                        path: '/pets',
                        method: 'GET',
                    },
                    descriptor: {
                        code: '401',
                        contentType: '*/*',
                    },
                    schemaDiff: {
                        type: 'string',
                    },
                },
                fakeLogger
            )
        ).toEqual({
            ...fakeOpenAPIFile,
            document: {
                ...fakeOpenAPIFile.document,
                paths: {
                    '/pets': {
                        get: {
                            summary: '',
                            responses: {
                                '401': {
                                    description: 'Test 401',
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
            },
        });

        expect(fakeLogger.warning).toBeCalledTimes(0);
    });

    test('regular, use merge with correction', () => {
        const fakeLogger = global.createFakeLogger();
        const fakeOpenAPIFile = global.createFakeOpenAPIFile({
            paths: {
                '/pets': {
                    get: {
                        summary: '',
                        responses: {
                            '200': {
                                description: 'Test 200',
                                content: {
                                    '*/*': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                testField: {
                                                    enum: ['1', '2'],
                                                    type: 'string',
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

        expect(
            processor.processDocument(
                fakeOpenAPIFile,
                {
                    patchMethod: 'merge',
                    endpointDescriptor: {
                        path: '/pets',
                        method: 'GET',
                    },
                    descriptor: {
                        code: '200',
                        contentType: '*/*',
                    },
                    descriptorCorrection: 'properties.testField',
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
                paths: {
                    '/pets': {
                        get: {
                            summary: '',
                            responses: {
                                '200': {
                                    description: 'Test 200',
                                    content: {
                                        '*/*': {
                                            schema: {
                                                type: 'object',
                                                properties: {
                                                    testField: {
                                                        enum: ['3', '4'],
                                                        type: 'string',
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
            },
        });

        expect(fakeLogger.warning).toBeCalledTimes(0);
    });
});
