import { describe, expect, it } from 'vitest';
import { getValueValidation } from '../src/getValueValidation';

describe('getValueValidation', () => {

    describe('Native TypeScript Types', () => {
        it('sollte einfache Literale validieren', () => {
            expect(getValueValidation('number', { __typename: 'LiteralValue', value: 42 }).isValid).toBe(true);
            expect(getValueValidation('string', { __typename: 'LiteralValue', value: 'Hello' }).isValid).toBe(true);
            expect(getValueValidation('boolean', { __typename: 'LiteralValue', value: true }).isValid).toBe(true);
        });

        it('sollte Fehler bei falschen nativen Typen erkennen', () => {
            expect(getValueValidation('number', { __typename: 'LiteralValue', value: 'not a number' }).isValid).toBe(false);
            expect(getValueValidation('string', { __typename: 'LiteralValue', value: 123 }).isValid).toBe(false);
        });

        it('sollte native Arrays validieren', () => {
            expect(getValueValidation('string[]', { __typename: 'LiteralValue', value: ['A', 'B'] }).isValid).toBe(true);
            expect(getValueValidation('number[]', { __typename: 'LiteralValue', value: [1, '2'] }).isValid).toBe(false);
        });
    });

    describe('Sagittarius DATA_TYPES & Generics', () => {
        it('sollte LIST<T> korrekt auflösen (Alias für Array)', () => {
            expect(getValueValidation('LIST<number>', { __typename: 'LiteralValue', value: [1, 2, 3] }).isValid).toBe(true);
            expect(getValueValidation('LIST<number>', { __typename: 'LiteralValue', value: "keine liste" }).isValid).toBe(false);
        });

        it('sollte Generics aus den DATA_TYPES als Platzhalter akzeptieren', () => {
            // LIST<R> muss eine Liste sein, Inhalt egal (da R = any)
            expect(getValueValidation('LIST<R>', { __typename: 'LiteralValue', value: [1, "test", true] }).isValid).toBe(true);

            // Einzelnes R akzeptiert alles
            expect(getValueValidation('R', { __typename: 'LiteralValue', value: { foo: 'bar' } }).isValid).toBe(true);

            // LIST<R> gegen Nicht-Array muss fehlschlagen
            expect(getValueValidation('LIST<R>', { __typename: 'LiteralValue', value: 42 }).isValid).toBe(false);
        });
    });

    describe('Unions & Objects', () => {
        it('sollte String-Unions (Enums) validieren', () => {
            const type = '"GET" | "POST" | "DELETE"';
            expect(getValueValidation(type, { __typename: 'LiteralValue', value: 'GET' }).isValid).toBe(true);
            expect(getValueValidation(type, { __typename: 'LiteralValue', value: 'PATCH' }).isValid).toBe(false);
        });

        it('sollte komplexe Objekt-Strukturen validieren', () => {
            const type = '{ id: number, name: string }';
            expect(getValueValidation(type, { __typename: 'LiteralValue', value: { id: 1, name: 'Sagi' } }).isValid).toBe(true);
            expect(getValueValidation(type, { __typename: 'LiteralValue', value: { id: 1 } }).isValid).toBe(false);
        });
    });
});

describe('getValueValidation - Advanced Cases', () => {

    describe('Generics & Nesting', () => {
        it('sollte verschachtelte Generics aus DATA_TYPES validieren', () => {
            // LIST<LIST<R>> muss ein Array von Arrays sein
            expect(getValueValidation('LIST<LIST<R>>', { __typename: 'LiteralValue', value: [[1, 2], ["A"]] }).isValid).toBe(true);
            expect(getValueValidation('LIST<LIST<R>>', { __typename: 'LiteralValue', value: [1, 2] }).isValid).toBe(false);
        });
    });

    describe('Empty Values & Nullability', () => {
        it('sollte leere Listen gegen LIST-Typen validieren', () => {
            expect(getValueValidation('LIST<NUMBER>', { __typename: 'LiteralValue', value: [] }).isValid).toBe(true);
            expect(getValueValidation('string[]', { __typename: 'LiteralValue', value: [] }).isValid).toBe(true);
        });

        it('sollte Optional-Types in Objekten erkennen', () => {
            const type = '{ id: number, description?: string }';
            expect(getValueValidation(type, { __typename: 'LiteralValue', value: { id: 100 } }).isValid).toBe(true);
            expect(getValueValidation(type, { __typename: 'LiteralValue', value: { id: 100, description: "Sagi" } }).isValid).toBe(true);
        });

        it('sollte null/undefined nur erlauben, wenn explizit angegeben', () => {
            expect(getValueValidation('string | null', { __typename: 'LiteralValue', value: null }).isValid).toBe(true);
            expect(getValueValidation('string', { __typename: 'LiteralValue', value: null }).isValid).toBe(false);
        });
    });

    describe('Literal Combinations', () => {
        it('sollte eine Mischung aus Literalen und Typen in Unions prüfen', () => {
            const type = 'NUMBER | "AUTO" | "MANUAL"';
            expect(getValueValidation(type, { __typename: 'LiteralValue', value: 500 }).isValid).toBe(true);
            expect(getValueValidation(type, { __typename: 'LiteralValue', value: "AUTO" }).isValid).toBe(true);
            expect(getValueValidation(type, { __typename: 'LiteralValue', value: "OTHER" }).isValid).toBe(false);
        });

        it('sollte Boolean-Literale exakt prüfen', () => {
            // Manchmal will man nur 'true' erlauben
            expect(getValueValidation('true', { __typename: 'LiteralValue', value: true }).isValid).toBe(true);
            expect(getValueValidation('true', { __typename: 'LiteralValue', value: false }).isValid).toBe(false);
        });
    });

    describe('Edge Cases (Broken Inputs)', () => {
        it('sollte bei syntaktisch falschem targetType false zurückgeben', () => {
            // Ein Typ-String der gar kein Sinn ergibt
            expect(getValueValidation('const x =', { __typename: 'LiteralValue', value: 1 }).isValid).toBe(false);
            expect(getValueValidation('Array<', { __typename: 'LiteralValue', value: [] }).isValid).toBe(false);
        });

        it('sollte mit sehr großen Objekten umgehen können', () => {
            const type = 'any';
            const bigValue = Object.fromEntries(Array.from({ length: 1000 }, (_, i) => [`key${i}`, i]));
            expect(getValueValidation(type, { __typename: 'LiteralValue', value: bigValue }).isValid).toBe(true);
        });
    });
});