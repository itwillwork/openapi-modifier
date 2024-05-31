import { checkIsObjectSchema } from './object-schema';

describe('checkIsObjectSchema', () => {
  test.each([
    [{ $ref: '#' }, false],
    [{ type: 'array', items: { type: 'number' } }, false],
    [{ type: 'object' }, true],
    [{}, false],
    [null, false],
    [undefined, false],
    [123, false],
    ['123', false],
    [NaN, false],
  ])('checkIsObjectSchema(%s)', (schema, expectedResult) => {
    expect(checkIsObjectSchema(schema)).toEqual(expectedResult);
  });
});
