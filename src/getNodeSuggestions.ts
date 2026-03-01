import {NodeFunction} from "@code0-tech/sagittarius-graphql-types";
import ts from "typescript";
import {ExtendedFunction, createCompilerHost, DEFAULT_COMPILER_OPTIONS, getSharedTypeDeclarations} from "./utils";
import {DATA_TYPES} from "./data";

/**
 * Suggests NodeFunctions based on a given type and a list of available FunctionDefinitions.
 * Returns functions whose return type is compatible with the target type.
 */
export function getNodeSuggestions(targetType: string, functions: ExtendedFunction[]): NodeFunction[] {
    if (!targetType || !functions || functions.length === 0) {
        return [];
    }

    const fileName = "suggestions.ts";

    const sharedTypes = getSharedTypeDeclarations(DATA_TYPES);

    const sourceCode = `
        ${sharedTypes}
        type TargetType = ${targetType};
        ${functions.map((f, i) => {
            const generics = f.genericKeys && f.genericKeys.length > 0
                ? `<${f.genericKeys.map(k => `${k} = any`).join(",")}>`
                : "";
            return `type F${i}${generics} = ${f.returnType};`;
        }).join("\n")}
        ${functions.map((_, i) => `const check${i}: TargetType = {} as F${i};`).join("\n")}
    `;

    const sourceFile = ts.createSourceFile(fileName, sourceCode, ts.ScriptTarget.Latest);
    const host = createCompilerHost(fileName, sourceCode, sourceFile);
    const program = ts.createProgram([fileName], {
        ...DEFAULT_COMPILER_OPTIONS
    }, host);

    const diagnostics = ts.getPreEmitDiagnostics(program);
    const errorLines = new Set<number>();
    diagnostics.forEach(diag => {
        if (diag.file === sourceFile && diag.start !== undefined) {
            errorLines.add(sourceFile.getLineAndCharacterOfPosition(diag.start).line);
        }
    });

    return functions
        .map((f, i) => {
            // Find the line number of 'const check${i}'
            const lineToMatch = `const check${i}: TargetType = {} as F${i};`;
            const lines = sourceCode.split("\n");
            const actualLine = lines.findIndex(l => l.includes(lineToMatch));

            if (actualLine !== -1 && errorLines.has(actualLine)) {
                return null;
            }

            return {
                __typename: "NodeFunction",
                id: `gid://sagittarius/NodeFunction/1`,
                functionDefinition: {
                    __typename: "FunctionDefinition",
                    id: f.identifier as any,
                    identifier: f.identifier,
                },
                parameters: {
                    __typename: "NodeParameterConnection",
                    nodes: (f.parameters?.nodes || []).map(p => ({
                        __typename: "NodeParameter",
                        parameterDefinition: {
                            __typename: "ParameterDefinition",
                            id: p.identifier as any,
                            identifier: p.identifier
                        },
                        value: null
                    }))
                }
            } as any as NodeFunction;
        })
        .filter((f): f is NodeFunction => f !== null);
}
