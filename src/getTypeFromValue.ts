import ts from "typescript";
import {createCompilerHost} from "./utils";

/**
 * Uses the TypeScript compiler to generate a precise type string from any runtime value.
 */
export const getTypeFromValue = (value: any): string => {
    // 1. Serialize value to a JSON string for embedding in source code.
    const literal = JSON.stringify(value);

    // 2. Wrap value in virtual source code.
    const sourceCode = `const tempValue = ${literal};`;
    const fileName = "temp_value.ts";
    const sourceFile = ts.createSourceFile(fileName, sourceCode, ts.ScriptTarget.Latest);

    // 3. Setup a minimal compiler host.
    const host = createCompilerHost(fileName, sourceCode, sourceFile);

    const program = ts.createProgram([fileName], {target: ts.ScriptTarget.Latest, noEmit: true}, host);
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