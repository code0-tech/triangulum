import ts from "typescript";
import {DataType, LiteralValue} from "@code0-tech/sagittarius-graphql-types";
import {createCompilerHost, getSharedTypeDeclarations, ValidationResult} from "../utils";

export const getValueValidation = (
    type?: string,
    value?: LiteralValue,
    dataTypes?: DataType[]
): ValidationResult => {
    const valueAsCode = JSON.stringify(value?.value);

    // 1. Construct the source code for validation.
    const sourceCode = `
        ${getSharedTypeDeclarations(dataTypes)}
        const testValue: ${type} = ${valueAsCode};
    `;

    const fileName = "index.ts";
    const compilerHost = createCompilerHost(fileName, sourceCode);
    const diagnostics = compilerHost.languageService.getSemanticDiagnostics(fileName);

    const errors = diagnostics.map(d => {
        const message = ts.flattenDiagnosticMessageText(d.messageText, "\n");
        // Generic placeholders like T, R, K, V are often warnings rather than hard errors if they remains un-inferred

        // Match specific phrases that indicate a mock error from our code generation,
        // while allowing other "not assignable" errors (which represent real logic errors).
        const isMockError = (message.includes("not assignable to parameter of type") && (message.includes("'{}'") || message.includes("undefined"))) ||
            message.includes("not assignable to type 'undefined'") ||
            message.includes("not assignable to type 'void'") ||
            message.includes("may be a mistake because neither type sufficiently overlaps");

        return {
            message,
            code: d.code,
            severity: (isMockError ? "warning" : "error") as "error" | "warning",
        };
    });

    return {
        isValid: !errors.some(e => e.severity === "error"),
        returnType: "void",
        diagnostics: errors,
    };
};