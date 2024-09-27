import { parseSimpleEndpointDescriptor } from './parse-endpoint-descriptor';

describe('parseSimpleEndpointDescriptor', () => {
    test.each([
        ['get /foo/bar', { path: '/foo/bar', method: 'get' }],
        ['GET /foo/bar', { path: '/foo/bar', method: 'GET' }],
        ['GET foo/bar', { path: 'foo/bar', method: 'GET' }],
        [' GET /foo/bar ', { path: '/foo/bar', method: 'GET' }],
        [' [GET] /foo/bar ', { path: '/foo/bar', method: 'GET' }],
        [' GET -> /foo/bar ', { path: '/foo/bar', method: 'GET' }],
        [' [GET] -> /foo/bar ', { path: '/foo/bar', method: 'GET' }],
        ['GET/foo/bar', null],
        ['', null],
        [' ', null],
    ])('parseSimpleEndpointDescriptor(%s)', (schema, expectedResult) => {
        expect(parseSimpleEndpointDescriptor(schema)).toEqual(expectedResult);
    });
});
