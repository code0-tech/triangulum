import {describe, expect, it} from "vitest";
import {getNodeSuggestions} from "../src/suggestion/getNodeSuggestions";
import {FUNCTION_SIGNATURES} from "./data";

describe("getNodeSuggestions", () => {
    it("should suggest functions with compatible return types and prioritize exact matches", () => {

        // We are looking for suggestions for a 'number' type
        const suggestions = getNodeSuggestions("STRING", FUNCTION_SIGNATURES);

        const map = suggestions.map(s => s.functionDefinition?.id)

        console.log(map)

        expect(map).include("std::list::at")
        expect(map).include("std::control::find")
        expect(map).include("std::control::return")
        expect(map).not.include("std::math::add")

    });
});
