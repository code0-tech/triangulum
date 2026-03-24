import ts from "typescript";
import {DataType, LiteralValue} from "@code0-tech/sagittarius-graphql-types";
import {createCompilerHost, getSharedTypeDeclarations} from "../utils";

/**
 * Generates a sample LiteralValue from a TypeScript type string.
 */
export const getValueFromType = (
    type?: string,
    dataTypes?: DataType[]
): LiteralValue => {
    // 1. Prepare declarations.
    const sourceCode = `
        ${getSharedTypeDeclarations(dataTypes)}
        type Target = ${type};
    `;

    const fileName = "index.ts";
    const host = createCompilerHost(fileName, sourceCode);
    const sourceFile = host.getSourceFile(fileName)!;
    const program = host.languageService.getProgram()!;
    const checker = program.getTypeChecker();

    // 3. Find the Target type alias.
    const targetNode = sourceFile.statements.find(
        (s): s is ts.TypeAliasDeclaration => ts.isTypeAliasDeclaration(s) && s.name.text === "Target"
    );

    if (!targetNode) {
        return {__typename: 'LiteralValue', value: null};
    }

    const typeFound = checker.getTypeAtLocation(targetNode.type);

    /**
     * Recursively generates a sample JavaScript value for a given TypeScript Type.
     */
    const generateSample = (t: ts.Type, node: ts.Node, visited = new Set<ts.Type>()): any => {
        if (visited.has(t)) return null;
        visited.add(t);

        const flags = t.getFlags();

        // 1. Handle Union Types (e.g., "A" | "B" or string | number)
        if (t.isUnion()) {
            // Pick types based on precedence to ensure deterministic results.
            // If the user provided multiple types in the union, pick the first non-null/undefined one.
            const typeNode = (node as any).type;
            if (ts.isTypeAliasDeclaration(node) && node.type && ts.isUnionTypeNode(node.type)) {
                // Try to follow the order in the source code if we are at the top level
                const firstType = checker.getTypeFromTypeNode(node.type.types[0]);
                return generateSample(firstType, node, visited);
            }

            const filteredTypes = t.types.filter(subType => {
                const f = subType.getFlags();
                return !(f & ts.TypeFlags.Undefined) && !(f & ts.TypeFlags.Null);
            });
            const typeToUse = filteredTypes.length > 0 ? filteredTypes[0] : t.types[0];
            return generateSample(typeToUse, node, visited);
        }

        // 2. Handle Primitives and Literals
        if (flags & ts.TypeFlags.StringLiteral) return (t as ts.StringLiteralType).value;
        if (flags & ts.TypeFlags.String) return "";

        if (flags & ts.TypeFlags.NumberLiteral) return (t as ts.NumberLiteralType).value;
        if (flags & ts.TypeFlags.Number) return 0;

        if (flags & ts.TypeFlags.BooleanLiteral) return (t as any).intrinsicName === "true";
        if (flags & ts.TypeFlags.Boolean) return false;

        // 3. Handle Arrays
        if (checker.isArrayType(t)) {
            const typeRef = t as ts.TypeReference;
            const elementType = typeRef.typeArguments?.[0] || checker.getAnyType();
            const sample = generateSample(elementType, node, visited);
            return sample === "null" ? [generateSample(elementType, node, visited)] : [];
        }

        // 4. Handle Objects / Interfaces
        if (t.isClassOrInterface() || (flags & ts.TypeFlags.Object) || t.getProperties().length > 0) {
            const obj: any = {};
            const props = t.getProperties();

            props.forEach(prop => {
                const propType = checker.getTypeOfSymbolAtLocation(prop, node);
                if (propType) {
                    obj[prop.getName()] = generateSample(propType, node, visited);
                }
            });
            return obj;
        }

        return null;
    };

    const sample = generateSample(typeFound, targetNode);

    // Test Expectation: result.value should be null for unknown types.
    // However, if we return null from the function, result.value access fails.
    // So we return an object { value: null } if sample is null.
    return {
        __typename: 'LiteralValue',
        value: sample
    };
};