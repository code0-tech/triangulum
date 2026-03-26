import { describe, expect, it } from 'vitest';
import { getTypeVariant, DataTypeVariant } from '../src/extraction/getTypeVariant';
import {DATA_TYPES, FUNCTION_SIGNATURES} from "./data";
import {getTypesFromNode} from "../src";

describe('getTypeVariant', () => {
    it('sollte PRIMITIVE für einfache Typen zurückgeben', () => {
        expect(getTypeVariant("string", DATA_TYPES)).toBe(DataTypeVariant.PRIMITIVE);
        expect(getTypeVariant("number", DATA_TYPES)).toBe(DataTypeVariant.PRIMITIVE);
        expect(getTypeVariant("boolean", DATA_TYPES)).toBe(DataTypeVariant.PRIMITIVE);
    });

    it('sollte ARRAY für Array-Typen zurückgeben', () => {
        expect(getTypeVariant("string[]", DATA_TYPES)).toBe(DataTypeVariant.ARRAY);
        expect(getTypeVariant("Array<number>", DATA_TYPES)).toBe(DataTypeVariant.ARRAY);
    });

    it('sollte OBJECT für Interfaces oder Objekte mit Properties zurückgeben', () => {
        expect(getTypeVariant("{ name: string }", DATA_TYPES)).toBe(DataTypeVariant.OBJECT);
        expect(getTypeVariant("{}", DATA_TYPES)).toBe(DataTypeVariant.OBJECT);
        expect(getTypeVariant("OBJECT<any>", DATA_TYPES)).toBe(DataTypeVariant.OBJECT);
    });

    it('sollte TYPE für einfache Type-Aliase oder void zurückgeben', () => {
        expect(getTypeVariant("void", DATA_TYPES)).toBe(DataTypeVariant.TYPE);
        expect(getTypeVariant("any", DATA_TYPES)).toBe(DataTypeVariant.TYPE);
    });

    it('sollte LIST (NUMBER) als ARRAY erkennen (wenn in DATA_TYPES definiert)', () => {
        // In data.ts ist LIST als T[] definiert
        expect(getTypeVariant("LIST<NUMBER>", DATA_TYPES)).toBe(DataTypeVariant.ARRAY);
        expect(getTypeVariant("LIST<unknown>", DATA_TYPES)).toBe(DataTypeVariant.ARRAY);
        expect(getTypeVariant("LIST<T>", DATA_TYPES)).toBe(DataTypeVariant.ARRAY);
    });

    it('sollte NODE für Funktionstypen wie CONSUMER zurückgeben', () => {
        // In data.ts ist CONSUMER als (item:R) => void definiert
        expect(getTypeVariant("CONSUMER<NUMBER>", DATA_TYPES)).toBe(DataTypeVariant.NODE);
    });

    it('sollte NODE für Funktionstypen wie RUNNABLE zurückgeben', () => {
        // In data.ts ist CONSUMER als (item:R) => void definiert
        expect(getTypeVariant("RUNNABLE", DATA_TYPES)).toBe(DataTypeVariant.NODE);
    });

    it('sollte NODE für Funktionstypen wie PREDICATE zurückgeben', () => {
        // In data.ts ist CONSUMER als (item:R) => void definiert
        expect(getTypeVariant("PREDICATE<NUMBER>", DATA_TYPES)).toBe(DataTypeVariant.NODE);
    });


    it("Check if", () => {
        const types = getTypesFromNode({
            functionDefinition: {
                identifier: "std::list::for_each"
            }
        }, FUNCTION_SIGNATURES, DATA_TYPES)
        expect(getTypeVariant(types.parameters[1], DATA_TYPES)).toBe(DataTypeVariant.NODE);
    });
});

