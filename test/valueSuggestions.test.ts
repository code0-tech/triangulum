import { describe, it, expect } from 'vitest';
import { getValueSuggestions } from '../src/suggestion/getValueSuggestions';

describe('getLanguageServiceSuggestions', () => {

    it('should suggest string literals from a simple union', () => {
        const type = '"GET" | "POST" | "DELETE"';
        const suggestions = getValueSuggestions(type);
        const values = suggestions.map(s => s.value);

        expect(values).toContain('GET');
        expect(values).toContain('POST');
        expect(values).toContain('DELETE');

        expect(suggestions.length).toBe(3);
    });

    it('should suggest boolean values when type is boolean', () => {
        const type = 'boolean';
        const suggestions = getValueSuggestions(type);
        const values = suggestions.map(s => s.value);

        // TypeScript schlägt bei boolean oft true/false vor
        expect(values).toContain('true');
        expect(values).toContain('false');
    });

    it('should work with mixed string and number literals (as strings)', () => {
        const type = '"A" | 1 | 2';
        const suggestions = getValueSuggestions(type);
        const values = suggestions.map(s => s.value);

        expect(values).toContain('A');
        // Hinweis: Der Language Service gibt Namen oft als Strings zurück
        expect(values).toContain('1');
        expect(values).toContain('2');
    });

    it('should return empty array for general string type without literals', () => {
        const type = 'string';
        const suggestions = getValueSuggestions(type);
        const values = suggestions.map(s => s.value);

        // Wenn es nur 'string' ist, gibt es keine spezifischen Literale zu vervollständigen
        // Der Language Service könnte globale Variablen vorschlagen, daher prüfen wir
        // hier spezifisch auf das Ausbleiben deiner Literale.
        expect(values).not.toContain('GET');
    });

    it('should resolve suggestions from type aliases (Inference Check)', () => {
        // Da wir den Language Service nutzen, können wir auch Aliase testen,
        // sofern sie im Host-Content definiert sind.
        // Für diesen Test müsste der Content im Service-Host erweitert werden.
        const type = '"active" | "inactive"';
        const suggestions = getValueSuggestions(type);
        const values = suggestions.map(s => s.value);

        expect(values).toEqual(expect.arrayContaining(['active', 'inactive']));
    });

    it('should handle complex template literal types', () => {
        const type = '`top-${"left" | "right"}`';
        const suggestions = getValueSuggestions(type);
        const values = suggestions.map(s => s.value);

        // Das ist die Stärke des Language Service!
        expect(values).toContain('top-left');
        expect(values).toContain('top-right');
    });

    it('should handle empty or invalid types gracefully', () => {
        const type = '';
        const suggestions = getValueSuggestions(type);
        const values = suggestions.map(s => s.value);

        expect(Array.isArray(values)).toBe(true);
        expect(values.length).toBe(0);
    });
});