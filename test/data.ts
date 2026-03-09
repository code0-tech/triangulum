import {ExtendedDataType, ExtendedFunction} from "../src/utils";

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
        signature: "<R>(list: LIST<R>, index: NUMBER): R",
        identifier: "std::list::at",
        genericKeys: ["R"]
    },
    {
        signature: "(a: NUMBER, b: NUMBER): NUMBER",
        identifier: "std::math::add",
        genericKeys: []
    },
    {
        signature: "<R>(list: LIST<R>, consumer: CONSUMER<R>): void",
        identifier: "std::control::for_each",
        genericKeys: ["R"]
    },
    {
        signature: "<R>(list: LIST<R>, predicate: PREDICATE<R, boolean>): R",
        identifier: "std::control::find",
        genericKeys: ["R"]
    },
    {
        signature: "<R>(value: R): R",
        identifier: "std::control::return",
        genericKeys: ["R"]
    }
];