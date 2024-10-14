import {checkIsRefSchema, tryExtractRefLastPath} from './refs';

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

describe('tryExtractRefLastPath', () => {
  test.each([
    ['#/component/TestRef', 'TestRef'],
    ['#/component/TestRef/', null],
    ['', null],
  ])('tryExtractRefLastPath(%s)', (ref, expectedResult) => {
    expect(tryExtractRefLastPath(ref)).toEqual(expectedResult);
  });
});
