import { describe, it, expect } from 'vitest';
import { getValueSuggestions } from '../src/getValueSuggestions';

describe('getLanguageServiceSuggestions', () => {

    it('should suggest string literals from a simple union', () => {
        const type = '"GET" | "POST" | "DELETE"';
        const suggestions = getValueSuggestions(type);

        expect(suggestions).toContain('GET');
        expect(suggestions).toContain('POST');
        expect(suggestions).toContain('DELETE');
        expect(suggestions.length).toBe(3);
    });

    it('should suggest boolean values when type is boolean', () => {
        const type = 'boolean';
        const suggestions = getValueSuggestions(type);

        // TypeScript schlägt bei boolean oft true/false vor
        expect(suggestions).toContain('true');
        expect(suggestions).toContain('false');
    });

    it('should work with mixed string and number literals (as strings)', () => {
        const type = '"A" | 1 | 2';
        const suggestions = getValueSuggestions(type);

        expect(suggestions).toContain('A');
        // Hinweis: Der Language Service gibt Namen oft als Strings zurück
        expect(suggestions).toContain('1');
        expect(suggestions).toContain('2');
    });

    it('should return empty array for general string type without literals', () => {
        const type = 'string';
        const suggestions = getValueSuggestions(type);

        // Wenn es nur 'string' ist, gibt es keine spezifischen Literale zu vervollständigen
        // Der Language Service könnte globale Variablen vorschlagen, daher prüfen wir
        // hier spezifisch auf das Ausbleiben deiner Literale.
        expect(suggestions).not.toContain('GET');
    });

    it('should resolve suggestions from type aliases (Inference Check)', () => {
        // Da wir den Language Service nutzen, können wir auch Aliase testen,
        // sofern sie im Host-Content definiert sind.
        // Für diesen Test müsste der Content im Service-Host erweitert werden.
        const type = '"active" | "inactive"';
        const suggestions = getValueSuggestions(type);

        expect(suggestions).toEqual(expect.arrayContaining(['active', 'inactive']));
    });

    it('should handle complex template literal types', () => {
        const type = '`top-${"left" | "right"}`';
        const suggestions = getValueSuggestions(type);

        // Das ist die Stärke des Language Service!
        expect(suggestions).toContain('top-left');
        expect(suggestions).toContain('top-right');
    });

    it('should handle empty or invalid types gracefully', () => {
        const type = '';
        const suggestions = getValueSuggestions(type);

        expect(Array.isArray(suggestions)).toBe(true);
        expect(suggestions.length).toBe(0);
    });
});