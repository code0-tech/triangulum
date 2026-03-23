import {describe, expect, it} from "vitest";
import {getNodeSuggestions} from "../src/suggestion/getNodeSuggestions";
import {DATA_TYPES, FUNCTION_SIGNATURES} from "./data";

describe("getNodeSuggestions", () => {
    it("should suggest functions with compatible return types and prioritize exact matches", () => {

        // We are looking for suggestions for a 'number' type
        const suggestions = getNodeSuggestions("TEXT", FUNCTION_SIGNATURES, DATA_TYPES);

        const map = suggestions.map(s => s.functionDefinition?.identifier)

        expect(map).toEqual(expect.arrayContaining([
            'std::list::first',
            'std::list::at',
            'std::list::last',
            'std::list::pop',
            'std::list::find_last',
            'std::list::join',
            'std::list::find',
            'std::number::as_text',
            'std::object::get',
            'std::object::set',
            'std::boolean::as_text',
            'std::text::decode',
            'std::text::trim',
            'std::text::reverse',
            'std::text::replace_last',
            'std::text::lowercase',
            'std::text::encode',
            'std::text::remove',
            'std::text::swapcase',
            'std::text::append',
            'std::text::insert',
            'std::text::prepend',
            'std::text::hex',
            'std::text::replace',
            'std::text::from_ascii',
            'std::text::octal',
            'std::text::capitalize',
            'std::text::replace_first',
            'std::text::uppercase',
            'std::text::at',
            'std::control::return',
            'std::control::value'
        ]))

    });

    it("should suggest functions with compatible return types and prioritize exact matches for boolean", () => {

        // We are looking for suggestions for a 'number' type
        const suggestions = getNodeSuggestions("BOOLEAN", FUNCTION_SIGNATURES, DATA_TYPES);

        const map = suggestions.map(s => s.functionDefinition?.identifier)

        expect(map).toEqual(expect.arrayContaining([
            'std::list::first',
            'std::list::at',
            'std::list::last',
            'std::list::pop',
            'std::list::find_last',
            'std::list::is_empty',
            'std::list::find',
            'std::number::is_zero',
            'std::number::has_digits',
            'std::number::is_greater',
            'std::number::is_equal',
            'std::number::is_positive',
            'std::number::is_less',
            'std::object::contains_key',
            'std::object::get',
            'std::object::set',
            'std::boolean::from_number',
            'std::boolean::is_equal',
            'std::boolean::from_text',
            'std::boolean::negate',
            'std::text::is_equal',
            'std::text::ends_with',
            'std::text::start_with',
            'std::text::contains',
            'std::control::return',
            'std::control::value'
        ]))

    });
});
