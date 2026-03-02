import { describe, expect, it } from 'vitest';
import { getTypeVariant, Variant } from '../src/getTypeVariant';
import { DATA_TYPES } from "../src/data";

describe('getTypeVariant', () => {
    it('sollte PRIMITIVE für einfache Typen zurückgeben', () => {
        expect(getTypeVariant("string", DATA_TYPES)).toBe(Variant.PRIMITIVE);
        expect(getTypeVariant("number", DATA_TYPES)).toBe(Variant.PRIMITIVE);
        expect(getTypeVariant("boolean", DATA_TYPES)).toBe(Variant.PRIMITIVE);
    });

    it('sollte ARRAY für Array-Typen zurückgeben', () => {
        expect(getTypeVariant("string[]", DATA_TYPES)).toBe(Variant.ARRAY);
        expect(getTypeVariant("Array<number>", DATA_TYPES)).toBe(Variant.ARRAY);
    });

    it('sollte OBJECT für Interfaces oder Objekte mit Properties zurückgeben', () => {
        expect(getTypeVariant("{ name: string }", DATA_TYPES)).toBe(Variant.OBJECT);
    });

    it('sollte TYPE für einfache Type-Aliase oder void zurückgeben', () => {
        expect(getTypeVariant("void", DATA_TYPES)).toBe(Variant.TYPE);
        expect(getTypeVariant("any", DATA_TYPES)).toBe(Variant.TYPE);
    });

    it('sollte LIST (NUMBER) als ARRAY erkennen (wenn in DATA_TYPES definiert)', () => {
        // In data.ts ist LIST als T[] definiert
        expect(getTypeVariant("LIST<NUMBER>", DATA_TYPES)).toBe(Variant.ARRAY);
    });
});

