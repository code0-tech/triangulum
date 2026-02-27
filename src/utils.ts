// Utility functions for node validation
import {
    Flow,
    NodeFunction,
    NodeFunctionIdWrapper,
    NodeParameter,
    ReferencePath, ReferenceValue
} from "@code0-tech/sagittarius-graphql-types";
import {ValidationResult} from "./data";

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
    `;

/**
 * Determines the type along a reference path (for objects, not arrays).
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
 * Extracts parameter code for a NodeParameter.
 */
export function getParameterCode(
    param: NodeParameter,
    flow: Flow,
    getNodeValidation: (flow: Flow, node: NodeFunction) => ValidationResult
): string {
    if (param?.value && param.value.__typename === "ReferenceValue") {
        const refValue = param.value as { __typename: "ReferenceValue"; nodeFunctionId: string; referencePath?: any[] };
        const refNode = flow.nodes && Array.isArray(flow.nodes)
            ? flow.nodes.find((n: any) => n.id === refValue.nodeFunctionId)
            : flow.nodes?.nodes?.find((n: any) => n.id === refValue.nodeFunctionId);
        if (!refNode) return 'undefined';
        let refType = getNodeValidation(flow, refNode).inferredType;
        if (refValue.referencePath && refValue.referencePath.length > 0) {
            let refVal = undefined;
            if (refNode.parameters && refNode.parameters.nodes) {
                const firstParam = refNode.parameters.nodes[0];
                if (firstParam.value && firstParam.value.__typename === "LiteralValue") {
                    refVal = firstParam.value.value;
                }
            }
            refType = getTypeFromReferencePath(refVal, refValue.referencePath);
        }
        return `({} as ${refType})`;
    } else if (param?.value && param.value.__typename === "NodeFunctionIdWrapper") {
        const refNode: NodeFunction | undefined = flow?.nodes?.nodes?.find(lNode => lNode?.id === (param.value as NodeFunctionIdWrapper).id)!
        if (!refNode) return '(() => undefined)';

        const findReturnNode = (node: NodeFunction, flow: Flow): NodeFunction | undefined => {
            if (node?.functionDefinition?.identifier === "std::control::return")
                return node

            const lNode = flow?.nodes?.nodes?.find(lNode => lNode?.id === node?.nextNodeId)
            if (lNode)
                return findReturnNode(lNode, flow)

            return undefined
        }

        const returnNode = findReturnNode(refNode, flow);
        if (!returnNode) return '(() => undefined)';

        const validation = getNodeValidation(flow, returnNode);
        return `(() => ({} as ${validation.inferredType}))`;
    } else if (param?.value && param.value.__typename === "LiteralValue") {
        return JSON.stringify(param.value.value);
    }
    return 'undefined';
}

/**
 * Sucht die Parent-Node, die diesen Sub-Tree via NodeFunctionIdWrapper gestartet hat.
 */
const getParentScopeNode = (flow: Flow, currentNodeId: NodeFunction['id']): NodeFunction | undefined => {
    return flow.nodes?.nodes?.find(n =>
        n?.parameters?.nodes?.some(p =>
            p?.value?.__typename === "NodeFunctionIdWrapper" && p.value.id === currentNodeId
        )
    )!;
};

/**
 * Prüft, ob eine Node (targetId) im Pfad vor der aktuellen Node (currentId) liegt.
 * Dies deckt Szenario 1 ab.
 */
const isNodeReachable = (flow: Flow, currentNode: NodeFunction, targetId: string, visited = new Set<string>()): boolean => {
    const currentId = currentNode.id;
    if (!currentId || visited.has(currentId)) return false;
    visited.add(currentId);

    // --- SZENARIO 1: Liegt die Node im selben Tree davor? ---
    // Wir suchen alle Nodes, die direkt oder indirekt zur aktuellen Node führen
    const isPredecessor = (startId: string): boolean => {
        const pred = flow.nodes?.nodes?.find(n => n?.nextNodeId === startId);
        if (!pred) return false;
        if (pred.id === targetId) return true;
        return isPredecessor(pred.id!);
    };

    if (isPredecessor(currentId)) return true;

    // --- SZENARIO 2: Sind wir in einem Sub-Tree und die Target-Node ist der Parent? ---
    // Wenn wir z.B. in einer "forEach"-Schleife sind, ist die "forEach"-Node selbst
    // und alles vor ihr erreichbar.
    const parentNode = getParentScopeNode(flow, currentId);
    if (parentNode) {
        if (parentNode.id === targetId) return true;
        // Rekursiv prüfen, ob die Target-Node vom Parent aus erreichbar ist
        return isNodeReachable(flow, parentNode, targetId, visited);
    }

    return false;
};

export const validateReference = (flow: Flow, currentNode: NodeFunction, ref: ReferenceValue): { isValid: boolean, error?: string } => {
    // SZENARIO 3: Globaler Flow-Input
    if (!ref.nodeFunctionId) {
        return { isValid: true };
    }

    // SZENARIO 2: Input eines Parameters (z.B. "item" in CONSUMER)
    if (ref.parameterIndex !== undefined && ref.inputIndex !== undefined) {
        // KORREKTUR: Die Node darf sich selbst referenzieren,
        // wenn sie der Einstiegspunkt des Scopes ist.
        if (currentNode.id === ref.nodeFunctionId) return { isValid: true };

        // Die Node, die den Input definiert (ref.nodeFunctionId),
        // muss ein Parent-Scope der aktuellen Node sein.
        let tempParent = getParentScopeNode(flow, currentNode.id!);
        while (tempParent) {
            if (tempParent.id === ref.nodeFunctionId) return { isValid: true };
            tempParent = getParentScopeNode(flow, tempParent.id!);
        }
        return {
            isValid: false,
            error: `Input-Referenz ungültig: Node ${currentNode.id} befindet sich nicht im Scope von Node ${ref.nodeFunctionId}.`
        };
    }

    // SZENARIO 1: Normaler Return-Wert
    if (!isNodeReachable(flow, currentNode, ref.nodeFunctionId)) {
        return {
            isValid: false,
            error: `Die Node ${ref.nodeFunctionId} wurde noch nicht ausgeführt oder ist in diesem Scope nicht sichtbar.`
        };
    }

    return { isValid: true };
};
