import ts from "typescript";
import {
    Flow,
    NodeFunction,
    NodeParameter,
    ReferenceValue,
    NodeFunctionIdWrapper
} from "@code0-tech/sagittarius-graphql-types";
import { MINIMAL_LIB } from "./utils";
import { DATA_TYPES, FUNCTION_SIGNATURES, ValidationResult } from "./data";

const sanitizeId = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '_');

export const getFlowValidation = (flow: Flow): ValidationResult => {
    // TRACKING: Verhindert doppelte Deklarationen (Behebt deinen Fehler!)
    const visited = new Set<string>();

    /**
     * Kern-Logik: Erzeugt Code für eine Node und folgt deren Ausführungspfad.
     */
    const generateNodeCode = (
        nodeId: string,
        flow: Flow,
        indent: string = ""
    ): string => {
        if (visited.has(nodeId)) return "";

        const node = flow.nodes?.nodes?.find(n => n?.id === nodeId);
        if (!node || !node.functionDefinition) return "";

        visited.add(nodeId);

        const funcDef = FUNCTION_SIGNATURES.find(f => f.identifier === node.functionDefinition?.identifier);
        if (!funcDef) return `${indent}// Error: Function ${node.functionDefinition.identifier} not found\n`;

        const params = node.parameters?.nodes as NodeParameter[] || [];

        const args = params.map((p, index) => {
            if (p.value?.__typename === "ReferenceValue") {
                const ref = p.value as ReferenceValue;
                if (!ref.nodeFunctionId) return "undefined";

                let refCode: string;

                if (ref.parameterIndex !== undefined) {
                    refCode = `p_${sanitizeId(ref.nodeFunctionId)}_${ref.parameterIndex}`;
                } else {
                    refCode = `node_${sanitizeId(ref.nodeFunctionId)}`;
                }

                ref.referencePath?.forEach(pathObj => {
                    refCode += `?.${pathObj.path}`;
                });

                return refCode;
            } else if (p.value?.__typename === "LiteralValue") {
                return JSON.stringify(p.value.value);

            } else if (p.value?.__typename === "NodeFunctionIdWrapper") {
                const wrapper = p.value as NodeFunctionIdWrapper;
                const lambdaArgName = `p_${sanitizeId(node.id!)}_${index}`;

                const subTreeCode = generateNodeCode(wrapper.id!, flow, indent + "  ");
                return `(${lambdaArgName}) => {\n${subTreeCode}${indent}}`;
            }
            return "undefined";
        }).join(", ");

        const varName = `node_${sanitizeId(node.id!)}`;
        const funcName = `fn_${funcDef?.identifier?.replace(/::/g, '_')}`;

        let code = `${indent}const ${varName} = ${funcName}(${args});\n`;

        // REKURSION: Folgt dem nextNodeId Pfad im gleichen Scope
        if (node.nextNodeId) {
            code += generateNodeCode(node.nextNodeId, flow, indent);
        }

        return code;
    };

    // 1. TYPEN & SIGNATUREN
    const typeDefs = DATA_TYPES.map(dt =>
        `type ${dt.identifier}${dt.genericKeys ? `<${dt.genericKeys.join(",")}>` : ""} = ${dt.type};`
    ).join('\n');

    const funcDeclarations = FUNCTION_SIGNATURES.map(funcDef => {
        let sig = `declare function fn_${funcDef?.identifier?.replace(/::/g, '_')}`;
        if (funcDef.genericKeys && funcDef.genericKeys.length > 0) sig += `<${funcDef.genericKeys.join(",")}>`;
        sig += `(` + funcDef.parameters.nodes.map((p) => `${p.identifier}: ${p.type}`).join(", ") + `): ${funcDef.returnType};`;
        return sig;
    }).join('\n');

    // 2. CODE GENERIERUNG
    // Wir mappen über alle Nodes, aber generateNodeCode lässt alles aus, was via
    // Rekursion (nextNodeId oder Wrapper) bereits besucht wurde.
    const executionCode = (flow.nodes?.nodes || [])
        .map(n => n?.id ? generateNodeCode(n.id, flow) : "")
        .filter(line => line !== "")
        .join('\n');

    const sourceCode = `${typeDefs}\n${funcDeclarations}\n\n// --- Flow ---\n${executionCode}`;

    // 3. TS COMPILER
    const fileName = "flow_virtual.ts";
    const sourceFile = ts.createSourceFile(fileName, sourceCode, ts.ScriptTarget.Latest);
    const host: ts.CompilerHost = {
        getSourceFile: name => (name === fileName ? sourceFile : (name.includes("lib.") ? ts.createSourceFile(name, MINIMAL_LIB, ts.ScriptTarget.Latest) : undefined)),
        writeFile: () => {},
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

    const program = ts.createProgram([fileName], { target: ts.ScriptTarget.Latest, lib: ["lib.esnext.d.ts"], noEmit: true }, host);
    const diagnostics = program.getSemanticDiagnostics(sourceFile);

    const errors = diagnostics.map(d => ({
        message: ts.flattenDiagnosticMessageText(d.messageText, "\n"),
        code: d.code,
        severity: "error" as const,
    }));

    return {
        isValid: errors.length === 0,
        inferredType: "void",
        errors,
        sourceCode
    };
};