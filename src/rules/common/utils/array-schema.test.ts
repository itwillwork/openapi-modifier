import {checkIsArraySchema} from "./array-schema";

describe('checkIsArraySchema', () => {
    test.each([
        [{$ref: '#'}, false],
        [{type: 'array', items: { type: 'number' }}, true],
        [{type: 'object'}, false],
        [{}, false],
        [null, false],
        [undefined, false],
        [123, false],
        ['123', false],
        [NaN, false],
    ])('checkIsArraySchema(%s)', (schema, expectedResult) => {
        expect(checkIsArraySchema(schema)).toEqual(expectedResult);
    });
});
