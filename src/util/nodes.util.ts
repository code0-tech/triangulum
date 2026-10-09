import ts from "typescript";
import {FunctionDefinition, NodeFunction} from "@code0-tech/sagittarius-graphql-types";
import {
    possibleMatch,
    SuggestionCandidate,
    typeMatchCertainty,
    weakestCertainty,
} from "./suggestion.util";

/**
 * Filters and transforms function declarations into a collection of compatible node functions.
 *
 * This utility function analyzes TypeScript function declarations and matches them against
 * a target parameter type. It returns node functions for all functions whose return types
 * are assignable to the specified parameter type. Each node function is enriched with
 * metadata including function definitions and parameter information.
 *
 * A callable (sub-flow) parameter is no exception: it is matched by the same
 * rule as every other slot — a function qualifies when the value it produces is
 * assignable to the slot's type. Such a node is offered alongside the
 * {@link getSubFlows} candidates, which bind an existing function as the
 * sub-flow itself; the two kinds are told apart by their `__typename` and may
 * both be present for the same function definition.
 *
 * @param {ts.TypeChecker} checker - The TypeScript type checker instance used to analyze
 *        type information and verify type compatibility
 * @param {ts.FunctionDeclaration[]} functionDeclarations - Array of TypeScript function
 *        declarations to be filtered and analyzed
 * @param {FunctionDefinition[]} functions - Array of function definitions containing
 *        metadata about functions, including identifiers and parameter definitions
 * @param {ts.Type} paramType - The target parameter type used to filter compatible
 *        functions. Only functions with return types assignable to this type are included
 *
 * @returns {SuggestionCandidate[]} Array of node-function candidates compatible with
 *          the specified parameter type, each carrying how certainly its return
 *          type produces that type, or an empty array if no compatible functions
 *          are found
 *
 * @example
 * const compatibleNodes = getNodes(checker, funcDecls, funcDefs, stringType);
 */
export const getNodes = (
    checker: ts.TypeChecker,
    functionDeclarations: ts.FunctionDeclaration[],
    functions: FunctionDefinition[],
    paramType: ts.Type
): SuggestionCandidate[] => {
    // Transform each function declaration into a node function if it matches the parameter type
    return functionDeclarations.flatMap((func) => {
        const candidate = createNodeFunctionIfCompatible(checker, func, functions, paramType);
        return candidate ? [candidate] : [];
    });
};

/**
 * Creates a node function from a function declaration if its return type is compatible
 * with the specified parameter type.
 *
 * This helper function handles the type checking logic and node function construction.
 * It extracts the function signature, resolves type parameters, verifies type compatibility,
 * and builds a complete node function object with parameter definitions.
 *
 * The match is not only a yes/no: a return type that had to be weakened to fit —
 * a type parameter matched through its constraint, an `any` return, a return
 * that may be nullish where the slot is not — yields a `possible` candidate
 * rather than an `exact` one. The function is still offered, but a consumer can
 * tell a dedicated producer of the slot's type from one that merely cannot be
 * ruled out (see {@link SuggestionCertainty}).
 *
 * @param {ts.TypeChecker} checker - The TypeScript type checker for type analysis
 * @param {ts.FunctionDeclaration} func - The function declaration to process
 * @param {FunctionDefinition[]} functions - Array of function definitions for metadata lookup
 * @param {ts.Type} paramType - The target parameter type for compatibility check
 *
 * @returns {SuggestionCandidate | null} A node-function candidate with its certainty if
 *          the function is compatible with the parameter type, otherwise null
 *
 * @private
 */
const createNodeFunctionIfCompatible = (
    checker: ts.TypeChecker,
    func: ts.FunctionDeclaration,
    functions: FunctionDefinition[],
    paramType: ts.Type
): SuggestionCandidate | null => {

    // Extract the function signature and its return type
    const signature = checker.getSignatureFromDeclaration(func);
    const returnType = checker.getReturnTypeOfSignature(signature!);

    // Simplify the return type by resolving type parameters
    const simplifiedReturnType = resolveReturnType(checker, returnType);

    // Only proceed if the return type fits the target parameter type, under
    // {@link typeMatchCertainty}'s rule: a function returning `string | null` is
    // still offered for a plain `string` parameter, as a `nullable` possible
    // match rather than being dropped.
    const matched = typeMatchCertainty(simplifiedReturnType, checker, paramType);
    if (!matched) {
        return null;
    }

    // Resolving a type parameter to its constraint is a weakening of its own: the
    // concrete instantiation may be narrower than what matched here.
    const certainty = returnType.isTypeParameter()
        ? weakestCertainty(matched, possibleMatch("generic"))
        : matched;

    // Extract and normalize the function name
    const functionName = normalizeFunctionName(func.name?.getText());
    const functionDefinition = functions.find((f) => f.identifier === functionName);

    // Build and return the node function candidate
    return {value: buildNodeFunction(functionDefinition), certainty};
};

/**
 * Resolves a return type by handling type parameters with their base constraints.
 *
 * If the provided type is a type parameter, this function retrieves its base constraint.
 * If no base constraint exists, it falls back to the `any` type. Otherwise, it returns
 * the type as-is.
 *
 * Both outcomes are a weakening the caller records as a `possible` match: the
 * constraint only bounds the instantiation, and the `any` fallback matches every
 * slot at all.
 *
 * @param {ts.TypeChecker} checker - The TypeScript type checker
 * @param {ts.Type} returnType - The return type to resolve
 *
 * @returns {ts.Type} The resolved return type with type parameters replaced by their
 *          base constraints or the `any` type as a fallback
 *
 * @private
 */
const resolveReturnType = (checker: ts.TypeChecker, returnType: ts.Type): ts.Type => {
    if (returnType.isTypeParameter()) {
        return checker.getBaseConstraintOfType(returnType) || checker.getAnyType();
    }
    return returnType;
};

/**
 * Normalizes a function name by removing prefixes and replacing underscores with
 * double colons (::).
 *
 * This function applies the following transformations:
 * 1. Removes the "fn_" prefix
 * 2. Replaces the first underscore with "::"
 * 3. Replaces the second underscore with "::"
 *
 * Example: "fn_module_submodule" becomes "module::submodule"
 *
 * @param {string | undefined} rawName - The raw function name from the declaration
 *
 * @returns {string} The normalized function name, or an empty string if the input
 *          is undefined
 *
 * @private
 */
const normalizeFunctionName = (rawName: string | undefined): string => {
    if (!rawName) {
        return "";
    }
    return rawName
        .replace("fn_", "")
        .replace("_", "::")
        .replace("_", "::");
};

/**
 * Builds a complete node function object with all required metadata and parameters.
 *
 * Constructs a GraphQL-compatible node function structure that includes:
 * - GraphQL type information (__typename and id)
 * - Function definition metadata (identifier and id)
 * - Parameter definitions with default values if applicable
 *
 * @param {FunctionDefinition | undefined} functionDefinition - The function definition
 *        containing metadata and parameter information. If undefined, the node function
 *        will still be created with null references for the definition.
 *
 * @returns {NodeFunction} A fully constructed node function object ready for use in
 *          the GraphQL schema
 *
 * @private
 */
const buildNodeFunction = (
    functionDefinition: FunctionDefinition | undefined
): NodeFunction => {
    const hasParameters =
        (functionDefinition?.parameterDefinitions?.nodes?.length ?? 0) > 0;

    const baseNode: NodeFunction = {
        __typename: "NodeFunction",
        id: `gid://sagittarius/NodeFunction/1`,
        functionDefinition: {
            __typename: "FunctionDefinition",
            id: functionDefinition?.id,
            identifier: functionDefinition?.identifier,
            names: functionDefinition?.names,
            descriptions: functionDefinition?.descriptions,
            displayIcon: functionDefinition?.displayIcon
        },
    };

    if (hasParameters) {
        baseNode.parameters = buildParameterConnection(
            functionDefinition?.parameterDefinitions?.nodes || []
        ) as any;
    }

    return baseNode;
};

/**
 * Builds a parameter connection object containing all parameter definitions.
 *
 * Transforms an array of parameter definitions into a GraphQL-compatible parameter
 * connection structure. Each parameter is enriched with its definition metadata and
 * default value if available.
 *
 * @param {any[]} parameterNodes - Array of parameter definition nodes to be transformed
 *
 * @returns {Object} A parameter connection object with __typename and an array of
 *          node parameters, each containing parameter definition and default value
 *
 * @private
 */
const buildParameterConnection = (parameterNodes: any[]) => {
    return {
        __typename: "NodeParameterConnection",
        nodes: parameterNodes.map((p) => buildNodeParameter(p)),
    };
};

/**
 * Builds a single node parameter object from a parameter definition.
 *
 * Constructs a GraphQL-compatible parameter node that includes:
 * - Parameter definition metadata (id and identifier)
 * - Default value if available, otherwise null
 *
 * @param {any} parameterDef - The parameter definition object containing id,
 *        identifier, and optional defaultValue
 *
 * @returns {Object} A node parameter object with __typename, parameterDefinition,
 *          and default value information
 *
 * @private
 */
const buildNodeParameter = (parameterDef: any) => {
    return {
        __typename: "NodeParameter",
        parameterDefinition: {
            __typename: "ParameterDefinition",
            id: parameterDef?.id,
            identifier: parameterDef?.identifier,
        },
        value: parameterDef?.defaultValue
            ? {
                  __typename: "LiteralValue",
                  value: parameterDef.defaultValue.value,
              }
            : null,
    };
};
