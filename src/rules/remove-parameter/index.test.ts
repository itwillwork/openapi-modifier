import processor from './index';

describe('make-required-parameter rule', () => {
    test('regular', () => {
        const fakeLogger = global.createFakeLogger();
        const fakeOpenAPIFile = global.createFakeOpenAPIFile({
            "paths": {
                "/pets": {
                    "get": {
                        "summary": "List all pets",
                        "parameters": [
                            {
                                "in": "query",
                                "name": "filter",
                                "schema": {
                                    "format": "int64",
                                    "type": "integer"
                                }
                            }
                        ],
                        "responses": {}
                    }
                }
            }
        });

        expect(processor.processDocument(fakeOpenAPIFile, {
                descriptor: {
                    path: "/pets",
                    method: "GET",
                },
                parameterDescriptor: {
                    name: "filter",
                    in: "query",
                },
            },
            fakeLogger,
        )).toEqual({
            ...fakeOpenAPIFile,
            document: {
                ...fakeOpenAPIFile.document,
                "paths": {
                    "/pets": {
                        "get": {
                            "summary": "List all pets",
                            "parameters": [],
                            "responses": {}
                        }
                    }
                }
            }
        });

        expect(fakeLogger.warning).toBeCalledTimes(0);
    });
});