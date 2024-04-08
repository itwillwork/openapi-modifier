import { checkIsRefSchema } from "./refs";

describe('checkIsRefSchema', () => {
    test('regular', () => {
        // TODO refactoring, use jest each
        expect(checkIsRefSchema({ '$ref': '#' })).toBeTruthy();
        expect(checkIsRefSchema({ })).toBeFalsy();
        expect(checkIsRefSchema(null)).toBeFalsy();
        expect(checkIsRefSchema(undefined)).toBeFalsy();
        expect(checkIsRefSchema(123)).toBeFalsy();
        expect(checkIsRefSchema('123')).toBeFalsy();
        expect(checkIsRefSchema(NaN)).toBeFalsy();
    });
});
