import {DataType, FunctionDefinition} from "@code0-tech/sagittarius-graphql-types";

export interface ValidationResult {
    isValid: boolean;
    inferredType: string;
    errors: Array<{
        message: string;
        code: number;
        severity: "error" | "warning";
    }>;
    sourceCode?: string;
}

interface LDataType extends DataType {
    type: string;
}

interface LFunction extends Omit<FunctionDefinition, 'returnType'> {
    returnType: string;
    parameters: { nodes: LDataType[] };
}

export const DATA_TYPES: LDataType[] = [
    {identifier: "LIST", type: "T[]", genericKeys: ["T"]},
    {identifier: "NUMBER", type: "number"},
    {identifier: "STRING", type: "string"},
    {identifier: "CONSUMER", type: "(item:R) => void", genericKeys: ["R"]},
    {identifier: "PREDICATE", type: "(item:R) => T", genericKeys: ["R", "T"]},
];

export const FUNCTION_SIGNATURES: LFunction[] = [
    {
        identifier: "std::list::at",
        returnType: "R",
        genericKeys: ["R"],
        parameters: {
            nodes: [
                {
                    identifier: "list",
                    type: "LIST<R>"
                },
                {
                    identifier: "index",
                    type: "NUMBER"
                }
            ]
        }
    },
    {
        identifier: "std::math::add",
        returnType: "NUMBER",
        genericKeys: [],
        parameters: {
            nodes: [
                {
                    identifier: "a",
                    type: "NUMBER"
                },
                {
                    identifier: "b",
                    type: "NUMBER"
                }
            ]
        }
    },
    {
        identifier: "std::control::for_each",
        returnType: "void",
        genericKeys: ["R"],
        parameters: {
            nodes: [
                {
                    identifier: "a",
                    type: "LIST<R>"
                },
                {
                    identifier: "b",
                    type: "CONSUMER<R>"
                }
            ]
        }
    },
    {
        identifier: "std::control::find",
        returnType: "R",
        genericKeys: ["R"],
        parameters: {
            nodes: [
                {
                    identifier: "a",
                    type: "LIST<R>"
                },
                {
                    identifier: "b",
                    type: "PREDICATE<R, boolean>"
                }
            ]
        }
    },
    {
        identifier: "std::control::return",
        returnType: "R",
        genericKeys: ["R"],
        parameters: {
            nodes: [
                {
                    identifier: "a",
                    type: "R"
                }
            ]
        }
    }
];