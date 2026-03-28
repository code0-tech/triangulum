import ts from "typescript";
import {DataType, Flow, FunctionDefinition, NodeFunction, ReferenceValue} from "@code0-tech/sagittarius-graphql-types";
import {createCompilerHost, generateFlowSourceCode} from "../utils";

/**
 * Determines whether a type is a real object type (not a primitive type).
 * Excludes built-in primitive types like string, number, boolean, etc.
 * to ensure only actual object properties are extracted.
 *
 * @param type The TypeScript type to check
 * @returns true if the type is an object, false if it's a primitive
 */
const isRealObjectType = (type: ts.Type): boolean => {
    const primitiveFlags =
        ts.TypeFlags.String |
        ts.TypeFlags.Number |
        ts.TypeFlags.Boolean |
        ts.TypeFlags.Undefined |
        ts.TypeFlags.Null |
        ts.TypeFlags.BigInt |
        ts.TypeFlags.ESSymbol;

    return (type.flags & primitiveFlags) === 0;
};

/**
 * Recursively extracts all nested properties of an object type that are assignable
 * to the expected type, along with their access paths.
 *
 * For example, given an object type {user: {id: number, name: string}} and
 * an expected type of 'number', this function returns:
 * - { path: ['user', 'id'], type: number }
 *
 * @param type The type to extract properties from
 * @param checker The TypeScript type checker
 * @param expectedType The expected type to match against
 * @param currentPath The current property path (used for recursion)
 * @returns Array of matching properties with their paths
 */
const extractObjectProperties = (
    type: ts.Type,
    checker: ts.TypeChecker,
    expectedType: ts.Type,
    currentPath: string[] = []
): Array<{ path: string[]; type: ts.Type }> => {
    const results: Array<{ path: string[]; type: ts.Type }> = [];

    // Add the current type if it matches the expected type
    if (checker.isTypeAssignableTo(type, expectedType)) {
        results.push({ path: currentPath, type });
    }

    // Only extract properties from real object types, not primitives
    if (isRealObjectType(type)) {
        const properties = type.getProperties();
        if (properties && properties.length > 0) {
            properties.forEach(property => {
                const propType = checker.getTypeOfSymbolAtLocation(property, property.valueDeclaration!);
                const propName = property.getName();
                const newPath = [...currentPath, propName];

                // Recursively extract nested properties
                results.push(...extractObjectProperties(propType, checker, expectedType, newPath));
            });
        }
    }

    return results;
};

/**
 * Calculates all available reference suggestions for a specific target parameter in a flow.
 *
 * This function analyzes the flow's generated source code to find all variables
 * (node_ and p_ prefixed) that are in scope and compatible with the target parameter's
 * expected type. For object types, it also extracts nested properties and their access paths.
 *
 * @param flow The flow configuration
 * @param nodeId The ID of the node containing the target parameter
 * @param targetIndex The index of the target parameter
 * @param functions Available function definitions for type resolution
 * @param dataTypes Available data type definitions
 * @returns Array of ReferenceValue objects representing available suggestions
 */
export const getReferenceSuggestions = (
    flow?: Flow,
    nodeId?: NodeFunction['id'],
    targetIndex?: number,
    functions?: FunctionDefinition[],
    dataTypes?: DataType[]
): ReferenceValue[] => {

    const sourceCode = generateFlowSourceCode(flow, functions, dataTypes, true);
    const fileName = "index.ts";
    const host = createCompilerHost(fileName, sourceCode);
    const sourceFile = host.getSourceFile(fileName)!;
    const program = host.languageService.getProgram()!;
    const checker = program.getTypeChecker();

    // Find the exact position of the target node using a marker comment
    const fullText = sourceFile.getFullText();
    const commentPattern = `/* @pos ${nodeId} ${targetIndex} */`;
    const commentIndex = fullText.indexOf(commentPattern);
    const targetPos = commentIndex + commentPattern.length;

    /**
     * Recursively finds the smallest AST node at the given position
     */
    function findNodeAtPosition(node: ts.Node, pos: number): ts.Node {
        let found = node;
        ts.forEachChild(node, child => {
            if (child.getStart(sourceFile, true) <= pos && child.getEnd() >= pos) {
                found = findNodeAtPosition(child, pos);
            }
        });
        return found;
    }

    let targetNode = findNodeAtPosition(sourceFile, targetPos);
    const targetExpression = targetNode as ts.Expression;

    // Find the enclosing function call
    let parentCall: ts.CallExpression | undefined;
    if (ts.isCallExpression(targetExpression)) {
        parentCall = targetExpression;
    }

    if (!parentCall) {
        return [];
    }

    // Get the signature and expected type of the target parameter
    const signature = checker.getResolvedSignature(parentCall);
    if (!signature) return [];

    const params = signature.getParameters();
    const paramSymbol = params[targetIndex!] || params[params.length - 1];
    const expectedType = checker.getTypeOfSymbolAtLocation(paramSymbol, targetExpression);

    // Collect all variables in scope (node_ and p_ prefixed)
    const allSymbols = checker.getSymbolsInScope(targetExpression, ts.SymbolFlags.Variable);
    const referenceValues: ReferenceValue[] = [];

    allSymbols.forEach(symbol => {
        const name = symbol.getName();
        if (!name.startsWith("node_") && !name.startsWith("p_")) return;

        // Get the variable declaration
        const declaration = symbol.valueDeclaration || symbol.declarations?.[0];
        if (!declaration) return;

        // Skip variables declared after the target position
        if (declaration.getEnd() >= targetPos) {
            return;
        }

        const symbolType = checker.getTypeOfSymbolAtLocation(symbol, targetExpression!);

        // Handle node_ variables (node function results)
        if (name.startsWith("node_")) {
            if (!((symbolType.flags & ts.TypeFlags.Void) !== 0)) {
                const nodeFunctionId = name
                    .replace("node_", "")
                    .replace(/___/g, "://")
                    .replace(/__/g, "/")
                    .replace(/_/g, "/");

                // Extract all compatible properties including nested ones
                const propertyPaths = extractObjectProperties(symbolType, checker, expectedType);

                propertyPaths.forEach(({ path }) => {
                    const referenceValue: ReferenceValue = {
                        __typename: 'ReferenceValue',
                        nodeFunctionId: nodeFunctionId as any
                    };

                    if (path.length > 0) {
                        //@ts-ignore
                        referenceValue.referencePath = path;
                    }

                    referenceValues.push(referenceValue);
                });
            }
        }
        // Handle p_ variables (parameter/input values)
        else if (name.startsWith("p_")) {
            const idPart = name.replace("p_", "");
            const lastUnderscoreIndex = idPart.lastIndexOf("_");
            const rawId = idPart.substring(0, lastUnderscoreIndex);
            const paramIndexFromName = parseInt(idPart.substring(lastUnderscoreIndex + 1), 10);

            const nodeFunctionId = rawId
                .replace("p_", "")
                .replace(/___/g, "://")
                .replace(/__/g, "/")
                .replace(/_/g, "/");

            // Handle tuple types (e.g., destructured parameters like [item, index])
            if (checker.isTupleType(symbolType)) {
                const typeReference = symbolType as ts.TypeReference;
                const typeArguments = checker.getTypeArguments(typeReference);

                typeArguments.forEach((tupleElementType, tupleIndex) => {
                    // Extract all compatible properties for this tuple element
                    const propertyPaths = extractObjectProperties(tupleElementType, checker, expectedType);

                    propertyPaths.forEach(({ path }) => {
                        const referenceValue: ReferenceValue = {
                            __typename: 'ReferenceValue',
                            nodeFunctionId: nodeFunctionId as any,
                            parameterIndex: isNaN(paramIndexFromName) ? 0 : paramIndexFromName,
                            inputIndex: tupleIndex,
                            //@ts-ignore
                            inputTypeIdentifier: (typeReference.target as any).labeledElementDeclarations?.[tupleIndex].name.getText()
                        };

                        if (path.length > 0) {
                            //@ts-ignore
                            referenceValue.referencePath = path;
                        }

                        referenceValues.push(referenceValue);
                    });
                });
            }
        }
    });

    return referenceValues;
}
