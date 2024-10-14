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
                fakeLogger,
                {ruleName: ''}
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

    test('regular, use simple descriptor', () => {
        const fakeLogger = global.createFakeLogger();
        const fakeOpenAPIFile = global.createFakeOpenAPIFile({
            components: {
                schemas: {
                    TestSchemaDTO: {
                        type: 'object',
                        properties: {
                            foo: {
                                type: 'object',
                                properties: {
                                    bar: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                test: {
                                                    type: 'string',
                                                    enum: ['1', '2'],
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                },
            },
        });

        expect(
            processor.processDocument(
                fakeOpenAPIFile,
                {
                    patchMethod: 'deepmerge',
                    descriptor: 'TestSchemaDTO.foo.bar[].test',
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
                components: {
                    schemas: {
                        TestSchemaDTO: {
                            type: 'object',
                            properties: {
                                foo: {
                                    type: 'object',
                                    properties: {
                                        bar: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    test: {
                                                        type: 'string',
                                                        enum: ['1', '2', '3', '4'],
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                    },
                },
            },
        });

        expect(fakeLogger.warning).toBeCalledTimes(0);
    });

    test('regular, use simple descriptor, root array', () => {
        const fakeLogger = global.createFakeLogger();
        const fakeOpenAPIFile = global.createFakeOpenAPIFile({
            components: {
                schemas: {
                    TestSchemaDTO: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                foo: {
                                    type: 'object',
                                    properties: {
                                        bar: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    test: {
                                                        type: 'string',
                                                        enum: ['1', '2'],
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                },
            },
        });

        expect(
            processor.processDocument(
                fakeOpenAPIFile,
                {
                    patchMethod: 'deepmerge',
                    descriptor: 'TestSchemaDTO[].foo.bar[].test',
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
                components: {
                    schemas: {
                        TestSchemaDTO: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    foo: {
                                        type: 'object',
                                        properties: {
                                            bar: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        test: {
                                                            type: 'string',
                                                            enum: ['1', '2', '3', '4'],
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
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
                fakeLogger,
                {ruleName: ''}
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
                        correction: 'properties.TestArraySchemaDTO.items',
                    },
                    schemaDiff: {
                        type: 'string',
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

    test('regular, use allOf', () => {
        const fakeLogger = global.createFakeLogger();
        const fakeOpenAPIFile = global.createFakeOpenAPIFile({
            components: {
                schemas: {
                    TestObjectDTO: {
                        allOf: [
                            {
                                '$ref': 'TestRef1',
                            },
                            {
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
                            }
                        ]

                    },
                },
            },
        });

        expect(
            processor.processDocument(
                fakeOpenAPIFile,
                {
                    patchMethod: 'merge',
                    descriptor: 'TestObjectDTO.allOf[1].TestArraySchemaDTO[]',
                    schemaDiff: {
                        type: 'string',
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
                components: {
                    schemas: {
                        TestObjectDTO: {
                            allOf: [
                                {
                                    '$ref': 'TestRef1',
                                },
                                {
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
                                }
                            ]
                        },
                    },
                },
            },
        });

        expect(fakeLogger.warning).toBeCalledTimes(0);
    });

    test('regular, use anyOf', () => {
        const fakeLogger = global.createFakeLogger();
        const fakeOpenAPIFile = global.createFakeOpenAPIFile({
            components: {
                schemas: {
                    TestObjectDTO: {
                        anyOf: [
                            {
                                '$ref': 'TestRef1',
                            },
                            {
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
                            }
                        ]

                    },
                },
            },
        });

        expect(
            processor.processDocument(
                fakeOpenAPIFile,
                {
                    patchMethod: 'merge',
                    descriptor: 'TestObjectDTO.anyOf[1].TestArraySchemaDTO[]',
                    schemaDiff: {
                        type: 'string',
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
                components: {
                    schemas: {
                        TestObjectDTO: {
                            anyOf: [
                                {
                                    '$ref': 'TestRef1',
                                },
                                {
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
                                }
                            ]
                        },
                    },
                },
            },
        });

        expect(fakeLogger.warning).toBeCalledTimes(0);
    });

    test('regular, use oneOf', () => {
        const fakeLogger = global.createFakeLogger();
        const fakeOpenAPIFile = global.createFakeOpenAPIFile({
            components: {
                schemas: {
                    TestObjectDTO: {
                        oneOf: [
                            {
                                '$ref': 'TestRef1',
                            },
                            {
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
                            }
                        ]

                    },
                },
            },
        });

        expect(
            processor.processDocument(
                fakeOpenAPIFile,
                {
                    patchMethod: 'merge',
                    descriptor: 'TestObjectDTO.oneOf[1].TestArraySchemaDTO[]',
                    schemaDiff: {
                        type: 'string',
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
                components: {
                    schemas: {
                        TestObjectDTO: {
                            oneOf: [
                                {
                                    '$ref': 'TestRef1',
                                },
                                {
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
                                }
                            ]
                        },
                    },
                },
            },
        });

        expect(fakeLogger.warning).toBeCalledTimes(0);
    });

    test('failed use with $ref', () => {
        const fakeLogger = global.createFakeLogger();
        const fakeOpenAPIFile = global.createFakeOpenAPIFile({
            components: {
                schemas: {
                    TestObjectDTO: {
                        oneOf: [
                            {
                                '$ref': 'TestRef1',
                            },
                        ]
                    },
                },
            },
        });

        try {
            expect(
                processor.processDocument(
                    fakeOpenAPIFile,
                    {
                        patchMethod: 'deepmerge',
                        descriptor: 'TestObjectDTO.oneOf[0].TestArraySchemaDTO',
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
                    components: {
                        schemas: {
                            TestObjectDTO: {
                                oneOf: [
                                    {
                                        '$ref': 'TestRef1',
                                    },
                                ]
                            },
                        },
                    },
                },
            });
        } catch (error) {
            expect(error instanceof Error ? error.message : '').toMatch(/\$ref/);
        }

        expect(fakeLogger.warning).toBeCalledTimes(0);
        expect(fakeLogger.error).toBeCalledTimes(0);
    });
});
