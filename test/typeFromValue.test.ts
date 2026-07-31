import { describe, it, expect } from 'vitest';
import { getTypeFromValue } from '../src/extraction/getTypeFromValue';
import { DATA_TYPES } from './data';

describe('getTypeFromValue', () => {

    it('should infer exact string literals', () => {
        expect(getTypeFromValue({value: "POST"}, DATA_TYPES)).toBe('string');
        expect(getTypeFromValue({value: "active"}, DATA_TYPES)).toBe('string');
    });

    it('should infer exact number and boolean literals', () => {
        expect(getTypeFromValue({value: 200}, DATA_TYPES)).toBe('number');
        expect(getTypeFromValue({value: false}, DATA_TYPES)).toBe('boolean');
    });

    it('should infer complex object structures', () => {
        const user = {
            id: 1,
            profile: { name: "John", age: 30 }
        };


        const result = getTypeFromValue({value: user}, DATA_TYPES);

        expect(result).toMatch(/id:\s*number/);
        expect(result).toMatch(/name:\s*string/);
        expect(result).toMatch(/age:\s*number/);
    });

    it('should infer arrays as unions of literals', () => {
        const list = ["A", "B"];
        const result = getTypeFromValue({value: list}, DATA_TYPES);

        expect(result).toBe("string[]");
    });

    it('should handle nested arrays', () => {
        const nested = [1, [2, 3]];
        const result = getTypeFromValue({value: nested}, DATA_TYPES);
        expect(result).toBe('(number | number[])[]');
    });

    it('should handle null and empty structures', () => {
        expect(getTypeFromValue({value: null})).toBe('null');
        expect(getTypeFromValue(null)).toBe('any');
        expect(getTypeFromValue({value: []})).toBe('any[]');
        expect(getTypeFromValue({value: {}})).toBe('{}');
    });
});