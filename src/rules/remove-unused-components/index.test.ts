import processor from './index';

describe('make-required-parameter rule', () => {
    test('regular', () => {
        const fakeLogger = global.createFakeLogger();
        const fakeOpenAPIFile = global.createFakeOpenAPIFile({
            "components": {
                "schemas": {
                    "Pet": {
                        "type": "string",
                    },
                    "Notification": {
                        "type": "object"
                    },
                    "Notifications": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/Notification"
                        }
                    }
                }
            },
            "paths": {
                "/pets": {
                    "get": {
                        "summary": "Get all pets",
                        "responses": {
                            "200": {
                                "description": "",
                                "content": {
                                    "*/*": {
                                        "schema": {
                                            "type": "array",
                                            "items": {
                                                "$ref": "#/components/schemas/Pet"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
            }
        });

        expect(processor.processDocument(fakeOpenAPIFile, {},
            fakeLogger,
        )).toEqual({
            ...fakeOpenAPIFile,
            document: {
                ...fakeOpenAPIFile.document,
                "components": {
                    "schemas": {
                        "Pet": {
                            "type": "string",
                        },
                    }
                },
                "paths": {
                    "/pets": {
                        "get": {
                            "summary": "Get all pets",
                            "responses": {
                                "200": {
                                    "description": "",
                                    "content": {
                                        "*/*": {
                                            "schema": {
                                                "type": "array",
                                                "items": {
                                                    "$ref": "#/components/schemas/Pet"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                }
            }
        });

        expect(fakeLogger.warning).toBeCalledTimes(0);
    });
});