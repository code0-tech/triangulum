import { describe, expect, it } from 'vitest';
import { getTypeVariant, DataTypeVariant } from '../src/extraction/getTypeVariant';
import {DATA_TYPES, FUNCTION_SIGNATURES} from "./data";
import {getTypesFromNode} from "../src";

describe('getTypeVariant', () => {
    it('identifies native TypeScript primitives (string, number, boolean) as PRIMITIVE variant', () => {
        expect(getTypeVariant("string", DATA_TYPES)[0].variant).toBe(DataTypeVariant.PRIMITIVE);
        expect(getTypeVariant("number", DATA_TYPES)[0].variant).toBe(DataTypeVariant.PRIMITIVE);
        expect(getTypeVariant("boolean", DATA_TYPES)[0].variant).toBe(DataTypeVariant.PRIMITIVE);
    });

    it('recognizes both bracket notation and generic syntax for array types as ARRAY variant', () => {
        expect(getTypeVariant("string[]", DATA_TYPES)[0].variant).toBe(DataTypeVariant.ARRAY);
        expect(getTypeVariant("Array<number>", DATA_TYPES)[0].variant).toBe(DataTypeVariant.ARRAY);
    });

    it('classifies object literals and interface-like structures as OBJECT variant', () => {
        expect(getTypeVariant("{ name: string }", DATA_TYPES)[0].variant).toBe(DataTypeVariant.OBJECT);
        expect(getTypeVariant("{}", DATA_TYPES)[0].variant).toBe(DataTypeVariant.OBJECT);
        expect(getTypeVariant("OBJECT<any>", DATA_TYPES)[0].variant).toBe(DataTypeVariant.OBJECT);
    });

    it('marks special types like void and any as TYPE variant', () => {
        expect(getTypeVariant("void", DATA_TYPES)[0].variant).toBe(DataTypeVariant.TYPE);
        expect(getTypeVariant("any", DATA_TYPES)[0].variant).toBe(DataTypeVariant.TYPE);
    });

    it('resolves generic LIST type aliases to ARRAY variant regardless of type parameter', () => {
        // LIST<T> is defined as T[] in data.ts, so all LIST variants should be arrays
        expect(getTypeVariant("LIST<NUMBER>", DATA_TYPES)[0].variant).toBe(DataTypeVariant.ARRAY);
        expect(getTypeVariant("LIST<unknown>", DATA_TYPES)[0].variant).toBe(DataTypeVariant.ARRAY);
        expect(getTypeVariant("LIST<T>", DATA_TYPES)[0].variant).toBe(DataTypeVariant.ARRAY);
    });

    it('identifies CONSUMER function types with generic parameters as NODE variant', () => {
        // CONSUMER<T> represents a callback function (T) => void
        expect(getTypeVariant("CONSUMER<NUMBER>", DATA_TYPES)[0].variant).toBe(DataTypeVariant.NODE);
    });

    it('identifies parameterless function types like RUNNABLE as NODE variant', () => {
        // RUNNABLE represents () => void with no parameters
        expect(getTypeVariant("RUNNABLE", DATA_TYPES)[0].variant).toBe(DataTypeVariant.NODE);
    });

    it('identifies PREDICATE function types with generic parameters as NODE variant', () => {
        // PREDICATE<T> represents a boolean-returning function (T) => boolean
        expect(getTypeVariant("PREDICATE<NUMBER>", DATA_TYPES)[0].variant).toBe(DataTypeVariant.NODE);
    });

    it('correctly identifies type variants when retrieved directly from DATA_TYPES registry', () => {
        // Verify that types stored in DATA_TYPES are properly classified
        expect(getTypeVariant(DATA_TYPES.find(dt => dt.identifier === "LIST"), DATA_TYPES)[0].variant).toBe(DataTypeVariant.ARRAY);
        expect(getTypeVariant(DATA_TYPES.find(dt => dt.identifier === "HTTP_METHOD"), DATA_TYPES)[0].variant).toBe(DataTypeVariant.TYPE);
    });

    it('recognizes callback parameter types in real function signatures as NODE variant', () => {
        // When extracting types from std::list::for_each, the second parameter (consumer) should be NODE
        const types = getTypesFromNode({
            functionDefinition: {
                identifier: "std::list::for_each"
            }
        }, FUNCTION_SIGNATURES, DATA_TYPES)
        expect(getTypeVariant(types.parameters[1], DATA_TYPES)[0].variant).toBe(DataTypeVariant.NODE);
    });
});

