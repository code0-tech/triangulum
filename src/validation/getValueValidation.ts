import ts from "typescript";
import {DataType, LiteralValue} from "@code0-tech/sagittarius-graphql-types";
import {createCompilerHost, DEFAULT_COMPILER_OPTIONS, getSharedTypeDeclarations} from "../utils";

/**
 * Validates whether a literal value conforms to a specific TypeScript type string.
 */
export interface ValueValidationResult {
    isValid: boolean;
    error?: string;
}

export const getValueValidation = (
    type: string,
    value: LiteralValue,
    dataTypes: DataType[]
): ValueValidationResult => {
    const valueAsCode = JSON.stringify(value.value);

    // 1. Construct the source code for validation.
    const sourceCode = `
        ${getSharedTypeDeclarations(dataTypes)}
        const testValue: ${type} = ${valueAsCode};
    `;

    const fileName = "value_check.ts";
    const sourceFile = ts.createSourceFile(fileName, sourceCode, ts.ScriptTarget.Latest);
    const compilerHost = createCompilerHost(fileName, sourceCode, sourceFile);
    const program = ts.createProgram([fileName], DEFAULT_COMPILER_OPTIONS, compilerHost);
    const diagnostics = program.getSemanticDiagnostics(sourceFile);

    if (diagnostics.length > 0) {
        return {
            isValid: false,
            error: ts.flattenDiagnosticMessageText(diagnostics[0].messageText, "\n")
        };
    }

    return {isValid: true};
};