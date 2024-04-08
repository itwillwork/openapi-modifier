import {forEachOperation} from "./each-operation";

describe('forEachOperation', () => {
    test('regular', () => {
        const fakeLogger = global.createFakeLogger();
        const callback = jest.fn(() => {});
        const fakeOpenAPIFile = global.createFakeOpenAPIFile({
            paths: {
                '/api/v1/pets': {
                    post: {
                        description: '',
                        responses: {},
                    },
                },
            },
        });

        forEachOperation(fakeOpenAPIFile, callback);

        expect(callback).toBeCalledTimes(1);
    });
});
