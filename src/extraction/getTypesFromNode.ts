import {DataType, Flow, FunctionDefinition, NodeFunction} from "@code0-tech/sagittarius-graphql-types";
import {getInferredTypesFromFlow, sanitizeId} from "../utils";

export interface NodeTypes {
    parameters: string[];
    returnType: string;
}

/**
 * Resolves the types of the parameters and the return type of a NodeFunction.
 */
export const getTypesFromNode = (
    node?: NodeFunction,
    functions?: FunctionDefinition[],
    dataTypes?: DataType[]
): NodeTypes => {
    if (!node) return { parameters: [], returnType: "any" };

    const nodeId = node.id || "temp_node_id";

    // To ensure generics and triangulated types are resolved without hardcoding,
    // we must ensure the compiler has enough context.
    // If some parameters are missing values, the compiler might return 'any'.
    // We create a version of the node where missing values are filled with a marker
    // that the TypeScript engine can use to infer the intended type from the signature.

    const nodeWithDefaults = {
        ...node,
        id: nodeId,
        parameters: {
            ...node.parameters,
            nodes: node.parameters?.nodes?.map(p => {
                if (p?.value) return p;
                // If value is missing, we still want the compiler to see the argument position
                return { ...p, value: null };
            }) || []
        }
    };

    const mockFlow: Flow = {
        id: "gid://sagittarius/Flow/0" as any,
        nodes: { __typename: "NodeFunctionConnection", nodes: [nodeWithDefaults] }
    } as Flow;

    const inferred = getInferredTypesFromFlow(mockFlow, functions, dataTypes);
    const sId = sanitizeId(nodeId);

    return {
        parameters: inferred.parameters.get(sId) || [],
        returnType: inferred.nodes.get(sId) || "any",
    };
};
