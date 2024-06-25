import processor from './index';

describe('patch-endpoint-schema rule', () => {
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
                    schemaDiff: {
                        responses: {
                            '200': {
                                description: 'Test 200',
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
                                '200': {
                                    description: 'Test 200',
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
            },
        });

        expect(fakeLogger.warning).toBeCalledTimes(0);
    });

    test('regular, use deepmerge', () => {
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
                    schemaDiff: {
                        responses: {
                            '200': {
                                description: 'Test 200',
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
                                            },
                                        },
                                    },
                                },
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
                        correction: 'responses.200.content.*/*.schema',
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
        });

        expect(fakeLogger.warning).toBeCalledTimes(0);
    });
});
