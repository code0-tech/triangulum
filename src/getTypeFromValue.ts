import ts from "typescript";
import {MINIMAL_LIB} from "./utils";

/**
 * Nutzt den TS-Compiler, um aus einer beliebigen Laufzeit-Value
 * einen präzisen Typ-String zu generieren.
 */
export const getTypeFromValue = (value: any): string => {
    // 1. Value in einen JSON-String umwandeln, damit wir sie in den Source-Code einbetten können
    // Wir nutzen JSON.stringify, um ein valides JS-Literal zu erhalten
    const literal = JSON.stringify(value);

    // 2. Virtuellen Source Code erstellen
    // Wir weisen die Value einer Variable zu und lassen TS den Typ inferieren
    const sourceCode = `const tempValue = ${literal};`;
    const fileName = "temp.ts";
    const sourceFile = ts.createSourceFile(fileName, sourceCode, ts.ScriptTarget.Latest);

    // 3. Minimales Programm-Setup
    const host: ts.CompilerHost = {
        getSourceFile: name => {
            if (name === fileName) return sourceFile;
            if (name.includes("lib.")) {
                return ts.createSourceFile(name, MINIMAL_LIB, ts.ScriptTarget.Latest);
            }
            return undefined;
        },
        writeFile: () => {
        },
        getDefaultLibFileName: () => "lib.d.ts",
        useCaseSensitiveFileNames: () => true,
        getCanonicalFileName: f => f,
        getCurrentDirectory: () => "/",
        getNewLine: () => "\n",
        fileExists: f => f === fileName || f.includes("lib."),
        readFile: f => f === fileName ? sourceCode : (f.includes("lib.") ? MINIMAL_LIB : undefined),
        directoryExists: () => true,
        getDirectories: () => [],
    };

    const program = ts.createProgram([fileName], { target: ts.ScriptTarget.Latest }, host);
    const checker = program.getTypeChecker();

    // 4. Den Typ der Variable 'tempValue' vom Compiler abfragen
    let inferredType = "any";

    function visit(node: ts.Node) {
        if (ts.isVariableDeclaration(node) && node.name.getText() === "tempValue") {
            const type = checker.getTypeAtLocation(node);

            // Hier kommt die TS-Power: Wir lassen uns den Typ als String geben.
            // NoTruncation sorgt dafür, dass lange Objekte nicht mit "..." abgekürzt werden.
            inferredType = checker.typeToString(
                type,
                node,
                ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseFullyQualifiedType
            );
        }
        ts.forEachChild(node, visit);
    }

    visit(sourceFile);

    // 5. Cleanup für dein Produkt:
    // Wenn TS "123" (Literal) sagt, aber du lieber "number" hättest,
    // könnte man das hier noch mappen. Aber für Suggestions sind Literale meist besser.
    return inferredType;
};