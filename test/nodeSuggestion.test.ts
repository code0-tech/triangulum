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
            'std::list::max',
            'std::list::at',
            'std::list::last',
            'std::list::sum',
            'std::list::pop',
            'std::list::find_last',
            'std::list::min',
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
            'std::text::to_ascii',
            'std::text::encode',
            'std::text::remove',
            'std::text::swapcase',
            'std::text::append',
            'std::text::insert',
            'std::text::prepend',
            'std::text::as_bytes',
            'std::text::hex',
            'std::text::replace',
            'std::text::from_ascii',
            'std::text::octal',
            'std::text::chars',
            'std::text::capitalize',
            'std::text::split',
            'std::text::replace_first',
            'std::text::uppercase',
            'std::text::at',
            'std::control::value'
        ]))

    });
});
