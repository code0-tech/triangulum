import ts from "typescript";
import {createCompilerHost, getSharedTypeDeclarations} from "../utils";
import {DataType, LiteralValue} from "@code0-tech/sagittarius-graphql-types";

/**
 * Uses the TypeScript compiler to generate a precise type string from any runtime value.
 */
export const getTypeFromValue = (
    value?: LiteralValue | null,
    dataTypes?: DataType[]
): string => {
    // 1. Serialize value to a JSON string for embedding in source code.
    const literal = JSON.stringify(value?.value);

    if (!literal) return "any"

    // 2. Wrap value in virtual source code.
    const sourceCode = `
        ${getSharedTypeDeclarations(dataTypes, "unknown")}
        const tempValue = ${literal ?? "any"};
    `;
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
            const allAliases = checker.getSymbolsInScope(node, ts.SymbolFlags.TypeAlias);

            const resolve = (t: ts.Type): string => {
                if (t.isUnion()) {
                    const parts = t.types.map(resolve);
                    return Array.from(new Set(parts)).sort().join(" | ");
                }

                // 2. Array-Handling
                if (checker.isArrayType(t)) {
                    const typeArgs = (t as any).typeArguments || [];
                    const inner = typeArgs.length > 0 ? resolve(typeArgs[0]) : "any";
                    return typeArgs[0]?.isUnion() ? `(${inner})[]` : `${inner}[]`;
                }

                if ((t.getFlags() & ts.TypeFlags.Object) || t.isClassOrInterface()) {
                    const props = checker.getPropertiesOfType(t);
                    if (props.length > 0) {
                        const fields = props.map(p => {
                            const pType = checker.getTypeOfSymbolAtLocation(p, node);
                            return `${p.getName()}: ${resolve(pType)}`;
                        });
                        return `{ ${fields.join(", ")} }`;
                    }
                }

                // 4. Alias-Suche für Blätter (Zahlen, Strings, etc.)
                const matches = allAliases.filter(s =>
                    checker.isTypeAssignableTo(t, checker.getDeclaredTypeOfSymbol(s))
                );

                if (matches.length > 0) {
                    const bestMatch = matches.sort((a, b) => {
                        const typeA = checker.getDeclaredTypeOfSymbol(a);
                        const typeB = checker.getDeclaredTypeOfSymbol(b);

                        const aSubB = checker.isTypeAssignableTo(typeA, typeB);
                        const bSubA = checker.isTypeAssignableTo(typeB, typeA);

                        if (aSubB && !bSubA) return -1;
                        if (bSubA && !aSubB) return 1;

                        return a.getName().length - b.getName().length || a.getName().localeCompare(b.getName());
                    })[0];

                    return bestMatch.getName();
                }

                return checker.typeToString(t, node);
            };

            inferredType = resolve(type);
        }
        ts.forEachChild(node, visit);
    };

    visit(sourceFile);

    return inferredType;
};

