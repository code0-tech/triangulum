import {DataType, FunctionDefinition} from "@code0-tech/sagittarius-graphql-types";

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
 * Internal representation of a DataType with its TypeScript equivalent.
 */
interface ExtendedDataType extends DataType {
    type: string;
}

/**
 * Internal representation of a FunctionDefinition with TypeScript-specific fields.
 */
interface ExtendedFunction extends Omit<FunctionDefinition, 'returnType'> {
    returnType: string;
    parameters: { nodes: ExtendedDataType[] };
}

/**
 * Available data types and their TypeScript mappings.
 */
export const DATA_TYPES: ExtendedDataType[] = [
    {identifier: "LIST", type: "T[]", genericKeys: ["T"]},
    {identifier: "NUMBER", type: "number"},
    {identifier: "STRING", type: "string"},
    {identifier: "CONSUMER", type: "(item:R) => void", genericKeys: ["R"]},
    {identifier: "PREDICATE", type: "(item:R) => T", genericKeys: ["R", "T"]},
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