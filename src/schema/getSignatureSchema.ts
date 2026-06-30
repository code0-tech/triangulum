import {DataType, Flow, FunctionDefinition, NodeFunction} from "@code0-tech/sagittarius-graphql-types"
import {createCompilerHost, generateFlowSourceCode, sanitizeId} from "../utils"
import ts, {Type} from "typescript"
import {getSchema, mergeSchemas, Schema} from "../util/schema.util"

/**
 * Represents the schema information for a node parameter.
 * Includes the parameter's schema definition and any parameter dependencies that block it.
 */
export interface NodeSchema {
    nodeId: NodeFunction["id"]
    /**
     * The schema definition for this node parameter. Produced by merging the
     * function-declared parameter schema with the node's concrete value schema:
     * the function schema drives the structural shape, the node schema contributes
     * additional suggestions, and a generic function parameter falls back to the
     * node's concrete shape (never as a select).
     */
    schema: Schema
    /** Array of parameter indices that must be resolved before this parameter */
    blockedBy?: number[]
}

/**
 * Represents a parameter dependency relationship.
 * Indicates which parameters depend on type parameters defined in other parameters.
 */
interface ParameterDependency {
    /** The index of the parameter that has the dependency */
    parameterIndex: number
    /** The index of the parameter it depends on */
    dependsOnIndex: number
}

/**
 * Generates node schemas for all parameters of a specified function node.
 *
 * This function analyzes a TypeScript flow's AST to extract type information for node parameters.
 * It resolves parameter types by combining information from both the node's call expression and
 * the function definition, accounting for type parameters and generic constraints.
 *
 * @param flow - The data flow object containing nodes and their relationships
 * @param dataTypes - Array of available data type definitions
 * @param functions - Array of available function definitions
 * @param nodeId - Optional specific node ID to analyze; if provided, only that node's schema is processed
 *
 * @returns Array of NodeSchema objects, each containing a schema and optional blocked dependencies
 *
 * @example
 * const schemas = getNodeSchema(flow, dataTypes, functions, nodeId);
 * schemas.forEach(({ schema, blockedBy }) => {
 *   console.log(`Parameter schema: ${schema}, blocked by: ${blockedBy?.join(',')}`);
 * });
 */
export const getSignatureSchema = (
    flow: Flow,
    dataTypes: DataType[],
    functions: FunctionDefinition[],
    nodeId?: NodeFunction["id"],
): NodeSchema[] => {
    // Generate TypeScript source code from the flow definition
    const sourceCode = generateFlowSourceCode(flow, functions, dataTypes)

    // Set up the TypeScript compiler environment
    const fileName = "index.ts"
    const host = createCompilerHost(fileName, sourceCode)
    const sourceFile = host.getSourceFile(fileName)!
    const program = host.languageService.getProgram()!
    const checker = program.getTypeChecker()

    // Retrieve and identify the target node
    const targetNode = flow.nodes?.nodes?.find((n) => n?.id === nodeId)
    const functionId = nodeId ? `fn_${targetNode?.functionDefinition?.identifier?.replace(/::/g, "_")}` : `flow`
    const realNodeId = nodeId ? `node_${sanitizeId(nodeId)}` : `flow_${sanitizeId(flow.id!)}`

    // Build map of declared functions for easy lookup
    const declaredFunctionsMap = createFunctionMap(sourceFile)

    // Build map of constant variable declarations for easy lookup
    const constantNames = createConstantMap(sourceFile)

    // Retrieve the node's variable declaration and its corresponding function
    const node = constantNames.get(realNodeId)
    const funktion = declaredFunctionsMap.get(functionId)

    // Extract parameter types from the node's call expression
    const nodeParameterTypes = extractNodeParameterTypes(checker, node)

    // Extract parameter types from the function definition
    const funktionParameterTypes = extractFunctionParameterTypes(checker, funktion, node)

    // Fall back to function param type when node param resolved to undefined (e.g. value: null passed as generic type param)
    const mergedParameterTypes = nodeParameterTypes?.map((type, index) =>
        (type.flags & ts.TypeFlags.Undefined) !== 0
            ? (funktionParameterTypes?.[index] ?? type)
            : type
    )

    // Identify parameter dependencies based on type parameters
    const funktionDependencies = getParameterDependencies(funktion!, nodeParameterTypes)

    // Track which parameter slots actually carry a user-supplied value. The merge
    // uses this as a last-resort signal: if the function- and node-side schemas
    // both came out generic but the user did set something, the lift falls back
    // to `data` so the UI has an open object to render against.
    const valueProvidedByIndex = (targetNode?.parameters?.nodes ?? []).map(
        (p) => p?.value != null
    )

    // Generate schema for each parameter
    return generateNodeSchemas(
        nodeId,
        checker,
        node!,
        mergedParameterTypes,
        funktionParameterTypes,
        funktionDependencies,
        nodeId ? declaredFunctionsMap : new Map(),
        nodeId ? functions : [],
        valueProvidedByIndex,
    )
}

/**
 * Creates a map of all function declarations in the source file.
 *
 * @param sourceFile - The TypeScript source file to analyze
 * @returns Map with function names as keys and FunctionDeclaration nodes as values
 */
const createFunctionMap = (
    sourceFile: ts.SourceFile,
): Map<string, ts.FunctionDeclaration> => {
    return new Map(
        sourceFile.statements
            .filter(ts.isFunctionDeclaration)
            .map((node) => [node.name!.getText(), node]),
    )
}

/**
 * Creates a map of all constant variable declarations in the source file.
 * Recursively traverses the AST to find all const declarations.
 *
 * @param sourceFile - The TypeScript source file to analyze
 * @returns Map with variable names as keys and VariableDeclaration nodes as values
 */
const createConstantMap = (
    sourceFile: ts.SourceFile,
): Map<string, ts.VariableDeclaration> => {
    const results: [string, ts.VariableDeclaration][] = []

    sourceFile.statements.forEach((node) => {
        node.forEachChild(function visitor(child) {
            if (ts.isVariableDeclaration(child)) {
                // Check if this is a const declaration
                if ((child.parent.flags & ts.NodeFlags.Const) !== 0) {
                    results.push([child.name.getText(), child])
                }
            }
            child.forEachChild(visitor)
        })
    })

    return new Map(results)
}

/**
 * Extracts parameter types from a node's call expression.
 * These types represent the actual types passed to the function at the node.
 *
 * @param checker - The TypeScript type checker
 * @param node - The variable declaration containing the call expression
 * @returns Array of resolved parameter types, or undefined if not available
 */
const extractNodeParameterTypes = (
    checker: ts.TypeChecker,
    node: ts.VariableDeclaration | undefined,
): Type[] | undefined => {
    if (!node?.initializer || !ts.isCallExpression(node.initializer)) {
        return undefined
    }

    const signature = checker.getResolvedSignature(node.initializer)
    return signature?.parameters.map((p) =>
        checker.getTypeOfSymbolAtLocation(p, node.initializer as ts.CallExpression),
    )
}

/**
 * Extracts parameter types from the function definition.
 * These are the declared parameter types from the function signature.
 *
 * @param checker - The TypeScript type checker
 * @param funktion - The function declaration to analyze
 * @param node - The node's variable declaration (used as location context)
 * @returns Array of parameter types, or undefined if function not found
 */
const extractFunctionParameterTypes = (
    checker: ts.TypeChecker,
    funktion: ts.FunctionDeclaration | undefined,
    node: ts.VariableDeclaration | undefined,
): Type[] | undefined => {
    if (!funktion || !node?.initializer) {
        return undefined
    }

    return funktion.parameters.map((p) => {
        const symbol = checker.getSymbolAtLocation(p.name)
        return checker.getTypeOfSymbolAtLocation(
            symbol!,
            node.initializer as ts.CallExpression,
        )
    })
}

/**
 * Identifies parameter dependencies based on shared type parameters.
 * Determines which parameters depend on type parameters declared in other parameters.
 * If an argument is explicitly provided (not null/undefined), it is not blocked.
 *
 * @param funktion - The function declaration to analyze
 * @param nodeParameterTypes
 * @returns Array of ParameterDependency objects
 */
const getParameterDependencies = (
    funktion: ts.FunctionDeclaration,
    nodeParameterTypes: ts.Type[] | undefined
): ParameterDependency[] => {
    const typeParamNames = funktion.typeParameters?.map((tp) => tp.name.getText()) || []
    const usage: Record<string, number[]> = {}

    // Track which parameters use each type parameter
    funktion.parameters.forEach((p, i) => {
        if (!p.type) return

        // Ein Set, um Duplikate pro Parameter zu vermeiden (falls 'A' mehrfach im selben Param-Typ vorkommt)
        const foundInParameter = new Set<string>()

        // Wir laufen rekursiv durch den Typ-Knoten des Parameters
        p.type.forEachChild(function visitor(child) {
            // Sucht nach expliziten Typ-Referenzen (z.B. die Typen in den <...> oder der Typ selbst)
            if (ts.isTypeReferenceNode(child) && ts.isIdentifier(child.typeName)) {
                const typeName = child.typeName.text
                if (typeParamNames.includes(typeName)) {
                    foundInParameter.add(typeName)
                }
            }
            // Falls der Typ selbst nur der Typparameter ist (z.B. p.type ist direkt ein TypeReferenceNode)
            if (ts.isTypeReferenceNode(p.type!) && ts.isIdentifier(p.type.typeName)) {
                const directTypeName = p.type.typeName.text
                if (typeParamNames.includes(directTypeName)) {
                    foundInParameter.add(directTypeName)
                }
            }

            child.forEachChild(visitor)
        })

        // Gefundene Abhängigkeiten für diesen Parameter registrieren
        foundInParameter.forEach((typeParam) => {
            if (!usage[typeParam]) {
                usage[typeParam] = []
            }
            usage[typeParam].push(i)
        })
    })

    // Extract raw dependencies based on type definition
    const rawDependencies = Object.values(usage)
        .filter((indices) => indices.length > 1)
        .map(([firstIndex, ...otherIndices]) =>
            otherIndices.map((depIndex) => ({
                parameterIndex: depIndex,
                dependsOnIndex: firstIndex,
            })),
        )
        .flat()

    // Wenn wir keine Typen vom Checker haben, bleiben wir beim Standard
    if (!nodeParameterTypes) {
        return rawDependencies
    }

    // Filter heraus, was durch echte Werte (nicht null/undefined) bereits aufgelöst ist
    return rawDependencies.filter((dep) => {
        const resolvedType = nodeParameterTypes[dep.parameterIndex]

        // Falls aus irgendeinem Grund kein Typ ermittelt werden konnte -> blocked lassen
        if (!resolvedType) return true

        // Prüfen, ob der Typ null oder undefined ist
        const isNull = (resolvedType.flags & ts.TypeFlags.Null) !== 0
        const isUndefined = (resolvedType.flags & ts.TypeFlags.Undefined) !== 0

        // Wenn es null oder undefined IST, bleibt es blocked (true)
        // Wenn es ein echter Wert ist, fliegt die Dependency raus (false)
        return isNull || isUndefined
    })
}
/**
 * Generates node schemas for all parameters.
 * Creates schema objects for each parameter with their dependencies.
 *
 * @param nodeId -
 * @param checker - The TypeScript type checker
 * @param node - The node's variable declaration
 * @param nodeParameterTypes - Merged parameter types to use for schema generation
 * @param functionParameterTypes
 * @param funktionDependencies - Parameter dependencies to link with each parameter
 * @param declaredFunctionsMap - Map of available functions for schema context
 * @param functions - Array of function definitions
 * @param valueProvidedByIndex
 * @returns Array of NodeSchema objects
 */
const generateNodeSchemas = (
    nodeId: NodeFunction["id"],
    checker: ts.TypeChecker,
    node: ts.VariableDeclaration,
    nodeParameterTypes: Type[] | undefined,
    functionParameterTypes: Type[] | undefined,
    funktionDependencies: ParameterDependency[],
    declaredFunctionsMap: Map<string, ts.FunctionDeclaration>,
    functions: FunctionDefinition[],
    valueProvidedByIndex: boolean[],
): NodeSchema[] => {
    if (!nodeParameterTypes) {
        return []
    }

    return nodeParameterTypes.map((parameterType, index) => {
        const functionParameterType = functionParameterTypes?.[index]
        // Suggestions are scoped by what the *function* parameter accepts (e.g.
        // `T` widens to `any`, so anything in scope is a valid candidate), even
        // when the node value has narrowed the actual parameter type — otherwise
        // setting a boolean literal in a generic slot would silently hide all
        // other suggestions.
        const suggestionType = functionParameterType
            ? widenForSuggestions(checker, functionParameterType)
            : undefined

        const nodeSchema = getSchema(
            checker,
            node,
            parameterType,
            Array.from(declaredFunctionsMap.values()),
            functions,
            true,
            suggestionType,
        )
        const functionSchema = functionParameterType
            ? getSchema(
                checker,
                node,
                functionParameterType,
                Array.from(declaredFunctionsMap.values()),
                functions,
                false
            )
            : undefined

        return {
            nodeId: nodeId,
            schema: mergeSchemas(
                functionSchema,
                nodeSchema,
                valueProvidedByIndex[index] ?? false,
            ),
            blockedBy: funktionDependencies
                .filter((dep) => dep.parameterIndex === index)
                .map((dep) => dep.dependsOnIndex),
        }
    })
}

// Widen a function parameter type so that suggestion collection asks "what could
// the function accept here", not "what does the current value narrow this to".
// An unconstrained type parameter accepts anything → `any`. A constrained type
// parameter is replaced by its constraint. Everything else is used as-is.
const widenForSuggestions = (checker: ts.TypeChecker, type: ts.Type): ts.Type => {
    if ((type.flags & ts.TypeFlags.TypeParameter) === 0) return type
    const decl = type.symbol?.declarations?.[0]
    if (decl && ts.isTypeParameterDeclaration(decl) && decl.constraint) {
        return checker.getTypeFromTypeNode(decl.constraint)
    }
    return checker.getAnyType()
}

