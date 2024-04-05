import processor from './index';

describe('patch-schemas rule', () => {
    test('regular', () => {
        const fakeLogger = global.createFakeLogger();
        const fakeOpenAPIFile = global.createFakeOpenAPIFile({
            components: {
                schemas: {
                    TestSchemaDTO: {
                        type: "string",
                    },
                    TestArraySchemaDTO: {
                        type: "array",
                        items: {
                            type: "number"
                        }
                    },
                }
            }
        });

        expect(processor.processDocument(fakeOpenAPIFile, [{
                method: "merge",
                descriptor: {
                    type: "component",
                    componentName: "TestSchemaDTO",
                },
                schemaDiff: {
                    enum: [ "1", "2"],
                }
            }, {
                method: "replace",
                descriptor: {
                    type: "component",
                    componentName: "TestArraySchemaDTO",
                },
                schemaDiff: {
                    items: {
                        type: "string"
                    }
                }

            }],
            fakeLogger,
        )).toEqual({
            ...fakeOpenAPIFile,
            document: {
                ...fakeOpenAPIFile.document,
                components: {
                    schemas: {
                        TestSchemaDTO: {
                            type: "string",
                            enum: [ "1", "2"],
                        },
                        TestArraySchemaDTO: {
                            type: "array",
                            items: {
                                type: "string"
                            }
                        },
                    }
                }
            }
        });

        expect(fakeLogger.warning).toBeCalledTimes(0);
    });
});