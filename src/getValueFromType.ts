import ts from "typescript";
import { LiteralValue } from "@code0-tech/sagittarius-graphql-types";
import { DATA_TYPES } from "./data";
import {MINIMAL_LIB} from "./utils";

export const getValueFromType = (targetType: string): LiteralValue => {
    const genericDeclarations = DATA_TYPES.flatMap(dt => dt.genericKeys || [])
        .map(g => `type ${g} = any;`).join("\n");
    const typeAliasDeclarations = DATA_TYPES.map(dt =>
        `type ${dt.identifier}${dt.genericKeys ? `<${dt.genericKeys.join(",")}>` : ""} = ${dt.type};`
    ).join("\n");

    const sourceCode = `
        ${genericDeclarations}
        ${typeAliasDeclarations}
        type Target = ${targetType};
    `;

    const fileName = "temp.ts";
    const sourceFile = ts.createSourceFile(fileName, sourceCode, ts.ScriptTarget.Latest, true);

    // Wir brauchen einen Host, der dem Program sagt: "Hier ist der Inhalt der Datei"
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

    const checker = program.getTypeChecker();

    // Finde die Target-Deklaration
    const targetNode = sourceFile.statements.find(
        (s): s is ts.TypeAliasDeclaration => ts.isTypeAliasDeclaration(s) && s.name.text === "Target"
    );

    if (!targetNode) {
        return { __typename: 'LiteralValue', value: null };
    }

    const type = checker.getTypeAtLocation(targetNode.type);

    const generateSample = (t: ts.Type, node: ts.Node): any => {
        const flags = t.getFlags();

        // 1. Unions (z.B. "GET" | "POST" oder number | string)
        if (t.isUnion()) {
            // Falls der Typ eine Union ist, schauen wir in den Quelltext der Node,
            // um die ursprüngliche Reihenfolge der Definition zu finden.
            const typeNode = (node as any).type;
            if (typeNode && ts.isUnionTypeNode(typeNode)) {
                // Wir nehmen den ersten Typ aus der Union-Node des Quellcodes
                const firstTypeNode = typeNode.types[0];
                const firstType = checker.getTypeFromTypeNode(firstTypeNode);
                return generateSample(firstType, node);
            }

            // Fallback: Falls wir nicht über die Node parsen können,
            // filtern wir wie gehabt null/undefined raus.
            const filteredTypes = t.types.filter(subType => {
                const f = subType.getFlags();
                return !(f & ts.TypeFlags.Undefined) && !(f & ts.TypeFlags.Null);
            });
            const typeToUse = filteredTypes.length > 0 ? filteredTypes[0] : t.types[0];
            return generateSample(typeToUse, node);
        }

        // 2. Strings
        if (flags & ts.TypeFlags.StringLiteral) return (t as ts.StringLiteralType).value;
        if (flags & ts.TypeFlags.String) return "sample";

        // 3. Numbers
        if (flags & ts.TypeFlags.NumberLiteral) return (t as ts.NumberLiteralType).value;
        if (flags & ts.TypeFlags.Number) return 1;

        // 4. Booleans
        // In TS sind booleans oft Unions, aber falls sie als intrinsic durchgehen:
        if (flags & ts.TypeFlags.BooleanLiteral) return (t as any).intrinsicName === "true";
        if (flags & ts.TypeFlags.Boolean) return true;

        // 5. Arrays
        if (checker.isArrayType(t)) {
            const typeRef = t as ts.TypeReference;
            const elementType = typeRef.typeArguments?.[0] || checker.getAnyType();
            return [generateSample(elementType, node)];
        }

        // 6. Objekte / Interfaces
        if (t.isClassOrInterface() || (flags & ts.TypeFlags.Object) || t.getProperties().length > 0) {
            const obj: any = {};
            const props = t.getProperties();

            props.forEach(prop => {
                const propType = checker.getTypeOfSymbolAtLocation(prop, node);
                if (propType) {
                    obj[prop.getName()] = generateSample(propType, node);
                }
            });
            return obj;
        }

        return null;
    };

    return {
        __typename: 'LiteralValue',
        value: generateSample(type, targetNode)
    };
};