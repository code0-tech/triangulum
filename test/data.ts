import {DataType, FunctionDefinition} from "@code0-tech/sagittarius-graphql-types";

/**
 * Available data types and their TypeScript mappings.
 */
export const DATA_TYPES: DataType[] = [
    {identifier: "LIST", type: "T[]", genericKeys: ["T"]},
    {identifier: "NUMBER", type: "number"},
    {identifier: "HTTP_METHOD", type: `"GET" | "POST" | "PUT" | "DELETE"`},
    {identifier: "STRING", type: "string"},
    {identifier: "CONSUMER", type: "(item:R) => void", genericKeys: ["R"]},
    {identifier: "PREDICATE", type: "(item:R) => T", genericKeys: ["R", "T"]},
    {
        identifier: "NUMBER_ARRAY", type: "LIST<NUMBER>", linkedDataTypes: {
            nodes: [{
                identifier: "NUMBER",
            }, {
                identifier: "LIST",
            }]
        }
    },
];

/**
 * Built-in function signatures for validation and type inference.
 */
export const FUNCTION_SIGNATURES: FunctionDefinition[] = [
    {
        signature: "<R>(list: LIST<R>, index: NUMBER): R",
        identifier: "std::list::at",
    },
    {
        signature: "(a: NUMBER, b: NUMBER): NUMBER",
        identifier: "std::math::add",
    },
    {
        signature: "<R>(list: LIST<R>, consumer: CONSUMER<R>): void",
        identifier: "std::control::for_each",
    },
    {
        signature: "<R>(list: LIST<R>, predicate: PREDICATE<R, boolean>): R",
        identifier: "std::control::find",
    },
    {
        signature: "<R>(value: R): R",
        identifier: "std::control::return",
    }
];