import ts from "typescript";
import {createCompilerHost} from "../utils";
import {LiteralValue} from "@code0-tech/sagittarius-graphql-types";

/**
 * Uses the TypeScript compiler to generate a precise type string from any runtime value.
 */
export const getTypeFromValue = (
    value?: LiteralValue | null
): string => {
    // 1. Serialize value to a JSON string for embedding in source code.
    const literal = JSON.stringify(value?.value);

    // 2. Wrap value in virtual source code.
    const sourceCode = `const tempValue = ${literal ?? "any"};`;
    const fileName = "index.ts";
    const host = createCompilerHost(fileName, sourceCode);
    const sourceFile = host.getSourceFile(fileName)!;
    const program = host.languageService.getProgram()!;
    const checker = program.getTypeChecker();

    let inferredType = "any";

    // 4. Extract type using the TypeChecker.
    const visit = (node: ts.Node) => {
        if (ts.isVariableDeclaration(node) && node.name.getText() === "tempValue") {
            const type = checker.getTypeAtLocation(node);
            inferredType = checker.typeToString(
                type,
                node,
                ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseFullyQualifiedType
            );
        }
        ts.forEachChild(node, visit);
    };

    visit(sourceFile);

    return inferredType;
};