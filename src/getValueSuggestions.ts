import ts from "typescript";
import {LiteralValue} from "@code0-tech/sagittarius-graphql-types";
import {createCompilerHost, DEFAULT_COMPILER_OPTIONS} from "./utils";

/**
 * Extracts possible literal values from a type string to provide suggestions.
 */
export const getValueSuggestions = (typeString: string): LiteralValue[] => {
    if (!typeString) return [];

    const sourceCode = `type T = ${typeString}; const val: T = {} as any;`;
    const fileName = "suggestions_virtual.ts";

    // We recreate the SourceFile here but use the specialized compiler host
    // to ensure the checker is matched with the host's view of the file.
    const sourceFile = ts.createSourceFile(fileName, sourceCode, ts.ScriptTarget.Latest);

    const host = createCompilerHost(fileName, sourceCode, sourceFile);

    const program = ts.createProgram([fileName], {...DEFAULT_COMPILER_OPTIONS, noLib: true}, host);
    const checker = program.getTypeChecker();

    const typeAlias = sourceFile.statements.find(ts.isTypeAliasDeclaration);
    if (!typeAlias) return [];

    const type = checker.getTypeAtLocation(typeAlias);

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
    const uniqueValues = Array.from(new Set(extractValues(type)));

    return uniqueValues.map(value => ({
        __typename: "LiteralValue",
        value
    }));
};
