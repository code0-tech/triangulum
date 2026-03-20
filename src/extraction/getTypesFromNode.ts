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

    // Create a version of the node with primitive literals removed
    // This allows inferring the "expected" type of parameters (e.g. keyof T)
    // rather than the specific type of the argument provided (e.g. "id").
    const nodeIdParams = nodeId + "_params";
    const nodeForParams = {
        ...nodeWithDefaults,
        id: nodeIdParams,
        parameters: {
            ...nodeWithDefaults.parameters,
            nodes: nodeWithDefaults.parameters.nodes.map(p => {
                // If it's a primitive literal, remove it to allow wider type inference for parameters
                if (p.value?.__typename === "LiteralValue" && p.value.value !== null && typeof p.value.value !== 'object') {
                    return { ...p, value: null };
                }
                return p;
            })
        }
    };

    const mockFlow: Flow = {
        id: "gid://sagittarius/Flow/0" as any,
        nodes: { __typename: "NodeFunctionConnection", nodes: [nodeWithDefaults, nodeForParams] }
    } as Flow;

    const inferred = getInferredTypesFromFlow(mockFlow, functions, dataTypes);
    const sId = sanitizeId(nodeId);
    const sIdParams = sanitizeId(nodeIdParams);

    const directParams = inferred.parameters.get(sId) || [];
    const widenedParams = inferred.parameters.get(sIdParams) || [];

    // Merge parameters: prefer widened types unless they failed inference (any/unknown)
    const parameters = directParams.map((p, i) => {
        const wide = widenedParams[i];
        if (wide && wide !== "any" && wide !== "unknown") {
            return wide;
        }
        return p;
    });

    return {
        parameters,
        returnType: inferred.nodes.get(sId) || "any",
    };
};
