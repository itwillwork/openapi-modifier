import {parseSimpleDescriptor} from './parse-simple-descriptor';

describe('parseSimpleDescriptor', () => {
    test.each<[string | null | undefined, {isContainsName?: boolean}, ReturnType<typeof parseSimpleDescriptor>]>([
        [null, {}, null],
        [undefined, {}, null],
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
        // TODO check wrong ?
        ['  [].[].foo ',  { isContainsName: false },{
            name: null,
            correction: 'items.items.properties.foo',
        }],
        ['TestDto.allOf[2].foo',  { isContainsName: true },{
            name: 'TestDto',
            correction: 'allOf[2].properties.foo',
        }],
        ['TestDto.allOf[2].foo',  { isContainsName: false },{
            name: null,
            correction: 'properties.TestDto.allOf[2].properties.foo',
        }],
        ['TestDto.oneOf[2].foo',  { isContainsName: true },{
            name: 'TestDto',
            correction: 'oneOf[2].properties.foo',
        }],
        ['TestDto.oneOf[2].foo',  { isContainsName: false },{
            name: null,
            correction: 'properties.TestDto.oneOf[2].properties.foo',
        }],
        ['TestDto.anyOf[2].foo',  { isContainsName: true },{
            name: 'TestDto',
            correction: 'anyOf[2].properties.foo',
        }],
        ['TestDto.anyOf[2].foo',  { isContainsName: false },{
            name: null,
            correction: 'properties.TestDto.anyOf[2].properties.foo',
        }],
    ])('parseSimpleDescriptor(%s, %s)', (schema, options, expectedResult) => {
        expect(parseSimpleDescriptor(schema, options)).toEqual(expectedResult);
    });
});
