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
        [null, {}, fakeLogger, null, null],
        [undefined, {}, fakeLogger, null, null],
        ['TestDto', { isContainsName: true }, fakeLogger, null, {
            name: 'TestDto',
        }],
        [' TestDto ', { isContainsName: true }, fakeLogger, null, {
            name: 'TestDto',
        }],
        [' TestDto. ',  { isContainsName: true },fakeLogger, null, {
            name: 'TestDto',
        }],
        ['TestDto.foo.bar[].test',  { isContainsName: true }, fakeLogger, null, {
            name: 'TestDto',
            correction: 'properties.foo.properties.bar.items.properties.test',
        }],
        [' TestDto.foo.bar[].test ',  { isContainsName: true }, fakeLogger, null, {
            name: 'TestDto',
            correction: 'properties.foo.properties.bar.items.properties.test',
        }],
        [' TestDto.foo.bar[].test. ',  { isContainsName: true }, fakeLogger, null, {
            name: 'TestDto',
            correction: 'properties.foo.properties.bar.items.properties.test',
        }],
        ['TestDto.foo',  { isContainsName: true }, fakeLogger, null, {
            name: 'TestDto',
            correction: 'properties.foo',
        }],
        ['TestDto[]',  { isContainsName: true }, fakeLogger, null, {
            name: 'TestDto',
            correction: 'items',
        }],
        ['TestDto[].foo',  { isContainsName: true }, fakeLogger, null, {
            name: 'TestDto',
            correction: 'items.properties.foo',
        }],
        ['TestDto[].foo[]',  { isContainsName: true }, fakeLogger, null, {
            name: 'TestDto',
            correction: 'items.properties.foo.items',
        }],
        ['', {isContainsName: true}, fakeLogger, null, null],
        [' ', {isContainsName: true}, fakeLogger, null, null],
        ['foo.bar[].test',  { isContainsName: false },fakeLogger, null, {
            name: null,
            correction: 'properties.foo.properties.bar.items.properties.test',
        }],
        ['  foo.bar[].test  ',  { isContainsName: false },fakeLogger, null, {
            name: null,
            correction: 'properties.foo.properties.bar.items.properties.test',
        }],
        ['  [].foo.bar[].test  ',  { isContainsName: false },fakeLogger, null, {
            name: null,
            correction: 'items.properties.foo.properties.bar.items.properties.test',
        }],
        ['', {}, fakeLogger, null, null],
        [' ', {}, fakeLogger, null, null],
        // TODO check wrong ?
        ['  [].[].foo ',  { isContainsName: false }, fakeLogger, null, {
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
