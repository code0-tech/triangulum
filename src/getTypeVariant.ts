import ts from "typescript";
import {ExtendedDataType, getSharedTypeDeclarations, createCompilerHost, DEFAULT_COMPILER_OPTIONS} from "./utils";

export enum Variant {
    PRIMITIVE,
    TYPE,
    ARRAY,
    OBJECT,
}

/**
 * Determines the variant of a given TypeScript type string using the TS compiler.
 */
export const getTypeVariant = (
    typeString: string,
    dataTypes: ExtendedDataType[]
): Variant => {
    const typeDefs = getSharedTypeDeclarations(dataTypes);
    const fileName = `type_probe_${Math.random().toString(36).substring(7)}.ts`;

    // We declare a variable with the type to probe it
    const sourceCode = `
        ${typeDefs}
        type TargetType = ${typeString};
        const val: TargetType = {} as any;
    `;

    const sourceFile = ts.createSourceFile(fileName, sourceCode, ts.ScriptTarget.Latest);
    const host = createCompilerHost(fileName, sourceCode, sourceFile);
    const program = ts.createProgram([fileName], DEFAULT_COMPILER_OPTIONS, host);
    const checker = program.getTypeChecker();

    let discoveredVariant: Variant = Variant.TYPE;

    const visit = (node: ts.Node) => {
        if (ts.isVariableDeclaration(node) && node.name.getText() === "val") {
            const type = checker.getTypeAtLocation(node);

            if (checker.isArrayType(type)) {
                discoveredVariant = Variant.ARRAY;
            } else if (
                type.isStringLiteral() ||
                type.isNumberLiteral() ||
                (type.getFlags() & (ts.TypeFlags.String | ts.TypeFlags.Number | ts.TypeFlags.Boolean | ts.TypeFlags.EnumLiteral | ts.TypeFlags.BigInt | ts.TypeFlags.ESSymbol)) !== 0
            ) {
                discoveredVariant = Variant.PRIMITIVE;
            } else if (type.isClassOrInterface() || (type.getFlags() & ts.TypeFlags.Object) !== 0) {
                // Check if it's literally just a type alias to something else or a complex object
                if (type.getProperties().length > 0) {
                    discoveredVariant = Variant.OBJECT;
                } else {
                    discoveredVariant = Variant.TYPE;
                }
            } else {
                discoveredVariant = Variant.TYPE;
            }
        }
        ts.forEachChild(node, visit);
    };

    visit(sourceFile);
    return discoveredVariant;
};
