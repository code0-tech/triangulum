import ts from "typescript";
import {LiteralValue} from "@code0-tech/sagittarius-graphql-types";
import {createCompilerHost, DEFAULT_COMPILER_OPTIONS, getSharedTypeDeclarations} from "./utils";

/**
 * Validates whether a literal value conforms to a specific TypeScript type string.
 */
export interface ValueValidationResult {
    isValid: boolean;
    error?: string;
}

export const getValueValidation = (targetType: string, literal: LiteralValue): ValueValidationResult => {
    const valueAsCode = JSON.stringify(literal.value);

    // 1. Construct the source code for validation.
    const sourceCode = `
        ${getSharedTypeDeclarations()}
        const testValue: ${targetType} = ${valueAsCode};
    `;

    const fileName = "value_check.ts";
    const sourceFile = ts.createSourceFile(fileName, sourceCode, ts.ScriptTarget.Latest);

    // 2. Setup virtual host and compile.
    const host = createCompilerHost(fileName, sourceCode, sourceFile);

    const program = ts.createProgram([fileName], DEFAULT_COMPILER_OPTIONS, host);

    const diagnostics = program.getSemanticDiagnostics(sourceFile);

    if (diagnostics.length > 0) {
        return {
            isValid: false,
            error: ts.flattenDiagnosticMessageText(diagnostics[0].messageText, "\n")
        };
    }

    return {isValid: true};
};