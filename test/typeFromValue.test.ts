import { describe, it, expect } from 'vitest';
import { getTypeFromValue } from '../src/getTypeFromValue';

describe('getTypeFromValue', () => {

    it('should infer exact string literals', () => {
        expect(getTypeFromValue("POST")).toBe('"POST"');
        expect(getTypeFromValue("active")).toBe('"active"');
    });

    it('should infer exact number and boolean literals', () => {
        expect(getTypeFromValue(200)).toBe('200');
        expect(getTypeFromValue(false)).toBe('false');
    });

    it('should infer complex object structures', () => {
        const user = {
            id: 1,
            profile: { name: "John", age: 30 }
        };


        const result = getTypeFromValue(user);

        expect(result).toMatch(/id:\s*number/);
        expect(result).toMatch(/name:\s*string/);
        expect(result).toMatch(/age:\s*number/);
    });

    it('should infer arrays as unions of literals', () => {
        const list = ["A", "B"];
        const result = getTypeFromValue(list);

        expect(result).toBe("string[]");
    });

    it('should handle nested arrays', () => {
        const nested = [1, [2, 3]];
        const result = getTypeFromValue(nested);
        expect(result).toBe('(number | number[])[]');
    });

    it('should handle null and empty structures', () => {
        expect(getTypeFromValue(null)).toBe('any');
        expect(getTypeFromValue([])).toBe('any[]');
        expect(getTypeFromValue({})).toBe('{}');
    });
});