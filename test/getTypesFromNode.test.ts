import {describe, expect, it} from 'vitest';
import {getTypesFromNode} from '../src/extraction/getTypesFromNode';
import {FUNCTION_SIGNATURES, DATA_TYPES} from "./data";

describe('getTypesFromNode', () => {
    it('should resolve types for std::list::at with string array', () => {
        const node = {
            functionDefinition: {
                identifier: "std::list::at" as any
            },
            parameters: {
                nodes: [{
                    value: {
                        __typename: "LiteralValue",
                        value: ["a", "b", "c"]
                    }
                }, {
                    value: {
                        __typename: "LiteralValue",
                        value: 1
                    }
                }]
            }
        };
        const result = getTypesFromNode(node as any, FUNCTION_SIGNATURES, DATA_TYPES);

        expect(result.returnType).toBe("string");
        expect(result.parameters).toContain("LIST<string>");
        expect(result.parameters).toContain("number");
    });

    it('should resolve types for std::list::at with string array', () => {
        const node = {
            functionDefinition: {
                identifier: "std::list::at" as any
            },
            parameters: {
                nodes: [{
                    value: null
                }, {
                    value: {
                        __typename: "LiteralValue",
                        value: 1
                    }
                }]
            }
        };
        const result = getTypesFromNode(node as any, FUNCTION_SIGNATURES, DATA_TYPES);

        expect(result.returnType).toBe("unknown");
        expect(result.parameters).toContain("LIST<unknown>");
        expect(result.parameters).toContain("number");
    });

    it('should resolve types for std::math::add', () => {
        const node = {
            functionDefinition: {
                identifier: "std::number::add" as any
            },
            parameters: {
                nodes: [{
                    value: {
                        __typename: "LiteralValue",
                        value: 5
                    }
                }, {
                    value: {
                        __typename: "LiteralValue",
                        value: 10
                    }
                }]
            }
        };
        const result = getTypesFromNode(node as any, FUNCTION_SIGNATURES, DATA_TYPES);

        expect(result.returnType).toBe("number");
        expect(result.parameters).toEqual(["number", "number"]);
    });

    it('should return any for unknown function', () => {
        const node = {
            functionDefinition: {
                identifier: "unknown::func" as any
            }
        };
        const result = getTypesFromNode(node as any, FUNCTION_SIGNATURES, DATA_TYPES);

        expect(result.returnType).toBe("any");
        expect(result.parameters).toEqual([]);
    });
});

