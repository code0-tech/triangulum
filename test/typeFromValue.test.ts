import { describe, it, expect } from 'vitest';
import { getTypeFromValue } from '../src/extraction/getTypeFromValue';
import { DATA_TYPES } from './data';

describe('getTypeFromValue', () => {

    it('should infer exact string literals', () => {
        expect(getTypeFromValue({value: "POST"}, DATA_TYPES)).toBe('HTTP_METHOD');
        expect(getTypeFromValue({value: "active"}, DATA_TYPES)).toBe('TEXT');
    });

    it('should infer exact number and boolean literals', () => {
        expect(getTypeFromValue({value: 200}, DATA_TYPES)).toBe('NUMBER');
        expect(getTypeFromValue({value: false}, DATA_TYPES)).toBe('BOOLEAN');
    });

    it('should infer complex object structures', () => {
        const user = {
            id: 1,
            profile: { name: "John", age: 30 }
        };


        const result = getTypeFromValue({value: user}, DATA_TYPES);

        expect(result).toMatch(/id:\s*NUMBER/);
        expect(result).toMatch(/name:\s*TEXT/);
        expect(result).toMatch(/age:\s*NUMBER/);
    });

    it('should infer arrays as unions of literals', () => {
        const list = ["A", "B"];
        const result = getTypeFromValue({value: list}, DATA_TYPES);

        expect(result).toBe("TEXT[]");
    });

    it('should handle nested arrays', () => {
        const nested = [1, [2, 3]];
        const result = getTypeFromValue({value: nested}, DATA_TYPES);
        expect(result).toBe('(NUMBER | NUMBER[])[]');
    });

    it('should handle null and empty structures', () => {
        expect(getTypeFromValue({value: null})).toBe('null');
        expect(getTypeFromValue(null)).toBe('any');
        expect(getTypeFromValue({value: []})).toBe('any[]');
        expect(getTypeFromValue({value: {}})).toBe('{}');
    });
});