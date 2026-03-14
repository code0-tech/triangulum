import ts from "typescript";
import {
    DataType,
    Flow,
    FunctionDefinition,
    NodeFunction,
    NodeFunctionIdWrapper,
    ReferenceValue
} from "@code0-tech/sagittarius-graphql-types";
import {createCompilerHost, getSharedTypeDeclarations} from "../utils";
import {getNodeValidation} from "../validation/getNodeValidation";

/**
 * Calculates all available reference suggestions for a specific target node in a flow
 * and filters them by a required type.
 */
export const getReferenceSuggestions = (
    flow: Flow,
    nodeId: NodeFunction['id'],
    type: string,
    functions: FunctionDefinition[],
    dataTypes: DataType[]
): ReferenceValue[] => {
    const suggestions: ReferenceValue[] = [];
    const nodes = flow.nodes?.nodes || [];
    const targetNode = nodes.find(n => n?.id === nodeId);

    if (!targetNode) return [];

    const typeDefs = getSharedTypeDeclarations(dataTypes);

    // Helper to check if a type is assignable to the required type
    const isAssignable = (inferredType: string, path?: string): boolean => {
        if (!type || type === "any") return true;
        if (inferredType === "any") return true;

        const fileName = `suggestion_check_${Math.random().toString(36).substring(7)}.ts`;
        const sourceCode = `
            ${typeDefs}
            const val: ${inferredType} = {} as any;
            const test: ${type} = val${path ? `.${path}` : ""};
        `;
        const host = createCompilerHost(fileName, sourceCode);
        const sourceFile = host.getSourceFile(fileName)!;
        const program = host.languageService.getProgram()!;
        const diagnostics = program.getSemanticDiagnostics(sourceFile);

        return !diagnostics.some(d => d.category === ts.DiagnosticCategory.Error);
    };

    // Helper to get sub-properties and their types by probing with TypeScript
    const getValidPaths = (inferredType: string, baseValue: ReferenceValue): ReferenceValue[] => {
        const validRefs: ReferenceValue[] = [];

        const fileName = `probing_${Math.random().toString(36).substring(7)}.ts`;
        const sourceCode = `
            ${typeDefs}
            const val: ${inferredType} = {} as any;
        `;
        const host = createCompilerHost(fileName, sourceCode);
        const sourceFile = host.getSourceFile(fileName)!;
        const program = host.languageService.getProgram()!;
        const checker = program.getTypeChecker();

        // 1. Check base type
        if (isAssignable(inferredType)) {
            validRefs.push({...baseValue, referencePath: []});
        }

        // 2. Probing for sub-properties
        const findProperties = (type: ts.Type, currentPath: string[] = []) => {
            if (currentPath.length > 3) return; // Limit depth to avoid infinite recursion or performance issues

            const properties = type.getProperties();
            for (const prop of properties) {
                const propName = prop.getName();

                // Use getPropertyOfType if it exists, otherwise use more standard ways to get the type
                let propType: ts.Type | undefined;
                if ((checker as any).getPropertyOfType) {
                    const symbol = (checker as any).getPropertyOfType(type, propName);
                    if (symbol) {
                        propType = checker.getTypeOfSymbolAtLocation(symbol, sourceFile);
                    }
                } else {
                    const symbol = type.getProperty(propName);
                    if (symbol) {
                        propType = checker.getTypeOfSymbolAtLocation(symbol, sourceFile);
                    }
                }

                if (!propType) continue;

                const fullPath = [...currentPath, propName];
                const pathString = fullPath.join(".");

                if (isAssignable(inferredType, pathString)) {
                    validRefs.push({
                        ...baseValue,
                        referencePath: fullPath.map(p => ({
                            __typename: "ReferencePath",
                            path: p
                        })) as any
                    });
                }

                // Recursively explore properties (e.g., for nested objects)
                findProperties(propType, fullPath);
            }
        };

        // Get the actual type object for inferredType to explore properties
        const diagnostics = program.getSemanticDiagnostics(sourceFile);
        if (diagnostics.length === 0) {
            let typeNode: ts.Type | undefined;
            const visit = (node: ts.Node) => {
                if (ts.isVariableDeclaration(node) && node.name.getText() === "val") {
                    typeNode = checker.getTypeAtLocation(node);
                }
                ts.forEachChild(node, visit);
            };
            visit(sourceFile);

            if (typeNode) {
                findProperties(typeNode);
            }
        }

        return validRefs;
    };

    // 1. Flow Input
    if (flow.inputType) {
        const flowInputType = flow.inputType || "any";
        suggestions.push(...getValidPaths(flowInputType, {
            __typename: "ReferenceValue",
            nodeFunctionId: null,
            parameterIndex: 0,
            referencePath: []
        } as ReferenceValue));
    }

    // 2. Return values of previously executed nodes
    nodes.forEach(node => {
        if (!node || node.id === nodeId) return;

        if (isNodeBefore(flow, node, targetNode)) {
            const validation = getNodeValidation(flow, node, functions, dataTypes);
            suggestions.push(...getValidPaths(validation.inferredType, {
                __typename: "ReferenceValue",
                nodeFunctionId: node.id,
                referencePath: []
            } as ReferenceValue));
        }
    });

    // 3. Inputs of parent nodes (Scopes)
    let currentParent = getParentScopeNode(flow, nodeId!);
    while (currentParent) {
        const funcDef = functions.find(f => f.identifier === currentParent!.functionDefinition?.identifier);
        if (funcDef) {
            const paramIndex = currentParent.parameters?.nodes?.findIndex(p => {
                const val = p?.value;
                if (val?.__typename === "NodeFunctionIdWrapper") {
                    const wrapper = val as NodeFunctionIdWrapper;
                    return wrapper.id === nodeId || isNodeInSubtree(flow, wrapper.id || undefined, nodeId!);
                }
                return false;
            });

            if (paramIndex !== undefined && paramIndex !== -1) {
                // For scope inputs like 'item' in for_each, we ideally need the generic type R.
                // This requires parsing the function signature (e.g., CONSUMER<R>).
                // For now, we use 'any' which is always assignable.
                suggestions.push(...getValidPaths("any", {
                    __typename: "ReferenceValue",
                    nodeFunctionId: currentParent.id,
                    parameterIndex: paramIndex,
                    inputIndex: 0,
                    referencePath: []
                } as ReferenceValue));
            }
        }
        currentParent = getParentScopeNode(flow, currentParent.id!);
    }

    return suggestions;
};

// Helper functions adapted from utils.ts but specialized for suggestions

function isNodeBefore(flow: Flow, potentialPredecessor: NodeFunction, currentNode: NodeFunction): boolean {
    const nodes = flow.nodes?.nodes || [];
    let checkId = potentialPredecessor.nextNodeId;
    const visited = new Set<string>();

    while (checkId) {
        if (checkId === currentNode.id) return true;
        if (visited.has(checkId)) break;
        visited.add(checkId);
        const next = nodes.find(n => n?.id === checkId);
        checkId = next?.nextNodeId;
    }

    // Also check if potentialPredecessor is a parent scope of currentNode
    let parent = getParentScopeNode(flow, currentNode.id!);
    while (parent) {
        if (parent.id === potentialPredecessor.id) return true;
        parent = getParentScopeNode(flow, parent.id!);
    }

    return false;
}

function getParentScopeNode(flow: Flow, nodeId: string): NodeFunction | undefined {
    const parent = flow.nodes?.nodes?.find(n =>
        n?.parameters?.nodes?.some(p =>
            p?.value?.__typename === "NodeFunctionIdWrapper" && (p.value as NodeFunctionIdWrapper).id === nodeId
        )
    );
    return parent || undefined;
}

function isNodeInSubtree(flow: Flow, rootId: string | undefined, targetId: string): boolean {
    if (!rootId) return false;
    if (rootId === targetId) return true;

    const nodes = flow.nodes?.nodes || [];
    const root = nodes.find(n => n?.id === rootId);
    if (!root) return false;

    // Check next node
    if (root.nextNodeId && isNodeInSubtree(flow, root.nextNodeId || undefined, targetId)) return true;

    // Check parameters (lambdas)
    const inLambda = root.parameters?.nodes?.some(p => {
        const val = p?.value;
        if (val?.__typename === "NodeFunctionIdWrapper") {
            return isNodeInSubtree(flow, (val as NodeFunctionIdWrapper).id || undefined, targetId);
        }
        return false;
    });

    return !!inLambda;
}
