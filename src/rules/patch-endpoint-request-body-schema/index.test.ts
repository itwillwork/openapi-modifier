import processor from './index';

describe('patch-endpoint-request-body-schema rule', () => {
    test('regular, use merge', () => {
        const fakeLogger = global.createFakeLogger();
        const fakeOpenAPIFile = global.createFakeOpenAPIFile({
            paths: {
                '/all-pets': {
                    post: {
                        description: '',
                        requestBody: {
                            content: {
                                '*/*': {
                                    schema: {
                                        type: 'object',
                                    },
                                },
                            },
                        },
                        responses: {},
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
                        method: 'POST',
                    },
                    contentType: '*/*',
                    schemaDiff: {
                        type: 'string',
                    },
                },
                fakeLogger,
                {ruleName: ''}
            )
        ).toEqual({
            ...fakeOpenAPIFile,
            document: {
                ...fakeOpenAPIFile.document,
                paths: {
                    '/all-pets': {
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
                            responses: {},
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
                        responses: {},
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
                        method: 'POST',
                    },
                    contentType: '*/*',
                    schemaDiff: {
                        enum: ['1', '2'],
                    },
                },
                fakeLogger,
                {ruleName: ''}
            )
        ).toEqual({
            ...fakeOpenAPIFile,
            document: {
                ...fakeOpenAPIFile.document,
                paths: {
                    '/pets': {
                        post: {
                            description: '',
                            requestBody: {
                                content: {
                                    '*/*': {
                                        schema: {
                                            type: 'string',
                                            enum: ['1', '2'],
                                        },
                                    },
                                },
                            },
                            responses: {},
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
                    post: {
                        description: '',
                        requestBody: {
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
                        responses: {},
                    },
                },
            },
        });

        expect(
            processor.processDocument(
                fakeOpenAPIFile, {
                    patchMethod: 'merge',
                    endpointDescriptor: {
                        path: '/pets',
                        method: 'POST',
                    },
                    correction: 'testField',
                    contentType: '*/*',
                    schemaDiff: {
                        enum: ['3', '4'],
                    },
                },
                fakeLogger,
                {ruleName: ''}
            )
        ).toEqual({
            ...fakeOpenAPIFile,
            document: {
                ...fakeOpenAPIFile.document,
                paths: {
                    '/pets': {
                        post: {
                            description: '',
                            requestBody: {
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
                            responses: {},
                        },
                    },
                },
            },
        });

        expect(fakeLogger.warning).toBeCalledTimes(0);
    });

    test('regular, use merge with difficult correction', () => {
        const fakeLogger = global.createFakeLogger();
        const fakeOpenAPIFile = global.createFakeOpenAPIFile({
            paths: {
                '/pets': {
                    post: {
                        description: '',
                        requestBody: {
                            content: {
                                '*/*': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                testField: {
                                                    enum: ['1', '2'],
                                                    type: 'string',
                                                },
                                            },
                                        }
                                    },
                                },
                            },
                        },
                        responses: {},
                    },
                },
            },
        });

        expect(
            processor.processDocument(
                fakeOpenAPIFile, {
                    patchMethod: 'merge',
                    endpointDescriptor: {
                        path: '/pets',
                        method: 'POST',
                    },
                    correction: '[].testField',
                    contentType: '*/*',
                    schemaDiff: {
                        enum: ['3', '4'],
                    },
                },
                fakeLogger,
                {ruleName: ''}
            )
        ).toEqual({
            ...fakeOpenAPIFile,
            document: {
                ...fakeOpenAPIFile.document,
                paths: {
                    '/pets': {
                        post: {
                            description: '',
                            requestBody: {
                                content: {
                                    '*/*': {
                                        schema: {
                                            type: 'array',
                                            items: {
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
                            responses: {},
                        },
                    },
                },
            },
        });

        expect(fakeLogger.warning).toBeCalledTimes(0);
    });

    test('regular, for all content type', () => {
        const fakeLogger = global.createFakeLogger();
        const fakeOpenAPIFile = global.createFakeOpenAPIFile({
            paths: {
                '/pets': {
                    post: {
                        description: '',
                        requestBody: {
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
                        responses: {},
                    },
                },
            },
        });

        expect(
            processor.processDocument(
                fakeOpenAPIFile, {
                    patchMethod: 'merge',
                    endpointDescriptor: {
                        path: '/pets',
                        method: 'POST',
                    },
                    correction: 'testField',
                    schemaDiff: {
                        enum: ['3', '4'],
                    },
                },
                fakeLogger,
                {ruleName: ''}
            )
        ).toEqual({
            ...fakeOpenAPIFile,
            document: {
                ...fakeOpenAPIFile.document,
                paths: {
                    '/pets': {
                        post: {
                            description: '',
                            requestBody: {
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
                            responses: {},
                        },
                    },
                },
            },
        });

        expect(fakeLogger.warning).toBeCalledTimes(0);
    });

    test('regular, simple endpoint descriptor', () => {
        const fakeLogger = global.createFakeLogger();
        const fakeOpenAPIFile = global.createFakeOpenAPIFile({
            paths: {
                '/pets': {
                    post: {
                        description: '',
                        requestBody: {
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
                        responses: {},
                    },
                },
            },
        });

        expect(
            processor.processDocument(
                fakeOpenAPIFile, {
                    patchMethod: 'merge',
                    endpointDescriptor: 'POST /pets',
                    correction: 'testField',
                    schemaDiff: {
                        enum: ['3', '4'],
                    },
                },
                fakeLogger,
                {ruleName: ''}
            )
        ).toEqual({
            ...fakeOpenAPIFile,
            document: {
                ...fakeOpenAPIFile.document,
                paths: {
                    '/pets': {
                        post: {
                            description: '',
                            requestBody: {
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
                            responses: {},
                        },
                    },
                },
            },
        });

        expect(fakeLogger.warning).toBeCalledTimes(0);
    });
});
