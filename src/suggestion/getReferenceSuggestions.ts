import ts from "typescript";
import {
    DataType,
    Flow,
    FunctionDefinition,
    NodeFunction,
    NodeFunctionIdWrapper,
    ReferenceValue
} from "@code0-tech/sagittarius-graphql-types";
import {createCompilerHost, getSharedTypeDeclarations, getInferredTypesFromFlow, sanitizeId} from "../utils";
/**
 * Calculates all available reference suggestions for a specific target node in a flow
 * and filters them by a required type.
 */
export const getReferenceSuggestions = (
    flow?: Flow,
    nodeId?: NodeFunction['id'],
    type: string = "any",
    functions?: FunctionDefinition[],
    dataTypes?: DataType[]
): ReferenceValue[] => {
    if (!flow || !nodeId) return [];
    const suggestions: ReferenceValue[] = [];
    const nodes = flow?.nodes?.nodes || [];
    const targetNode = nodes.find(n => n?.id === nodeId);
    if (!targetNode) return [];
    const typeDefs = getSharedTypeDeclarations(dataTypes);
    const inferred = getInferredTypesFromFlow(flow, functions, dataTypes);

    // Helper to check if a type is assignable to the required type
    const isAssignable = (inferredType: string, path?: string): boolean => {
        const fileName = `index.ts`;
        const sourceCode = `
            ${typeDefs}
            declare const val: ${inferredType};
            const test: ${type} = val${path ? `.${path}` : ""};
        `;
        const host = createCompilerHost(fileName, sourceCode);
        const program = host.languageService.getProgram()!;
        const sourceFile = program.getSourceFile(fileName)!;
        const diagnostics = program.getSemanticDiagnostics(sourceFile);
        return !diagnostics.some(d => d.category === ts.DiagnosticCategory.Error);
    };

    // Helper to get sub-properties and their types by probing with TypeScript
    const getValidPaths = (inferredType: string, baseValue: ReferenceValue): ReferenceValue[] => {
        const validRefs: ReferenceValue[] = [];

        // 1. Check base type
        if (isAssignable(inferredType)) {
            validRefs.push({...baseValue, referencePath: []});
        }

        const fileName = `probe.ts`;
        const sourceCode = `
            ${typeDefs}
            declare const val: ${inferredType};
        `;
        const host = createCompilerHost(fileName, sourceCode);
        const program = host.languageService.getProgram()!;
        const checker = program.getTypeChecker();
        const sourceFile = program.getSourceFile(fileName)!;

        const findProperties = (typeObj: ts.Type, currentPath: string[] = []) => {
            if (currentPath.length >= 3) return; // Limit depth

            const properties = typeObj.getProperties();
            for (const prop of properties) {
                const propName = prop.getName();
                if (propName.startsWith("__")) continue;

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

                // Recursively check sub-properties
                const propType = checker.getTypeOfSymbolAtLocation(prop, sourceFile);
                if (propType && (propType.getFlags() & ts.TypeFlags.Object)) {
                    findProperties(propType, fullPath);
                }
            }
        };

        const lastStatement = sourceFile.statements[sourceFile.statements.length - 1];
        if (lastStatement && ts.isVariableStatement(lastStatement)) {
            const decl = lastStatement.declarationList.declarations[0];
            if (decl) {
                const typeObj = checker.getTypeAtLocation(decl);
                if (typeObj) findProperties(typeObj);
            }
        }

        return validRefs;
    };

    // 1. Flow Input
    if (flow.inputType) {
        suggestions.push(...getValidPaths(flow.inputType, { __typename: "ReferenceValue" } as ReferenceValue));
    }

    // 2. Previously executed nodes and scope inputs
    nodes.forEach(node => {
        if (!node || !node.id) return;
        const sId = sanitizeId(node.id);

        // Suggestions from node return values
        if (node.id !== nodeId) {
            const nodeType = inferred.nodes.get(sId);
            if (nodeType && isNodeBefore(flow, node.id, nodeId)) {
                suggestions.push(...getValidPaths(nodeType, {
                    __typename: "ReferenceValue",
                    nodeFunctionId: node.id,
                    referencePath: []
                } as ReferenceValue));
            }
        }

        // Suggestions from scope inputs (parameters of lambda)
        const pTypes = inferred.parameters.get(sId);
        if (pTypes) {
            pTypes.forEach((pType, idx) => {
                if (isParentScope(flow, node.id!, nodeId!)) {
                     // Extract T from CONSUMER<T> or similar if needed
                     let actualPType = pType;
                     if (pType.startsWith("CONSUMER<") && pType.endsWith(">")) {
                         actualPType = pType.substring(9, pType.length - 1);
                     }

                     suggestions.push(...getValidPaths(actualPType, {
                        __typename: "ReferenceValue",
                        nodeFunctionId: node.id,
                        parameterIndex: idx,
                        inputIndex: 0,
                        referencePath: []
                    } as ReferenceValue));
                }
            });
        }
    });

    return suggestions;
};

function isNodeBefore(flow: Flow, startId: string, targetId: string): boolean {
    const nodes = flow.nodes?.nodes || [];
    const visited = new Set<string>();

    // Check if there's a path from startId to targetId
    const checkForward = (currentId: string): boolean => {
        if (currentId === targetId) return true;
        if (visited.has(currentId)) return false;
        visited.add(currentId);

        const node = nodes.find(n => n?.id === currentId);
        if (!node) return false;

        if (node.nextNodeId && checkForward(node.nextNodeId)) return true;
        return node.parameters?.nodes?.some(p => {
             if (p?.value?.__typename === "NodeFunctionIdWrapper") {
                 return checkForward((p.value as NodeFunctionIdWrapper).id!);
             }
             return false;
        }) || false;
    };

    return checkForward(startId);
}

function isParentScope(flow: Flow, parentId: string, childId: string): boolean {
    const nodes = flow.nodes?.nodes || [];
    const parent = nodes.find(n => n?.id === parentId);
    if (!parent) return false;

    return parent.parameters?.nodes?.some(p => {
        const val = p?.value;
        if (val?.__typename === "NodeFunctionIdWrapper") {
            const wrapper = val as NodeFunctionIdWrapper;
            return wrapper.id === childId || isNodeInSubtree(flow, wrapper.id!, childId);
        }
        return false;
    }) || false;
}

function isNodeInSubtree(flow: Flow, rootId: string, targetId: string): boolean {
    if (rootId === targetId) return true;
    const nodes = flow.nodes?.nodes || [];
    const root = nodes.find(n => n?.id === rootId);
    if (!root) return false;

    if (root.nextNodeId && isNodeInSubtree(flow, root.nextNodeId, targetId)) return true;

    return root.parameters?.nodes?.some(p => {
        const val = p?.value;
        if (val?.__typename === "NodeFunctionIdWrapper") {
            const wrapper = val as NodeFunctionIdWrapper;
            if (!wrapper.id) return false;
            return isNodeInSubtree(flow, wrapper.id, targetId);
        }
        return false;
    }) || false;
}
