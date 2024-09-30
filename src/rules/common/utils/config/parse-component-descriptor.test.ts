import {parseSimpleComponentDescriptor} from './parse-component-descriptor';

describe('parseSimpleComponentDescriptor', () => {
    test.each([
        ['TestDto', {
            componentName: 'TestDto',
        }],
        [' TestDto ', {
            componentName: 'TestDto',
        }],
        ['', null],
        [' ', null],
    ])('parseSimpleComponentDescriptor(%s)', (schema, expectedResult) => {
        expect(parseSimpleComponentDescriptor(schema)).toEqual(expectedResult);
    });
});
