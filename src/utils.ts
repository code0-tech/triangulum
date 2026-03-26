// Utility functions for node validation
import {
    DataType,
    Flow, FunctionDefinition,
    NodeFunction,
    NodeFunctionIdWrapper,
    NodeParameter,
    ReferencePath,
    ReferenceValue
} from "@code0-tech/sagittarius-graphql-types";
import ts from "typescript";
import {createSystem, createVirtualTypeScriptEnvironment, VirtualTypeScriptEnvironment} from "@typescript/vfs"
import {getTypesFromNode} from "./extraction/getTypesFromNode";
import {DataTypeVariant, getTypeVariant} from "./extraction/getTypeVariant";

/**
 * Result of a node or flow validation.
 */
export interface ValidationResult {
    isValid: boolean;
    returnType: string;
    diagnostics: Array<{
        message: string
        code: number
        severity: "error" | "warning"
        nodeId?: NodeFunction["id"]
        parameterIndex?: number
    }>;
}

/**
 * Minimal TypeScript library definitions for the virtual compiler environment.
 */
export const MINIMAL_LIB = `
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
    type Record<K extends keyof any, T> = { [P in K]: T; };
    type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
`;

/**
 * Common configuration for the TypeScript compiler host across different validation/inference tasks.
 */
export function createCompilerHost(
    fileName: string,
    sourceCode: string
): VirtualTypeScriptEnvironment {

    const fsMap = new Map<string, string>()
    fsMap.set(fileName, sourceCode)
    fsMap.set("lib.codezero.d.ts", MINIMAL_LIB)

    const system = createSystem(fsMap)
    return createVirtualTypeScriptEnvironment(system, [fileName, "lib.codezero.d.ts"], ts, DEFAULT_COMPILER_OPTIONS)
}

/**
 * Common TypeScript compiler options used for validation and type inference.
 */
export const DEFAULT_COMPILER_OPTIONS: ts.CompilerOptions = {
    target: ts.ScriptTarget.Latest,
    lib: ["lib.codezero.d.ts"],
    noEmit: true,
    strictNullChecks: true,
};

/**
 * Extracts and returns common type and generic declarations from DATA_TYPES.
 */
export function getSharedTypeDeclarations(dataTypes?: DataType[]): string {
    const genericDeclarations = Array.from(new Set(dataTypes?.flatMap(dt => dt.genericKeys || [])))
        .map(g => `type ${g} = unknown;`)
        .join("\n");

    const typeAliasDeclarations = dataTypes?.map(dt =>
        `type ${dt.identifier}${(dt.genericKeys?.length ?? 0) > 0 ? `<${dt.genericKeys?.join(",")}>` : ""} = ${dt.type};`
    ).join("\n");

    return `${genericDeclarations}\n${typeAliasDeclarations}`;
}

/**
 * Determines the type along a reference path for objects.
 * @param value The base value to traverse.
 * @param referencePath The path of properties to follow.
 * @returns The typeof the final value or 'unknown' if path is broken.
 */
export function getTypeFromReferencePath(value: any, referencePath: ReferencePath[]): string {
    let current = value;
    for (const ref of referencePath) {
        if (current == null) return 'unknown';
        if (typeof ref.path === 'string') {
            current = current[ref.path];
        }
    }
    return typeof current;
}

/**
 * Helper to find a node by ID within the flow structure.
 */
function findNodeById(flow?: Flow, nodeId?: string): NodeFunction | undefined {
    const nodes = flow?.nodes;
    if (!nodes) return undefined;

    if (Array.isArray(nodes)) {
        return nodes.find((n: any) => n.id === nodeId);
    }

    return nodes.nodes?.find((n: any) => n.id === nodeId)!;
}

/**
 * Sanitizes an ID for use as a TypeScript variable name.
 */
export const sanitizeId = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '_');

/**
 * Generates TypeScript source code for a flow, suitable for validation and type inference.
 */
export function generateFlowSourceCode(
    flow?: Flow,
    functions?: FunctionDefinition[],
    dataTypes?: DataType[],
    isForInference: boolean = false
): string {
    const nodes = flow?.nodes?.nodes || [];
    const funcMap = new Map(functions?.map(f => [f.identifier, f]));
    const visited = new Set<string>();

    const generateNodeCall = (nodeId: string, parentNodeId?: string, parentParamIndex?: number): string => {
        const node = nodes.find(n => n?.id === nodeId);
        if (!node || !node.functionDefinition?.identifier) return "undefined";

        const params = (node.parameters?.nodes as NodeParameter[]) || [];
        const args = params.map((p, paramIdx) => {
            const val = p.value;
            if (!val) return isForInference ? `/* @pos ${nodeId} ${paramIdx} */ {}` :  `/* @pos ${nodeId} ${paramIdx} */ undefined`;
            if (val.__typename === "ReferenceValue") {
                const ref = val as ReferenceValue;
                if (!ref.nodeFunctionId) return `/* @pos ${nodeId} ${paramIdx} */ undefined`;
                let refCode = ref.inputIndex !== undefined
                    ? `p_${sanitizeId(ref.nodeFunctionId)}_${ref.parameterIndex}[${ref.inputIndex}]`
                    : `node_${sanitizeId(ref.nodeFunctionId)}`;
                ref.referencePath?.forEach(pathObj => { refCode += `?.${pathObj.path}`; });
                return `/* @pos ${nodeId} ${paramIdx} */ ${refCode}`;
            }
            if (val.__typename === "LiteralValue") return `/* @pos ${nodeId} ${paramIdx} */ ${JSON.stringify(val.value)}`;
            if (val.__typename === "NodeFunctionIdWrapper") {
                const wrapper = val as NodeFunctionIdWrapper;
                return generateNodeCall(wrapper.id!, nodeId, paramIdx);
            }
            return isForInference ? `/* @pos ${nodeId} ${paramIdx} */ ({} as any)` :  `/* @pos ${nodeId} ${paramIdx} */ undefined`;
        }).join(", ");

        const funcName = `fn_${node.functionDefinition.identifier.replace(/::/g, '_')}`;
        const call = `${funcName}(${args})`;
        // Add position comment only for nested calls (when called from within an argument)
        if (parentNodeId !== undefined && parentParamIndex !== undefined) {
            return `${call}`;
        }
        return call;
    };

    const generateNodeCode = (nodeId: string, indent: string = ""): string => {
        if (visited.has(nodeId)) return "";
        const node = nodes.find(n => n?.id === nodeId);
        if (!node || !node.functionDefinition) return "";
        visited.add(nodeId);

        const funcDef = funcMap.get(node.functionDefinition.identifier);
        if (!funcDef) return `${indent}// Error: Function ${node.functionDefinition.identifier} not found\n`;

        // Only use getTypesFromNode if we are NOT already doing inference to avoid infinite recursion
        let nodeTypes: any = { parameters: [] };
        if (!isForInference) {
            nodeTypes = getTypesFromNode(node, functions, dataTypes);
        }

        const params = (node.parameters?.nodes as NodeParameter[]) || [];
        const args = params.map((p, index) => {
            const val = p.value;
            if (!val) return isForInference ? `/* @pos ${nodeId} ${index} */ {}` :  `/* @pos ${nodeId} ${index} */ undefined`;
            if (val.__typename === "ReferenceValue") {
                const ref = val as ReferenceValue;
                if (!ref.nodeFunctionId) return `/* @pos ${nodeId} ${index} */ undefined`;
                let refCode = ref.inputIndex !== undefined
                    ? `p_${sanitizeId(ref.nodeFunctionId)}_${ref.parameterIndex}[${ref.inputIndex}]`
                    : `node_${sanitizeId(ref.nodeFunctionId)}`;
                ref.referencePath?.forEach(pathObj => { refCode += `?.${pathObj.path}`; });
                return `/* @pos ${nodeId} ${index} */ ${refCode}`;
            }
            if (val.__typename === "LiteralValue") return `/* @pos ${nodeId} ${index} */ ${JSON.stringify(val.value)}`;
            if (val.__typename === "NodeFunctionIdWrapper") {
                const wrapper = val as NodeFunctionIdWrapper;

                if (!isForInference) {
                    const expectedType = nodeTypes.parameters[index];
                    const isFunctionType = expectedType ? getTypeVariant(expectedType, dataTypes) === DataTypeVariant.NODE : false;

                    if (isFunctionType) {
                        const lambdaArgName = `p_${sanitizeId(nodeId)}_${index}`;
                        const subTreeCode = generateNodeCode(wrapper.id!, indent + "    ");
                        return `/* @pos ${nodeId} ${index} */ (...${lambdaArgName}) => {\n${subTreeCode}${indent}}`;
                    } else {
                        const nestedCall = generateNodeCall(wrapper.id!, nodeId, index);
                        return `/* @pos ${nodeId} ${index} */ ${nestedCall}`;
                    }
                } else {
                    // During inference, we just need something valid.
                    // Defaulting to a lambda is safer for type inference of the parent node's parameters.
                    const lambdaArgName = `p_${sanitizeId(nodeId)}_${index}`;
                    const subTreeCode = generateNodeCode(wrapper.id!, indent + "    ");
                    return `/* @pos ${nodeId} ${index} */ (...${lambdaArgName}) => {\n${subTreeCode}${indent}}`;
                }
            }
            return isForInference ? `/* @pos ${nodeId} ${index} */ {}` :  `/* @pos ${nodeId} ${index} */ undefined`;
        }).join(", ");

        const varName = `node_${sanitizeId(node.id!)}`;
        const funcName = `fn_${node?.functionDefinition?.identifier?.replace(/::/g, '_')}`;
        const needsAnyCast = args.includes("undefined");
        const isReturnNode = node.functionDefinition.identifier === "std::control::return";
        let code = `${indent}${isReturnNode ? "return " : `const ${varName} = `}${funcName}(${args})${needsAnyCast ? "" : ""} ;\n`;
        if (node.nextNodeId) code += generateNodeCode(node.nextNodeId, indent);
        return code;
    };

    const typeDefs = getSharedTypeDeclarations(dataTypes);
    const funcDeclarations = functions?.map(f => `declare function fn_${f.identifier?.replace(/::/g, '_')}${f.signature}`).join('\n');

    const nextNodeIds = new Set(nodes.map(n => n?.nextNodeId).filter(id => !!id));
    const subTreeIds = new Set<string>();
    nodes.forEach(n => n?.parameters?.nodes?.forEach((p: any) => {
        if (p?.value?.__typename === "NodeFunctionIdWrapper" && p.value.id) subTreeIds.add(p.value.id);
    }));

    const executionCode = nodes
        .filter(n => n?.id && !nextNodeIds.has(n.id) && !subTreeIds.has(n.id))
        .map(n => generateNodeCode(n!.id!))
        .join('\n');

    return `${typeDefs}\n${funcDeclarations}\n\n// --- Flow ---\n${executionCode}`;
}

export interface InferredTypes {
    nodes: Map<string, string>;
    parameters: Map<string, string[]>;
}

/**
 * Infers types for all nodes and parameters in a flow using the TypeScript compiler.
 */
export function getInferredTypesFromFlow(
    flow?: Flow,
    functions?: FunctionDefinition[],
    dataTypes?: DataType[]
): InferredTypes {
    const sourceCode = generateFlowSourceCode(flow, functions, dataTypes, true);

    const fileName = "index.ts";
    const host = createCompilerHost(fileName, sourceCode);
    const sourceFile = host.getSourceFile(fileName)!;
    const program = host.languageService.getProgram()!;
    const checker = program.getTypeChecker();

    const nodeTypes = new Map<string, string>();
    const parameterTypes = new Map<string, string[]>();
    const nodeIdToNode = new Map<string, NodeFunction>();

    // Build a map of nodes for later lookup
    const nodes = flow?.nodes?.nodes || [];
    nodes.forEach(node => {
        if (node?.id) {
            nodeIdToNode.set(sanitizeId(node.id), node);
        }
    });

    const visit = (n: ts.Node) => {
        if (ts.isVariableDeclaration(n) && n.name.getText().startsWith("node_")) {
            const nodeId = n.name.getText().replace("node_", "");
            const type = checker.getTypeAtLocation(n);
            nodeTypes.set(nodeId, checker.typeToString(type, n, ts.TypeFormatFlags.NoTruncation));

            if (n.initializer && ts.isCallExpression(n.initializer)) {
                const sig = checker.getResolvedSignature(n.initializer);
                if (sig) {
                    // getResolvedSignature returns the signature with generics resolved based on actual arguments
                    const resolvedParams = sig.getParameters().map((p) => {
                        const t = checker.getTypeOfSymbolAtLocation(p, n.initializer!);
                        return checker.typeToString(t, n.initializer, ts.TypeFormatFlags.NoTruncation);
                    });
                    parameterTypes.set(nodeId, resolvedParams);
                }
            }
        }
        if (ts.isReturnStatement(n) && n.expression && ts.isCallExpression(n.expression)) {
            // Special handling for std::control::return which doesn't have a node_ variable
            const call = n.expression;
            const sig = checker.getResolvedSignature(call);
            if (sig) {
                // We need to find the node ID from the context or a comment if possible,
                // but since generateFlowSourceCode doesn't currently label them easily for return,
                // we might need a small adjustment if we need types for return nodes specifically.
            }
        }
        ts.forEachChild(n, visit);
    };
    visit(sourceFile);

    return { nodes: nodeTypes, parameters: parameterTypes };
}

