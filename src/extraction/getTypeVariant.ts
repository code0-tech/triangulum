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

export interface TypeVariantResult {
    identifier: string;
    variant: DataTypeVariant;
}

/**
 * Determines the variant of a given TypeScript types string or DataType(s) using the TS compiler.
 * - If types is a string: returns one result with the string as identifier
 * - If types is a DataType: returns one result with DataType.identifier
 * - If types is a DataType[]: returns results for each DataType with their identifiers
 */
export const getTypeVariant = (
    types?: string | DataType | DataType[],
    dataTypes?: DataType[]
): TypeVariantResult[] => {
    const typeDefs = getSharedTypeDeclarations(dataTypes);

    // Determine what we're analyzing
    const isStringType = typeof types === "string";
    const isArrayType = Array.isArray(types);
    const typesToAnalyze = isArrayType ? (types as DataType[]) : isStringType ? [{ identifier: types, type: types }] : [types];
    const identifiers = isArrayType
        ? (types as DataType[]).map(t => t.identifier)
        : isStringType
        ? [types as string]
        : [(types as DataType).identifier];

    const results: TypeVariantResult[] = [];

    for (let i = 0; i < typesToAnalyze.length; i++) {
        const currentType = typesToAnalyze[i];
        const currentIdentifier = identifiers[i];
        const typeString = isStringType ? (types as string) : (currentType as DataType).type;

        // We declare a variable with the types to probe it
        const sourceCode = `
            ${typeDefs}
            ${typeString ? `type TargetType = ${typeString};` : ""}
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
                    discoveredVariant = DataTypeVariant.OBJECT;
                } else {
                    discoveredVariant = DataTypeVariant.TYPE;
                }
            }
            ts.forEachChild(node, visit);
        };

        visit(sourceFile);

        results.push({
            identifier: currentIdentifier!,
            variant: discoveredVariant
        });
    }

    return results;
};
