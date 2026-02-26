import ts from "typescript";

export function getLanguageServiceSuggestions(typeString: string): string[] {
    if (!typeString) return [];

    // Wir bauen ein virtuelles File. Das ist stabil und braucht keine echten Libs.
    const sourceCode = `type T = ${typeString}; const val: T = {} as any;`;
    const fileName = "virtual.ts";
    const sourceFile = ts.createSourceFile(fileName, sourceCode, ts.ScriptTarget.Latest);

    // Ein minimaler Compiler-Host, der nur unser virtuelles File kennt
    const host: ts.CompilerHost = {
        getSourceFile: (name) => name === fileName ? sourceFile : undefined,
        writeFile: () => {},
        getDefaultLibFileName: () => "lib.d.ts",
        useCaseSensitiveFileNames: () => true,
        getCanonicalFileName: (f) => f,
        getCurrentDirectory: () => "/",
        getNewLine: () => "\n",
        fileExists: (f) => f === fileName,
        readFile: (f) => f === fileName ? sourceCode : undefined,
        directoryExists: () => true,
        getDirectories: () => [],
    };

    const program = ts.createProgram([fileName], { target: ts.ScriptTarget.Latest, noLib: true }, host);
    const checker = program.getTypeChecker();

    // Den Typ T finden
    const typeAlias = sourceFile.statements.find(ts.isTypeAliasDeclaration);
    if (!typeAlias) return [];

    const type = checker.getTypeAtLocation(typeAlias);

    // Die Magie: Wir extrahieren alle möglichen Werte aus dem Typ-Baum
    function extractValues(t: ts.Type): string[] {
        // Falls Union: "A" | "B" | true
        if (t.isUnion()) {
            return t.types.flatMap(extractValues);
        }

        // String Literals: "GET"
        if (t.isStringLiteral()) return [t.value];

        // Number Literals: 1
        if (t.isNumberLiteral()) return [t.value.toString()];

        // Booleans (true/false)
        if ((t as any).intrinsicName === "true") return ["true"];
        if ((t as any).intrinsicName === "false") return ["false"];

        // Template Literals: `top-${"left" | "right"}`
        // Der Checker hat diese bereits fertig aufgelöst in t.types, wenn es eine Union ist

        return [];
    }

    // Wir nutzen Set für Einzigartigkeit (z.B. bei boolean)
    return [...new Set(extractValues(type))];
}