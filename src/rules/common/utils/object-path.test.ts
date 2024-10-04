import { getPathKeys, getObjectPath, setObjectProp } from './object-path';
import {checkIsArraySchema} from "./array-schema";

describe('getPathKeys', () => {
    test.each([
        ['', []],
        ['foo', ['foo']],
        ['foo.bar', ['foo', 'bar']],
        ['foo.1.bar', ['foo', '1', 'bar']],
        ['foo.[1].bar', ['foo', '1', 'bar']],
        ['foo[1].bar', ['foo', '1', 'bar']],
        ['[].bar', ['bar']],
    ])('getPathKeys(%s)', (schema, expectedResult) => {
        expect(getPathKeys(schema)).toEqual(expectedResult);
    });
});

describe('getObjectPath', () => {
    test('regular, string path', () => {
        const result = getObjectPath({
            foo: {
                bar: {
                    test: 1,
                }
            }
        }, 'foo.bar.test');

        expect(result).toEqual(1);
    });

    test('regular, array path', () => {
        const result = getObjectPath({
            foo: {
                bar: {
                    test: 1,
                }
            }
        }, ['foo', 'bar','test']);

        expect(result).toEqual(1);
    });

    test('with array, string path', () => {
        const result = getObjectPath({
            foo: {
                bar: [{

                }, {
                    test: 1,
                }]
            }
        }, 'foo.bar[1].test');

        expect(result).toEqual(1);
    });


    test('with array, array path', () => {
        const result = getObjectPath({
            foo: {
                bar: [{

                }, {
                    test: 1,
                }]
            }
        }, ['foo', 'bar', '1', 'test']);

        expect(result).toEqual(1);
    });
});
