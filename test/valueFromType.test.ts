import { describe, expect, it } from 'vitest';
import { getValueFromType } from '../src/extraction/getValueFromType';
import { DATA_TYPES } from './data';

describe('getValueFromType', () => {

    describe('Basics', () => {
        it('sollte einen Default-String generieren', () => {
            const result = getValueFromType('string', DATA_TYPES);
            expect(result.value).toBe('');
        });

        it('sollte eine Default-Zahl generieren', () => {
            const result = getValueFromType('number', DATA_TYPES);
            expect(result.value).toBe(0);
        });

        it('sollte einen Default-Boolean generieren', () => {
            const result = getValueFromType('boolean', DATA_TYPES);
            expect(result.value).toBe(false);
        });

        it('sollte NUMBER (Alias) als 1 generieren', () => {
            expect(getValueFromType('NUMBER', DATA_TYPES).value).toBe(0);
        });

        it('sollte LIST<T> als Array mit einem Inhalt generieren', () => {
            const result = getValueFromType('LIST<TEXT>', DATA_TYPES);
            expect(Array.isArray(result.value)).toBe(true);
            expect(result.value).toEqual(['']);
        });

        it('sollte verschachtelte LIST Typen generieren', () => {
            const result = getValueFromType('LIST<LIST<NUMBER>>', DATA_TYPES);
            expect(result.value).toEqual([[0]]);
        });
    });

    describe('Unions & Literals', () => {
        it('sollte das erste Element einer String-Union nehmen', () => {
            const result = getValueFromType('"GET" | "POST"', DATA_TYPES);
            expect(result.value).toBe('GET');
        });

        it('sollte bei einer Union aus verschiedenen Typen den ersten Typ wählen', () => {
            const result = getValueFromType('number | string', DATA_TYPES);

            expect(typeof result.value).toBe('number');
            expect(result.value).toBe(0);
        });
    });

    describe('Complex Objects (Deep Generation)', () => {
        it('sollte ein Objekt rekursiv mit Werten füllen', () => {
            const type = '{ id: NUMBER, profile: { username: TEXT, active: boolean } }';
            const result = getValueFromType(type, DATA_TYPES);

            expect(result.value).toEqual({
                id: 0,
                profile: {
                    username: '',
                    active: false
                }
            });
        });

        it('sollte Objekte innerhalb von Listen füllen', () => {
            const type = 'LIST<{ uid: TEXT, tags: LIST<NUMBER> }>';
            const result = getValueFromType(type, DATA_TYPES);

            expect(result.value).toEqual([
                {
                    uid: '',
                    tags: [0]
                }
            ]);
        });
    });

    describe('Edge Cases', () => {
        it('sollte mit optionalen Properties umgehen', () => {
            const type = '{ required: string, optional?: number }';
            const result = getValueFromType(type, DATA_TYPES);

            expect(result.value).toHaveProperty('required', '');
            expect(result.value).toHaveProperty('optional', 0);
        });

        it('sollte bei unkenntlichen Typen null zurückgeben (Graceful Fallback)', () => {
            const result = getValueFromType('AnyRandomUnknownType', DATA_TYPES);
            expect(result.value).toBeNull();
        });
    });
});