import {flattenDiagnosticMessageText} from "typescript";
import {
    DataType,
    Flow,
    FunctionDefinition,
    NodeFunction,
    NodeFunctionIdWrapper,
    NodeParameter,
    ReferenceValue
} from "@code0-tech/sagittarius-graphql-types";
import {createCompilerHost, generateFlowSourceCode, getSharedTypeDeclarations, ValidationResult} from "../utils";

const sanitizeId = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '_');

/**
 * Validates a flow by generating virtual TypeScript code and running it through the TS compiler.
 */
export const getFlowValidation = (
    flow?: Flow,
    functions?: FunctionDefinition[],
    dataTypes?: DataType[]
): ValidationResult => {


    const sourceCode = generateFlowSourceCode(flow, functions, dataTypes);

    // 3. Virtual TypeScript Compilation
    const fileName = "index.ts";
    const host = createCompilerHost(fileName, sourceCode);
    const sourceFile = host.getSourceFile(fileName)!;

    const program = host.languageService.getProgram()!;
    const diagnostics = program.getSemanticDiagnostics(sourceFile);

    const errors = diagnostics.map(d => {
        const message = flattenDiagnosticMessageText(d.messageText, "\n");
        // "Argument of type 'undefined' is not assignable to parameter of type 'number'."
        // We ignore this in flow validation too because we might generate code for incomplete flows.

        let nodeId: NodeFunction['id'] | undefined;
        let parameterIndex: number | undefined;

        if (d.start !== undefined) {
            const fullText = sourceFile.getFullText();

            // Search for position marker comment near the error location
            // The error position is typically the start of the problematic token (e.g., "undefined")
            const searchStart = Math.max(0, d.start - 300);
            const searchEnd = Math.min(fullText.length, d.start);
            const searchText = fullText.substring(searchStart, searchEnd);

            // Find all @pos comments in the search range
            const posRegex = /\/\* @pos ([^ ]+) (\d+) \*\//g;
            let match;
            let closestMatch: RegExpExecArray | null = null;
            let closestCommentEnd = -1;

            // Collect all matches and find the one whose end is closest to d.start
            // We want the comment that is immediately before the error
            while ((match = posRegex.exec(searchText)) !== null) {
                const commentStart = searchStart + match.index;
                const commentEnd = commentStart + match[0].length;

                // Only consider comments that end before or very close to the error start
                // This ensures we get the @pos comment that directly precedes the problematic argument
                if (commentEnd <= d.start!) {
                    if (commentEnd > closestCommentEnd) {
                        closestCommentEnd = commentEnd;
                        closestMatch = match;
                    }
                }
            }

            if (closestMatch) {
                nodeId = closestMatch[1] as NodeFunction['id'];
                parameterIndex = parseInt(closestMatch[2], 10);
            }
        }

        return {
            message,
            code: d.code,
            severity: "error" as const,
            nodeId,
            parameterIndex
        };
    }).filter((e) => e !== null);

    return {
        isValid: !errors.some(e => e?.severity === "error"),
        returnType: "void",
        diagnostics: errors,
    };
};