import {parseSimpleComponentWithCorrectionDescriptor} from './parse-component-descriptor';

describe('parseSimpleComponentWithCorrectionDescriptor', () => {
    test.each([
        ['TestDto', {
            componentName: 'TestDto',
        }],
        [' TestDto ', {
            componentName: 'TestDto',
        }],
        [' TestDto. ', {
            componentName: 'TestDto',
        }],
        ['TestDto.foo.bar[].test', {
            componentName: 'TestDto',
            correction: 'properties.foo.properties.bar.items.properties.test',
        }],
        [' TestDto.foo.bar[].test ', {
            componentName: 'TestDto',
            correction: 'properties.foo.properties.bar.items.properties.test',
        }],
        [' TestDto.foo.bar[].test. ', {
            componentName: 'TestDto',
            correction: 'properties.foo.properties.bar.items.properties.test',
        }],
        ['TestDto.foo', {
            componentName: 'TestDto',
            correction: 'properties.foo',
        }],
        ['TestDto[]', {
            componentName: 'TestDto',
            correction: 'items',
        }],
        ['TestDto[].foo', {
            componentName: 'TestDto',
            correction: 'items.properties.foo',
        }],
        ['TestDto[].foo[]', {
            componentName: 'TestDto',
            correction: 'items.properties.foo.items',
        }],
        ['', null],
        [' ', null],
    ])('parseSimpleComponentWithCorrectionDescriptor(%s)', (schema, expectedResult) => {
        expect(parseSimpleComponentWithCorrectionDescriptor(schema)).toEqual(expectedResult);
    });
});
