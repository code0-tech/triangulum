import {describe, expect, it} from "vitest";
import {getTypesFromFunction} from "../src/extraction/getTypesFromFunction";
import {FUNCTION_SIGNATURES} from "./data";

describe("getTypesFromFunction", () => {

    it("should correctly parse std::list::filter", () => {
        const func = FUNCTION_SIGNATURES.find(f => f.identifier === "std::list::filter");
        expect(func).toBeDefined();
        if (func) {
            const result = getTypesFromFunction(func);
            expect(result.parameters).toEqual(["LIST<T>", "PREDICATE<T>"]);
            expect(result.returnType).toBe("LIST<T>");
        }
    });

    it("should correctly parse std::list::first", () => {
        const func = FUNCTION_SIGNATURES.find(f => f.identifier === "std::list::first");
        expect(func).toBeDefined();
        if (func) {
            const result = getTypesFromFunction(func);
            expect(result.parameters).toEqual(["LIST<T>"]);
            expect(result.returnType).toBe("T");
        }
    });

    it("should correctly parse std::list::for_each", () => {
        const func = FUNCTION_SIGNATURES.find(f => f.identifier === "std::list::for_each");
        expect(func).toBeDefined();
        if (func) {
            const result = getTypesFromFunction(func);
            expect(result.parameters).toEqual(["LIST<T>", "CONSUMER<T>"]);
            expect(result.returnType).toBe("void");
        }
    });

    it("should correctly parse std::list::map", () => {
        const func = FUNCTION_SIGNATURES.find(f => f.identifier === "std::list::map");
        expect(func).toBeDefined();
        if (func) {
            const result = getTypesFromFunction(func);
            expect(result.parameters).toEqual(["LIST<T>", "TRANSFORM<T, R>"]);
            expect(result.returnType).toBe("LIST<R>");
        }
    });

    it("should correctly parse std::list::at", () => {
        const func = FUNCTION_SIGNATURES.find(f => f.identifier === "std::list::at");
        expect(func).toBeDefined();
        if (func) {
            const result = getTypesFromFunction(func);
            expect(result.parameters).toEqual(["LIST<T>", "NUMBER"]);
            expect(result.returnType).toBe("T");
        }
    });

    it("should correctly parse std::list::sort_reverse", () => {
        const func = FUNCTION_SIGNATURES.find(f => f.identifier === "std::list::sort_reverse");
        expect(func).toBeDefined();
        if (func) {
            const result = getTypesFromFunction(func);
            expect(result.parameters).toEqual(["LIST<T>", "COMPARATOR<T>"]);
            expect(result.returnType).toBe("LIST<T>");
        }
    });
});
