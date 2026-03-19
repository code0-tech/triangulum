import ts from "typescript";
import {DataType, LiteralValue} from "@code0-tech/sagittarius-graphql-types";
import {createCompilerHost, getSharedTypeDeclarations} from "../utils";

/**
 * Extracts possible literal values from a type string to provide suggestions.
 */
export const getValueSuggestions = (
    type?: string,
    dataTypes?: DataType[]
): LiteralValue[] => {
    if (!type) return [];

    const sourceCode = `
        ${getSharedTypeDeclarations(dataTypes)}
        type VALUE = ${type}; const val: VALUE = {} as any;
    `;

    const fileName = "index.ts";
    const host = createCompilerHost(fileName, sourceCode);
    const sourceFile = host.getSourceFile(fileName)!;
    const program = host.languageService.getProgram()!;
    const checker = program.getTypeChecker();

    // Find the VALUE type alias (not the first one, but the one we defined)
    const typeAlias = sourceFile.statements.find(
        node => ts.isTypeAliasDeclaration(node) && node.name.text === 'VALUE'
    );
    if (!typeAlias || !ts.isTypeAliasDeclaration(typeAlias)) return [];

    const typeFound = checker.getTypeAtLocation(typeAlias);

    /**
     * Recursively extracts literal values from a TypeScript type.
     */
    const extractValues = (t: ts.Type): string[] => {
        if (t.isUnion()) {
            return t.types.flatMap(extractValues);
        }

        if (t.isStringLiteral()) return [t.value];
        if (t.isNumberLiteral()) return [t.value.toString()];

        if ((t as any).intrinsicName === "true") return ["true"];
        if ((t as any).intrinsicName === "false") return ["false"];

        return [];
    };

    // Use a Set to ensure uniqueness.
    const uniqueValues = Array.from(new Set(extractValues(typeFound)));

    return uniqueValues.map(value => ({
        __typename: "LiteralValue",
        value
    }));
};
