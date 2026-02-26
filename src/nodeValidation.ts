import ts from "typescript";
import {Flow, NodeFunction, NodeParameter} from "@code0-tech/sagittarius-graphql-types";
import {getParameterCode} from "./utils";

export interface ValidationResult {
    isValid: boolean;
    inferredType: string;
    errors: Array<{
        message: string;
        code: number;
        severity: "error" | "warning";
    }>;
    sourceCode?: string;
}

const DATA_TYPES = [
    {identifier: "LIST", signature: "T[]", genericKeys: ["T"]},
    {identifier: "NUMBER", signature: "number"},
    {identifier: "STRING", signature: "string"},
    {identifier: "CONSUMER", signature: "(item:R) => void", genericKeys: ["R"]},
    {identifier: "PREDICATE", signature: "(item:R) => T", genericKeys: ["R", "T"]},
];

const FUNCTION_SIGNATURES = [
    {identifier: "std::list::at", signature: "<R>(list: LIST<R>, index: NUMBER): R"},
    {identifier: "std::math::add", signature: "(a: NUMBER, b: NUMBER): NUMBER"},
    {identifier: "std::control::for_each", signature: "<R>(a: LIST<R>, b: CONSUMER<R>): void"},
    {identifier: "std::control::find", signature: "<R>(a: LIST<R>, b: PREDICATE<R, boolean>): R"},
    {identifier: "std::control::return", signature: "<R>(a: R): R"},
];

export const getNodeValidation = (flow: Flow, node: NodeFunction): ValidationResult => {
    const funcDef = FUNCTION_SIGNATURES.find(f => f.identifier === node.functionDefinition?.id);
    if (!funcDef) {
        return {
            isValid: false,
            inferredType: "any",
            errors: [{message: `Function ${node.id} not found`, code: 404, severity: "error"}],
        };
    }

    const params = node.parameters?.nodes as NodeParameter[];
    const paramCodes = params.map(param => getParameterCode(param, flow, getNodeValidation));
    const funcCallArgs = paramCodes.join(", ");

    const sourceCode = `
        ${DATA_TYPES.map(dt => `type ${dt.identifier}${dt.genericKeys ? `<${dt.genericKeys.join(",")}>` : ""} = ${dt.signature};`).join('\n')}
        declare function testFunc${funcDef.signature};
        const result = testFunc(${funcCallArgs});
    `;

    const fileName = "virtual.ts";
    const sourceFile = ts.createSourceFile(fileName, sourceCode, ts.ScriptTarget.Latest);

    const MINIMAL_LIB = `
        interface Array<T> { 
            [n: number]: T; 
            length: number; 
        }
        interface String { readonly length: number; }
        interface Number { }
        interface Boolean { }
        interface Object { }
        interface Function { }
        interface CallableFunction extends Function {}
        interface NewableFunction extends Function {}
        interface IArguments { }
        interface RegExp { }
    `;

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

    const program = ts.createProgram([fileName], {
        target: ts.ScriptTarget.Latest,
        lib: ["lib.esnext.d.ts"],
    }, host);
    const checker = program.getTypeChecker();
    const diagnostics = program.getSemanticDiagnostics(sourceFile);

    let inferredType = "any";

    function findResultType(node: ts.Node) {
        if (ts.isVariableDeclaration(node) && node.name.getText() === "result") {
            const type = checker.getTypeAtLocation(node);
            // NoTruncation verhindert, dass TS bei komplexen Typen einfach "any" sagt
            inferredType = checker.typeToString(
                type,
                node,
                ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseFullyQualifiedType
            );
        }
        ts.forEachChild(node, findResultType);
    }

    findResultType(sourceFile);

    const errors = diagnostics.map(d => {
        const message = ts.flattenDiagnosticMessageText(d.messageText, "\n");
        const isGeneric = /\b([TRKV])\b/.test(message);
        return {
            message,
            code: d.code,
            severity: (isGeneric ? "warning" : "error") as "error" | "warning",
        };
    });

    return {
        isValid: !errors.some(e => e.severity === "error"),
        inferredType,
        errors,
        sourceCode
    };
};
