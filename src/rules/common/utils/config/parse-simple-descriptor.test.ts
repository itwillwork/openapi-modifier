import {parseSimpleDescriptor} from './parse-simple-descriptor';

describe('parseSimpleDescriptor', () => {
    test.each<[string, {isContainsName?: boolean}, ReturnType<typeof parseSimpleDescriptor>]>([
        ['TestDto', { isContainsName: true }, {
            name: 'TestDto',
        }],
        [' TestDto ', { isContainsName: true }, {
            name: 'TestDto',
        }],
        [' TestDto. ',  { isContainsName: true },{
            name: 'TestDto',
        }],
        ['TestDto.foo.bar[].test',  { isContainsName: true },{
            name: 'TestDto',
            correction: 'properties.foo.properties.bar.items.properties.test',
        }],
        [' TestDto.foo.bar[].test ',  { isContainsName: true },{
            name: 'TestDto',
            correction: 'properties.foo.properties.bar.items.properties.test',
        }],
        [' TestDto.foo.bar[].test. ',  { isContainsName: true },{
            name: 'TestDto',
            correction: 'properties.foo.properties.bar.items.properties.test',
        }],
        ['TestDto.foo',  { isContainsName: true },{
            name: 'TestDto',
            correction: 'properties.foo',
        }],
        ['TestDto[]',  { isContainsName: true },{
            name: 'TestDto',
            correction: 'items',
        }],
        ['TestDto[].foo',  { isContainsName: true },{
            name: 'TestDto',
            correction: 'items.properties.foo',
        }],
        ['TestDto[].foo[]',  { isContainsName: true },{
            name: 'TestDto',
            correction: 'items.properties.foo.items',
        }],
        ['', {isContainsName: true}, null],
        [' ', {isContainsName: true}, null],
        ['foo.bar[].test',  { isContainsName: false },{
            name: null,
            correction: 'properties.foo.properties.bar.items.properties.test',
        }],
        ['  foo.bar[].test  ',  { isContainsName: false },{
            name: null,
            correction: 'properties.foo.properties.bar.items.properties.test',
        }],
        ['  [].foo.bar[].test  ',  { isContainsName: false },{
            name: null,
            correction: 'items.properties.foo.properties.bar.items.properties.test',
        }],
        ['', {}, null],
        [' ', {}, null],
    ])('parseSimpleDescriptor(%s, %s)', (schema, options, expectedResult) => {
        expect(parseSimpleDescriptor(schema, options)).toEqual(expectedResult);
    });
});
