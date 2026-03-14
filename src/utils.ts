// Utility functions for node validation
import {
    DataType,
    Flow,
    NodeFunction,
    NodeFunctionIdWrapper,
    NodeParameter,
    ReferencePath,
    ReferenceValue
} from "@code0-tech/sagittarius-graphql-types";
import ts from "typescript";
import {createSystem, createVirtualTypeScriptEnvironment, VirtualTypeScriptEnvironment} from "@typescript/vfs"

/**
 * Result of a node or flow validation.
 */
export interface ValidationResult {
    isValid: boolean;
    inferredType: string;
    errors: Array<{
        message: string;
        code: number;
        severity: "error" | "warning";
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
export function getSharedTypeDeclarations(dataTypes: DataType[]): string {
    const genericDeclarations = Array.from(new Set(dataTypes.flatMap(dt => dt.genericKeys || [])))
        .map(g => `type ${g} = any;`)
        .join("\n");

    const typeAliasDeclarations = dataTypes.map(dt =>
        `type ${dt.identifier}${dt.genericKeys ? `<${dt.genericKeys.join(",")}>` : ""} = ${dt.type};`
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
function findNodeById(flow: Flow, nodeId: string): NodeFunction | undefined {
    const nodes = flow.nodes;
    if (!nodes) return undefined;

    if (Array.isArray(nodes)) {
        return nodes.find((n: any) => n.id === nodeId);
    }

    return nodes.nodes?.find((n: any) => n.id === nodeId)!;
}

/**
 * Extracts and returns the TypeScript code representation for a NodeParameter.
 */
export function getParameterCode(
    param: NodeParameter,
    flow: Flow,
    getNodeValidation: (flow: Flow, node: NodeFunction) => ValidationResult
): string {
    const value = param?.value;
    if (!value) return 'undefined';

    if (value.__typename === "ReferenceValue") {
        const refValue = value as ReferenceValue;
        const refNode = findNodeById(flow, refValue.nodeFunctionId!);

        if (!refNode) return 'undefined';

        let refType = getNodeValidation(flow, refNode).inferredType;

        if (refValue.referencePath && refValue.referencePath.length > 0) {
            let refVal: any = undefined;
            const nodes = refNode.parameters?.nodes;
            if (nodes && nodes.length > 0) {
                const firstParam = nodes[0];
                if (firstParam?.value?.__typename === "LiteralValue") {
                    refVal = firstParam.value.value;
                }
            }
            refType = getTypeFromReferencePath(refVal, refValue.referencePath);
        }
        return `({} as ${refType})`;
    }

    if (value.__typename === "NodeFunctionIdWrapper") {
        const wrapperId = (value as NodeFunctionIdWrapper).id;
        const refNode = findNodeById(flow, wrapperId!);

        if (!refNode) return '(() => undefined)';

        const findReturnNode = (node: NodeFunction): NodeFunction | undefined => {
            if (node.functionDefinition?.identifier === "std::control::return") {
                return node;
            }

            const nextNode = node.nextNodeId ? findNodeById(flow, node.nextNodeId) : undefined;
            return nextNode ? findReturnNode(nextNode) : undefined;
        };

        const returnNode = findReturnNode(refNode);
        if (!returnNode) return '(() => undefined)';

        const validation = getNodeValidation(flow, returnNode);
        return `(() => ({} as ${validation.inferredType}))`;
    }

    if (value.__typename === "LiteralValue") {
        return JSON.stringify(value.value);
    }

    return 'undefined';
}

/**
 * Finds the parent node that initiated this sub-tree via a NodeFunctionIdWrapper.
 */
const getParentScopeNode = (flow: Flow, currentNodeId: string): NodeFunction | undefined => {
    const nodes = flow.nodes?.nodes;
    if (!nodes) return undefined;

    return nodes.find(n =>
        n?.parameters?.nodes?.some(p =>
            p?.value?.__typename === "NodeFunctionIdWrapper" && p.value.id === currentNodeId
        )
    )!;
};

/**
 * Checks if a target node is reachable (executed before) the current node.
 */
const isNodeReachable = (flow: Flow, currentNode: NodeFunction, targetId: string, visited = new Set<string>()): boolean => {
    const currentId = currentNode.id;
    if (!currentId || visited.has(currentId)) return false;
    visited.add(currentId);

    // Scenario 1: Is the node a predecessor in the same execution chain?
    const isPredecessor = (startId: string): boolean => {
        const pred = flow.nodes?.nodes?.find(n => n?.nextNodeId === startId);
        if (!pred) return false;
        if (pred.id === targetId) return true;
        return isPredecessor(pred.id!);
    };

    if (isPredecessor(currentId)) return true;

    // Scenario 2: Nested scope check (e.g., inside a forEach loop)
    const parentNode = getParentScopeNode(flow, currentId);
    if (parentNode) {
        if (parentNode.id === targetId) return true;
        return isNodeReachable(flow, parentNode, targetId, visited);
    }

    return false;
};

/**
 * Validates if a reference is accessible from the current node's scope.
 */
export const validateReference = (
    flow: Flow,
    currentNode: NodeFunction,
    ref: ReferenceValue
): { isValid: boolean, error?: string } => {
    // Scenario 3: Global flow input
    if (!ref.nodeFunctionId) {
        return {isValid: true};
    }

    // Scenario 2: Parameter input reference (e.g., "item" in CONSUMER)
    if (ref.parameterIndex !== undefined && ref.inputIndex !== undefined) {
        if (currentNode.id === ref.nodeFunctionId) return {isValid: true};

        let tempParent = getParentScopeNode(flow, currentNode.id!);
        while (tempParent) {
            if (tempParent.id === ref.nodeFunctionId) return {isValid: true};
            tempParent = getParentScopeNode(flow, tempParent.id!);
        }

        return {
            isValid: false,
            error: `Invalid input reference: Node ${currentNode.id} is not in the scope of Node ${ref.nodeFunctionId}.`
        };
    }

    // Scenario 1: Ordinary return value reference
    if (!isNodeReachable(flow, currentNode, ref.nodeFunctionId)) {
        return {
            isValid: false,
            error: `Node ${ref.nodeFunctionId} has not been executed yet or is not visible in this scope.`
        };
    }

    return {isValid: true};
};
