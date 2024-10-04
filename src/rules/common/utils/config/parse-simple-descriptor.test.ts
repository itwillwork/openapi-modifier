import {parseSimpleDescriptor} from './parse-simple-descriptor';

describe('parseSimpleDescriptor', () => {
    const fakeLogger = global.createFakeLogger();

    test.each<[
        Parameters<typeof parseSimpleDescriptor>[0],
        Parameters<typeof parseSimpleDescriptor>[1],
        Parameters<typeof parseSimpleDescriptor>[2],
        Parameters<typeof parseSimpleDescriptor>[3],
        ReturnType<typeof parseSimpleDescriptor>
    ]>([
        [null, {}, {}, fakeLogger, null],
        [undefined, {}, {}, fakeLogger, null],
        ['TestDto', { isContainsName: true }, {}, fakeLogger, {
            name: 'TestDto',
        }],
        [' TestDto ', { isContainsName: true }, {}, fakeLogger, {
            name: 'TestDto',
        }],
        [' TestDto. ',  { isContainsName: true },{}, fakeLogger, {
            name: 'TestDto',
        }],
        ['TestDto.foo.bar[].test',  { isContainsName: true }, {}, fakeLogger, {
            name: 'TestDto',
            correction: 'properties.foo.properties.bar.items.properties.test',
        }],
        [' TestDto.foo.bar[].test ',  { isContainsName: true }, {}, fakeLogger, {
            name: 'TestDto',
            correction: 'properties.foo.properties.bar.items.properties.test',
        }],
        [' TestDto.foo.bar[].test. ',  { isContainsName: true }, {}, fakeLogger, {
            name: 'TestDto',
            correction: 'properties.foo.properties.bar.items.properties.test',
        }],
        ['TestDto.foo',  { isContainsName: true }, {}, fakeLogger, {
            name: 'TestDto',
            correction: 'properties.foo',
        }],
        ['TestDto[]',  { isContainsName: true }, {}, fakeLogger, {
            name: 'TestDto',
            correction: 'items',
        }],
        ['TestDto[].foo',  { isContainsName: true }, {}, fakeLogger, {
            name: 'TestDto',
            correction: 'items.properties.foo',
        }],
        ['TestDto[].foo[]',  { isContainsName: true }, {}, fakeLogger, {
            name: 'TestDto',
            correction: 'items.properties.foo.items',
        }],
        ['', {isContainsName: true}, {}, fakeLogger, null],
        [' ', {isContainsName: true}, {}, fakeLogger, null],
        ['foo.bar[].test',  { isContainsName: false },{}, fakeLogger, {
            name: null,
            correction: 'properties.foo.properties.bar.items.properties.test',
        }],
        ['  foo.bar[].test  ',  { isContainsName: false },{}, fakeLogger, {
            name: null,
            correction: 'properties.foo.properties.bar.items.properties.test',
        }],
        ['  [].foo.bar[].test  ',  { isContainsName: false },{}, fakeLogger, {
            name: null,
            correction: 'items.properties.foo.properties.bar.items.properties.test',
        }],
        ['', {}, {}, fakeLogger, null],
        [' ', {}, {}, fakeLogger, null],
        // TODO check wrong ?
        ['  [].[].foo ',  { isContainsName: false },{}, fakeLogger, {
            name: null,
            correction: 'items.items.properties.foo',
        }],
    ])('parseSimpleDescriptor(%s, %s, %s, %s)', (descriptor, options, rootSchema, logger, expectedResult) => {
        expect(
            parseSimpleDescriptor(
                descriptor,
                options,
                rootSchema,
                logger,
            ),
        ).toEqual(expectedResult);
    });
});
