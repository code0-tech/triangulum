// Utility functions for node validation
import {NodeParameter, Flow, NodeFunction, ReferencePath} from "@code0-tech/sagittarius-graphql-types";
import {ValidationResult} from "./nodeValidation";

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
        const wrapperValue = param.value as { __typename: "NodeFunctionIdWrapper"; id: string };
        const refNode = flow.nodes && Array.isArray(flow.nodes)
            ? flow.nodes.find((n: any) => n.id === wrapperValue.id)
            : flow.nodes?.nodes?.find((n: any) => n.id === wrapperValue.id);

        if (!refNode) return '(() => undefined)';

        const validation = getNodeValidation(flow, refNode);

        // WICHTIG: Keine Argument-Namen raten.
        // Wir geben eine Funktion zurück, die "irgendwelche" Argumente nimmt
        // und den inferredType zurückgibt.
        return `(() => ({} as ${validation.inferredType}))`;
    } else if (param?.value && param.value.__typename === "LiteralValue") {
        return JSON.stringify(param.value.value);
    }
    return 'undefined';
}
