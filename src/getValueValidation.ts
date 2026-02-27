import ts from "typescript";
import {LiteralValue} from "@code0-tech/sagittarius-graphql-types";
import {MINIMAL_LIB} from "./utils";
import {DATA_TYPES} from "./data";

export interface ValueValidationResult {
    isValid: boolean;
    error?: string;
}

export const getValueValidation = (targetType: string, literal: LiteralValue): ValueValidationResult => {
    const valAsCode = JSON.stringify(literal.value);

    // 1. Alle Generics aus allen DATA_TYPES sammeln (z.B. ["T", "R", "K", "V"])
    const allGenerics = new Set<string>();
    DATA_TYPES.forEach(dt => {
        dt.genericKeys?.forEach(key => allGenerics.add(key));
    });

    // 2. Diese Generics als 'any' deklarieren
    const genericDeclarations = Array.from(allGenerics)
        .map(g => `type ${g} = any;`)
        .join("\n");

    // 3. Die eigentlichen Typ-Aliase (z.B. type LIST<T> = T[])
    const typeAliasDeclarations = DATA_TYPES.map(dt =>
        `type ${dt.identifier}${dt.genericKeys ? `<${dt.genericKeys.join(",")}>` : ""} = ${dt.type};`
    ).join("\n");

    const sourceCode = `
${genericDeclarations}
${typeAliasDeclarations}

const testValue: ${targetType} = ${valAsCode};
    `;

    const fileName = "value_check.ts";
    const sourceFile = ts.createSourceFile(fileName, sourceCode, ts.ScriptTarget.Latest);

    const host: ts.CompilerHost = {
        getSourceFile: name => (name === fileName ? sourceFile : (name.includes("lib.") ? ts.createSourceFile(name, MINIMAL_LIB, ts.ScriptTarget.Latest) : undefined)),
        writeFile: () => {
        },
        getDefaultLibFileName: () => "lib.d.ts",
        useCaseSensitiveFileNames: () => true,
        getCanonicalFileName: f => f,
        getCurrentDirectory: () => "/",
        getNewLine: () => "\n",
        fileExists: f => f === fileName || f.includes("lib."),
        readFile: f => (f === fileName ? sourceCode : (f.includes("lib.") ? MINIMAL_LIB : undefined)),
        directoryExists: () => true,
        getDirectories: () => [],
    };

    const program = ts.createProgram([fileName], {
        target: ts.ScriptTarget.Latest,
        lib: ["lib.esnext.d.ts"],
        noEmit: true,
        strictNullChecks: true
    }, host);

    const diagnostics = program.getSemanticDiagnostics(sourceFile);

    if (diagnostics.length > 0) {
        return {
            isValid: false,
            error: ts.flattenDiagnosticMessageText(diagnostics[0].messageText, "\n")
        };
    }

    return {isValid: true};
};