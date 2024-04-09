import { checkIsRefSchema } from './refs';

describe('checkIsRefSchema', () => {
  test.each([
    [{ $ref: '#' }, true],
    [{}, false],
    [null, false],
    [undefined, false],
    [123, false],
    ['123', false],
    [NaN, false],
  ])('checkIsRefSchema(%s)', (schema, expectedResult) => {
    expect(checkIsRefSchema(schema)).toEqual(expectedResult);
  });
});
