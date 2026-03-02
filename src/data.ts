import {ExtendedDataType, ExtendedFunction} from "./utils";

/**
 * Result of a node or flow validation.
 */
export interface ValidationResult {
    isValid: boolean;
    inferredType: string;
    errors: Array<{
        message: string;
        code: number;
        severity: "error" | "warning";
    }>;
}

/**
 * Available data types and their TypeScript mappings.
 */
export const DATA_TYPES: ExtendedDataType[] = [
    {identifier: "LIST", type: "T[]", genericKeys: ["T"]},
    {identifier: "NUMBER", type: "number"},
    {identifier: "HTTP_METHOD", type: `"GET" | "POST" | "PUT" | "DELETE"`},
    {identifier: "STRING", type: "string"},
    {identifier: "CONSUMER", type: "(item:R) => void", genericKeys: ["R"]},
    {identifier: "PREDICATE", type: "(item:R) => T", genericKeys: ["R", "T"]},
    {identifier: "NUMBER_ARRAY", type: "LIST<NUMBER>", linkedDataTypeIdentifiers: ["LIST", "NUMBER"]},
];

/**
 * Built-in function signatures for validation and type inference.
 */
export const FUNCTION_SIGNATURES: ExtendedFunction[] = [
    {
        identifier: "std::list::at",
        returnType: "R",
        genericKeys: ["R"],
        parameters: {
            nodes: [
                {identifier: "list", type: "LIST<R>"},
                {identifier: "index", type: "NUMBER"}
            ]
        }
    },
    {
        identifier: "std::math::add",
        returnType: "NUMBER",
        genericKeys: [],
        parameters: {
            nodes: [
                {identifier: "a", type: "NUMBER"},
                {identifier: "b", type: "NUMBER"}
            ]
        }
    },
    {
        identifier: "std::control::for_each",
        returnType: "void",
        genericKeys: ["R"],
        parameters: {
            nodes: [
                {identifier: "a", type: "LIST<R>"},
                {identifier: "b", type: "CONSUMER<R>"}
            ]
        }
    },
    {
        identifier: "std::control::find",
        returnType: "R",
        genericKeys: ["R"],
        parameters: {
            nodes: [
                {identifier: "a", type: "LIST<R>"},
                {identifier: "b", type: "PREDICATE<R, boolean>"}
            ]
        }
    },
    {
        identifier: "std::control::return",
        returnType: "R",
        genericKeys: ["R"],
        parameters: {
            nodes: [
                {identifier: "a", type: "R"}
            ]
        }
    }
];