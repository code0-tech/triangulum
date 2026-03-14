import {FunctionDefinition, NodeFunction} from "@code0-tech/sagittarius-graphql-types";
import {createCompilerHost, getSharedTypeDeclarations} from "../utils";
import {DATA_TYPES} from "../../test/data";

/**
 * Suggests NodeFunctions based on a given type and a list of available FunctionDefinitions.
 * Returns functions whose return type is compatible with the target type.
 */
//TODO: add dataTypes
export function getNodeSuggestions(type: string, functions: FunctionDefinition[]): NodeFunction[] {
    if (!type || !functions || functions.length === 0) {
        return [];
    }

    function getGenericsCount(input: string): number {
        const match = input.match(/<([^>]+)>/);
        if (!match) return 0;
        return match[1].split(',').map(s => s.trim()).filter(Boolean).length;
    }

    const sharedTypes = getSharedTypeDeclarations(DATA_TYPES);
    const sourceCode = `
        ${sharedTypes}
        type TargetType = ${type};
        ${functions.map((f, i) => {

        return `
        declare function Fu${i}${f.signature};
        type F${i} = ReturnType<typeof Fu${i}${getGenericsCount(f.signature!) > 0 ? `<${Array(getGenericsCount(f.signature!)).fill("any").join(", ")}>` : ""}>;
        `;
    }).join("\n")}
        ${functions.map((_, i) => `const check${i}: TargetType = {} as F${i};`).join("\n")}
    `;

    const fileName = "index.ts";
    const host = createCompilerHost(fileName, sourceCode);
    const sourceFile = host.getSourceFile(fileName)!;
    const program = host.languageService.getProgram()!;

    const diagnostics = program.getSemanticDiagnostics();
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
                    nodes: (f.parameterDefinitions?.nodes || []).map(p => ({
                        __typename: "NodeParameter",
                        parameterDefinition: {
                            __typename: "ParameterDefinition",
                            id: p?.identifier as any,
                            identifier: p?.identifier
                        },
                        value: null
                    }))
                }
            } as any as NodeFunction;
        })
        .filter((f): f is NodeFunction => f !== null);
}
