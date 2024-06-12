import processor from './index';
import {z} from "zod";
import {parameterInConfigSchema} from "../common/config";

describe('remove-deprecated rule', () => {
    test('regular', () => {
        const fakeLogger = global.createFakeLogger();
        const fakeOpenAPIFile = global.createFakeOpenAPIFile({
            components: {
                schemas: {
                    TestDeprecatedSchemaDTO: {
                        deprecated: true,
                        type: 'string',
                    },
                    TestObjectSchemaWithDeprecatedFieldDTO: {
                        type: 'object',
                        properties: {
                            testField: {
                                type: 'number',
                            },
                            deprecatedField: {
                                deprecated: true,
                                type: 'number',
                            },
                        },
                    },
                    TestDeprecatedArraySchemaDTO: {
                        type: 'array',
                        deprecated: true,
                        items: {
                            type: 'string',
                        },
                    },
                },
            },
            paths: {
                '/deprecated-endpoint': {
                    get: {
                        deprecated: true,
                        summary: '',
                        responses: {},
                    },
                    post: {
                        summary: '',
                        responses: {},
                    }
                },
                '/deprecated-parameter': {
                    post: {
                        parameters: [
                            {
                                in: 'query',
                                name: 'filter',
                                schema: {
                                    type: 'integer',
                                },
                            },
                            {
                                in: 'query',
                                name: 'deprecated-filter',
                                deprecated: true,
                                schema: {
                                    type: 'string',
                                },
                            },
                        ],
                        summary: '',
                        responses: {},
                    }
                },
                '/deprecated-body-field': {
                    post: {
                        summary: '',
                        requestBody: {
                            content: {
                                '*/*': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            testField: {
                                                type: 'number',
                                            },
                                            deprecatedField: {
                                                deprecated: true,
                                                type: 'number',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        responses: {},
                    }
                },
                '/deprecated-response': {
                    post: {
                        summary: '',
                        responses: {
                            '200': {
                                description: '',
                                content: {
                                    '*/*': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                testField: {
                                                    type: 'number',
                                                },
                                                deprecatedField: {
                                                    deprecated: true,
                                                    type: 'number',
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    }
                },
            },
        });

        expect(
            processor.processDocument(
                fakeOpenAPIFile,
                {},
                fakeLogger
            )
        ).toEqual({
            ...fakeOpenAPIFile,
            document: {
                ...fakeOpenAPIFile.document,
                components: {
                    schemas: {
                        TestObjectSchemaWithDeprecatedFieldDTO: {
                            type: 'object',
                            properties: {
                                testField: {
                                    type: 'number',
                                }
                            },
                        },
                    }
                },
                paths: {
                    '/deprecated-endpoint': {
                        post: {
                            summary: '',
                            responses: {},
                        }
                    },
                    '/deprecated-parameter': {
                        post: {
                            parameters: [
                                {
                                    in: 'query',
                                    name: 'filter',
                                    schema: {
                                        type: 'integer',
                                    },
                                }
                            ],
                            summary: '',
                            responses: {},
                        }
                    },
                    '/deprecated-body-field': {
                        post: {
                            summary: '',
                            requestBody: {
                                content: {
                                    '*/*': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                testField: {
                                                    type: 'number',
                                                }
                                            },
                                        },
                                    },
                                },
                            },
                            responses: {},
                        }
                    },
                    '/deprecated-response': {
                        post: {
                            summary: '',
                            responses: {
                                '200': {
                                    description: '',
                                    content: {
                                        '*/*': {
                                            schema: {
                                                type: 'object',
                                                properties: {
                                                    testField: {
                                                        type: 'number',
                                                    }
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        }
                    },
                },
            },
        });

        expect(fakeLogger.warning).toBeCalledTimes(0);
        expect(fakeLogger.error).toBeCalledTimes(0);
    });

    test('regular, with ignores', () => {
        const fakeLogger = global.createFakeLogger();
        const fakeOpenAPIFile = global.createFakeOpenAPIFile({
            components: {
                schemas: {
                    TestDeprecatedSchemaDTO: {
                        deprecated: true,
                        type: 'string',
                    },
                },
            },
            paths: {
                '/deprecated-endpoint': {
                    get: {
                        deprecated: true,
                        summary: '',
                        responses: {},
                    },
                    post: {
                        summary: '',
                        responses: {},
                    }
                },
                '/deprecated-parameter': {
                    post: {
                        parameters: [
                            {
                                in: 'query',
                                name: 'filter',
                                schema: {
                                    type: 'integer',
                                },
                            },
                            {
                                in: 'query',
                                name: 'deprecated-filter',
                                deprecated: true,
                                schema: {
                                    type: 'string',
                                },
                            },
                        ],
                        summary: '',
                        responses: {},
                    }
                },
            },
        });

        expect(
            processor.processDocument(
                fakeOpenAPIFile,
                {
                    ignore: [
                        {
                            type: 'endpoint',
                            path: '/deprecated-endpoint',
                            method: 'get',
                        },
                        {
                            type: 'endpoint-parameter',
                            path: '/deprecated-parameter',
                            method: 'post',
                            parameterName: 'deprecated-filter',
                            parameterIn: 'query',
                        },
                        {
                            type: 'component-schema',
                            componentName: 'TestDeprecatedSchemaDTO',
                        },

                    ]
                },
                fakeLogger
            )
        ).toEqual({
            ...fakeOpenAPIFile,
            document: {
                ...fakeOpenAPIFile.document,
                components: {
                    schemas: {
                        TestDeprecatedSchemaDTO: {
                            deprecated: true,
                            type: 'string',
                        },
                    },
                },
                paths: {
                    '/deprecated-endpoint': {
                        get: {
                            deprecated: true,
                            summary: '',
                            responses: {},
                        },
                        post: {
                            summary: '',
                            responses: {},
                        }
                    },
                    '/deprecated-parameter': {
                        post: {
                            parameters: [
                                {
                                    in: 'query',
                                    name: 'filter',
                                    schema: {
                                        type: 'integer',
                                    },
                                },
                                {
                                    in: 'query',
                                    name: 'deprecated-filter',
                                    deprecated: true,
                                    schema: {
                                        type: 'string',
                                    },
                                },
                            ],
                            summary: '',
                            responses: {},
                        }
                    },
                },
            },
        });

        expect(fakeLogger.warning).toBeCalledTimes(0);
        expect(fakeLogger.error).toBeCalledTimes(0);
    });

});
