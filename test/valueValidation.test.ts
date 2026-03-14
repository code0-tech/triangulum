import {describe, expect, it} from 'vitest';
import {getValueValidation} from '../src/validation/getValueValidation';
import {DATA_TYPES} from './data';

describe('getValueValidation', () => {

    describe('Native TypeScript Types', () => {
        it('sollte einfache Literale validieren', () => {
            expect(getValueValidation('number', {
                __typename: 'LiteralValue',
                value: 42
            }, DATA_TYPES).isValid).toBe(true);
            expect(getValueValidation('string', {
                __typename: 'LiteralValue',
                value: 'Hello'
            }, DATA_TYPES).isValid).toBe(true);
            expect(getValueValidation('boolean', {
                __typename: 'LiteralValue',
                value: true
            }, DATA_TYPES).isValid).toBe(true);
        });

        it('sollte Fehler bei falschen nativen Typen erkennen', () => {
            expect(getValueValidation('number', {
                __typename: 'LiteralValue',
                value: 'not a number'
            }, DATA_TYPES).isValid).toBe(false);
            expect(getValueValidation('string', {
                __typename: 'LiteralValue',
                value: 123
            }, DATA_TYPES).isValid).toBe(false);
        });

        it('sollte native Arrays validieren', () => {
            expect(getValueValidation('string[]', {
                __typename: 'LiteralValue',
                value: ['A', 'B']
            }, DATA_TYPES).isValid).toBe(true);
            expect(getValueValidation('number[]', {
                __typename: 'LiteralValue',
                value: [1, '2']
            }, DATA_TYPES).isValid).toBe(false);
        });
    });

    describe('Sagittarius DATA_TYPES & Generics', () => {
        it('sollte NUMBER (Alias) validieren', () => {
            expect(getValueValidation('NUMBER', {
                __typename: 'LiteralValue',
                value: 42
            }, DATA_TYPES).isValid).toBe(true);
            expect(getValueValidation('NUMBER', {
                __typename: 'LiteralValue',
                value: 'not a number'
            }, DATA_TYPES).isValid).toBe(false);
        });

        it('sollte STRING (Alias) validieren', () => {
            expect(getValueValidation('STRING', {
                __typename: 'LiteralValue',
                value: 'Test'
            }, DATA_TYPES).isValid).toBe(true);
        });

        it('sollte LIST<T> validieren', () => {
            expect(getValueValidation('LIST<NUMBER>', {
                __typename: 'LiteralValue',
                value: [1, 2, 3]
            }, DATA_TYPES).isValid).toBe(true);
            expect(getValueValidation('LIST<STRING>', {
                __typename: 'LiteralValue',
                value: ['A', 'B']
            }, DATA_TYPES).isValid).toBe(true);
            expect(getValueValidation('LIST<NUMBER>', {
                __typename: 'LiteralValue',
                value: [1, 'no']
            }, DATA_TYPES).isValid).toBe(false);
        });

        it('sollte verschachtelte LIST<LIST<T>> validieren', () => {
            expect(getValueValidation('LIST<LIST<NUMBER>>', {
                __typename: 'LiteralValue',
                value: [[1], [2, 3]]
            }, DATA_TYPES).isValid).toBe(true);
            expect(getValueValidation('LIST<LIST<NUMBER>>', {
                __typename: 'LiteralValue',
                value: [[1], ['no']]
            }, DATA_TYPES).isValid).toBe(false);
        });

        it('sollte Generics aus den DATA_TYPES als Platzhalter akzeptieren', () => {
            // LIST<R> muss eine Liste sein, Inhalt egal (da R = any)
            expect(getValueValidation('LIST<R>', {
                __typename: 'LiteralValue',
                value: [1, "test", true]
            }, DATA_TYPES).isValid).toBe(true);

            // Einzelnes R akzeptiert alles
            expect(getValueValidation('R', {
                __typename: 'LiteralValue',
                value: {foo: 'bar'}
            }, DATA_TYPES).isValid).toBe(true);

            // LIST<R> gegen Nicht-Array muss fehlschlagen
            expect(getValueValidation('LIST<R>', {
                __typename: 'LiteralValue',
                value: 42
            }, DATA_TYPES).isValid).toBe(false);
        });
    });

    describe('Union & Literal Types', () => {
        it('sollte String-Unions validieren', () => {
            const type = '"GET" | "POST" | "DELETE"';
            expect(getValueValidation(type, {__typename: 'LiteralValue', value: 'GET'}, DATA_TYPES).isValid).toBe(true);
            expect(getValueValidation(type, {
                __typename: 'LiteralValue',
                value: 'PUT'
            }, DATA_TYPES).isValid).toBe(false);
        });

        it('sollte Mixed-Unions validieren', () => {
            const type = 'number | string';
            expect(getValueValidation(type, {__typename: 'LiteralValue', value: 42}, DATA_TYPES).isValid).toBe(true);
            expect(getValueValidation(type, {
                __typename: 'LiteralValue',
                value: 'text'
            }, DATA_TYPES).isValid).toBe(true);
            expect(getValueValidation(type, {__typename: 'LiteralValue', value: true}, DATA_TYPES).isValid).toBe(false);
        });
    });

    describe('Complex Objects', () => {
        it('sollte komplexe Objektstrukturen validieren', () => {
            const type = '{ id: number, metadata: { tags: string[], active: boolean } }';
            const value = {
                id: 1,
                metadata: {
                    tags: ['a', 'b'],
                    active: true
                }
            };
            expect(getValueValidation(type, {__typename: 'LiteralValue', value}, DATA_TYPES).isValid).toBe(true);
        });

        it('sollte Fehler in tief verschachtelten Strukturen finden', () => {
            const type = '{ user: { id: number } }';
            expect(getValueValidation(type, {
                __typename: 'LiteralValue',
                value: {user: {id: 'no'}}
            }, DATA_TYPES).isValid).toBe(false);
        });
    });

    describe('Generics & Nesting', () => {
        it('sollte verschachtelte Generics aus DATA_TYPES validieren', () => {
            // LIST<LIST<R>> muss ein Array von Arrays sein
            expect(getValueValidation('LIST<LIST<R>>', {
                __typename: 'LiteralValue',
                value: [[1, 2], ["A"]]
            }, DATA_TYPES).isValid).toBe(true);
            expect(getValueValidation('LIST<LIST<R>>', {
                __typename: 'LiteralValue',
                value: [1, 2]
            }, DATA_TYPES).isValid).toBe(false);
        });
    });

    describe('Empty Values & Nullability', () => {
        it('sollte leere Listen gegen LIST-Typen validieren', () => {
            expect(getValueValidation('LIST<NUMBER>', {
                __typename: 'LiteralValue',
                value: []
            }, DATA_TYPES).isValid).toBe(true);
            expect(getValueValidation('string[]', {
                __typename: 'LiteralValue',
                value: []
            }, DATA_TYPES).isValid).toBe(true);
        });

        it('sollte Optional-Types in Objekten erkennen', () => {
            const type = '{ id: number, description?: string }';
            expect(getValueValidation(type, {
                __typename: 'LiteralValue',
                value: {id: 100}
            }, DATA_TYPES).isValid).toBe(true);
            expect(getValueValidation(type, {
                __typename: 'LiteralValue',
                value: {id: 100, description: "Sagi"}
            }, DATA_TYPES).isValid).toBe(true);
        });

        it('sollte null/undefined nur erlauben, wenn explizit angegeben', () => {
            expect(getValueValidation('string | null', {
                __typename: 'LiteralValue',
                value: null
            }, DATA_TYPES).isValid).toBe(true);
            expect(getValueValidation('string', {
                __typename: 'LiteralValue',
                value: null
            }, DATA_TYPES).isValid).toBe(false);
        });
    });

    describe('Literal Combinations', () => {
        it('sollte eine Mischung aus Literalen und Typen in Unions prüfen', () => {
            const type = 'NUMBER | "AUTO" | "MANUAL"';
            expect(getValueValidation(type, {__typename: 'LiteralValue', value: 500}, DATA_TYPES).isValid).toBe(true);
            expect(getValueValidation(type, {
                __typename: 'LiteralValue',
                value: "AUTO"
            }, DATA_TYPES).isValid).toBe(true);
            expect(getValueValidation(type, {
                __typename: 'LiteralValue',
                value: "OTHER"
            }, DATA_TYPES).isValid).toBe(false);
        });

        it('sollte Boolean-Literale exakt prüfen', () => {
            // Manchmal will man nur 'true' erlauben
            expect(getValueValidation('true', {
                __typename: 'LiteralValue',
                value: true
            }, DATA_TYPES).isValid).toBe(true);
            expect(getValueValidation('true', {
                __typename: 'LiteralValue',
                value: false
            }, DATA_TYPES).isValid).toBe(false);
        });
    });

    describe('Edge Cases (Broken Inputs)', () => {
        it('sollte bei syntaktisch falschem targetType false zurückgeben', () => {
            // Ein Typ-String der gar kein Sinn ergibt
            expect(getValueValidation('const x =', {
                __typename: 'LiteralValue',
                value: 1
            }, DATA_TYPES).isValid).toBe(false);
            expect(getValueValidation('Arrays', {
                __typename: 'LiteralValue',
                value: []
            }, DATA_TYPES).isValid).toBe(false);
        });

        it('sollte mit sehr großen Objekten umgehen können', () => {
            const type = 'any';
            const bigValue = Object.fromEntries(Array.from({length: 1000}, (_, i) => [`key${i}`, i]));
            expect(getValueValidation(type, {
                __typename: 'LiteralValue',
                value: bigValue
            }, DATA_TYPES).isValid).toBe(true);
        });
    });
});