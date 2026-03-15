import ts from "typescript";
import {createCompilerHost, getSharedTypeDeclarations} from "../utils";
import {DataType} from "@code0-tech/sagittarius-graphql-types";

export enum DataTypeVariant {
    PRIMITIVE,
    TYPE,
    ARRAY,
    OBJECT,
    NODE
}

/**
 * Determines the variant of a given TypeScript type string using the TS compiler.
 */
export const getTypeVariant = (
    type?: string,
    dataTypes?: DataType[]
): DataTypeVariant => {
    const typeDefs = getSharedTypeDeclarations(dataTypes);

    // We declare a variable with the type to probe it
    const sourceCode = `
        ${typeDefs}
        type TargetType = ${type};
        const val: TargetType = {} as any;
    `;

    const fileName = `index.ts`;
    const host = createCompilerHost(fileName, sourceCode);
    const sourceFile = host.getSourceFile(fileName)!;
    const program = host.languageService.getProgram()!;
    const checker = program.getTypeChecker();

    let discoveredVariant: DataTypeVariant = DataTypeVariant.TYPE;

    const visit = (node: ts.Node) => {
        if (ts.isVariableDeclaration(node) && node.name.getText() === "val") {
            const type = checker.getTypeAtLocation(node);

            if (type.getCallSignatures().length > 0) {
                discoveredVariant = DataTypeVariant.NODE;
            } else if (checker.isArrayType(type)) {
                discoveredVariant = DataTypeVariant.ARRAY;
            } else if (
                type.isStringLiteral() ||
                type.isNumberLiteral() ||
                (type.getFlags() & (ts.TypeFlags.String | ts.TypeFlags.Number | ts.TypeFlags.Boolean | ts.TypeFlags.EnumLiteral | ts.TypeFlags.BigInt | ts.TypeFlags.ESSymbol)) !== 0
            ) {
                discoveredVariant = DataTypeVariant.PRIMITIVE;
            } else if (type.isClassOrInterface() || (type.getFlags() & ts.TypeFlags.Object) !== 0) {
                // Check if it's literally just a type alias to something else or a complex object
                if (type.getProperties().length > 0) {
                    discoveredVariant = DataTypeVariant.OBJECT;
                } else {
                    discoveredVariant = DataTypeVariant.TYPE;
                }
            } else {
                discoveredVariant = DataTypeVariant.TYPE;
            }
        }
        ts.forEachChild(node, visit);
    };

    visit(sourceFile);
    return discoveredVariant;
};
