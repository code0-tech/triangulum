import {DataType, Flow, FunctionDefinition, NodeFunction} from "@code0-tech/sagittarius-graphql-types"
import {createCompilerHost, generateFlowSourceCode, sanitizeId} from "../utils"
import ts, {Type} from "typescript"
import {
    declaredItemsOf,
    declaredSchema,
    DataInput,
    genericNodeSchema,
    getSchema,
    isOptionsUnion,
    ListInput,
    mergeSchemas,
    nonNullishType,
    normalizeNodeSchema,
    Schema,
    withSuggestions,
} from "../util/schema.util"
import {SuggestionCandidate, suggestionCandidates} from "../util/suggestion.util"

/**
 * Represents the schema information for a node parameter.
 * Includes the parameter's schema definition and any parameter dependencies that block it.
 */
export interface NodeSchema {
    /**
     * The schema definition for this node parameter. Produced by merging the
     * function-declared parameter schema with the node's concrete value schema:
     * the function schema drives the structural shape and the suggestions of every
     * nested position, the node schema contributes the parameter's own suggestion
     * scope plus the shape and `type` the entered value implies, and a generic
     * function parameter falls back to the node's concrete shape (never as a
     * select).
     *
     * Which suggestions a position offers therefore depends on the declared type
     * alone — entering a value changes how many items/properties are rendered and
     * each position's `type`, never the set of candidates it offers.
     */
    schema: Schema
    /** Array of parameter indices that must be resolved before this parameter */
    blockedBy?: number[]
}

/**
 * Represents the full schema information for a function signature.
 * Wraps the per-parameter schemas together with the schema of the signature's
 * return type.
 */
export interface SignatureSchema {
    /** The analyzed node's ID, or undefined when the flow signature itself is analyzed */
    nodeId: NodeFunction["id"]
    /** Schema for each parameter of the signature */
    parameters: NodeSchema[]
    /** Schema describing the signature's return type */
    return: Schema
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
): SignatureSchema => {
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

    // Track which parameter slots actually carry a user-supplied value. The merge
    // uses this as a last-resort signal: if the function- and node-side schemas
    // both came out generic but the user did set something, the lift falls back
    // to `data` so the UI has an open object to render against.
    const valueProvidedByIndex = (targetNode?.parameters?.nodes ?? []).map(
        (p) => p?.value != null
    )

    // Identify parameter dependencies based on type parameters
    const funktionDependencies = getParameterDependencies(funktion!, nodeParameterTypes, valueProvidedByIndex)

    // Generate schema for each parameter
    const parameters = generateNodeSchemas(
        checker,
        node!,
        mergedParameterTypes,
        funktionParameterTypes,
        funktionDependencies,
        nodeId ? declaredFunctionsMap : new Map(),
        nodeId ? functions : [],
        valueProvidedByIndex,
    )

    // Resolve the signature's return type and build its schema. The return type
    // describes the value the function produces, so it carries no input
    // suggestions.
    //
    // The *declared* return type is deliberately not threaded through here: its
    // type parameters still carry their constraints (e.g. a REST trigger's
    // `<T extends TYPE>` payload), and recovering a custom input from such a
    // constraint would brand the return as a type picker. A return describes a
    // produced value, never a slot the user fills, so a custom input like TYPE
    // can never be the right answer for it — only the concrete instantiated type
    // is resolved, which renders the shape the argument actually bound to.
    const returnType = extractReturnType(checker, node, funktion)
    const returnSchema: Schema = returnType
        ? getSchema(
            checker,
            node,
            returnType,
            Array.from(declaredFunctionsMap.values()),
            functions,
            false,
        )
        : {input: "generic"}

    return {nodeId, parameters, return: returnSchema}
}

/**
 * Extracts the return type of the signature being analyzed.
 *
 * The node's call expression is preferred because its resolved signature
 * substitutes concrete type arguments (e.g. `REST_ADAPTER_INPUT<T>` becomes the
 * instantiated type based on the supplied arguments). When no call expression is
 * available, the function declaration's own signature is used as a fallback.
 *
 * @param checker - The TypeScript type checker
 * @param node - The variable declaration containing the call expression
 * @param funktion - The function declaration for the signature
 * @returns The resolved return type, or undefined if it cannot be determined
 */
const extractReturnType = (
    checker: ts.TypeChecker,
    node: ts.VariableDeclaration | undefined,
    funktion: ts.FunctionDeclaration | undefined,
): Type | undefined => {
    if (node?.initializer && ts.isCallExpression(node.initializer)) {
        const signature = checker.getResolvedSignature(node.initializer)
        if (signature) {
            return checker.getReturnTypeOfSignature(signature)
        }
    }

    if (funktion) {
        const signature = checker.getSignatureFromDeclaration(funktion)
        if (signature) {
            return checker.getReturnTypeOfSignature(signature)
        }
    }

    return undefined
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
 * A dependency is cleared once either the depended-on parameter carries a value
 * (so the shared type parameter is pinned by the user's choice) or the dependent
 * parameter's own argument already resolves to a concrete type.
 *
 * @param funktion - The function declaration to analyze
 * @param nodeParameterTypes
 * @param valueProvidedByIndex - Whether each parameter slot carries a user-supplied value
 * @returns Array of ParameterDependency objects
 */
const getParameterDependencies = (
    funktion: ts.FunctionDeclaration,
    nodeParameterTypes: ts.Type[] | undefined,
    valueProvidedByIndex: boolean[] = [],
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
        // Providing the depended-on parameter pins the shared type parameter, so
        // the dependent is unblocked — even when the value carries no element type
        // to infer from (e.g. an empty list literal `[]`).
        if (valueProvidedByIndex[dep.dependsOnIndex]) return false

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

    // The suggestion set for a fully generic ("accepts anything") slot. Every
    // position the declared type leaves unconstrained offers this same set,
    // independent of the concrete value entered there — computed once against `any`.
    const anySuggestions = suggestionCandidates(getSchema(
        checker,
        node,
        checker.getAnyType(),
        Array.from(declaredFunctionsMap.values()),
        functions,
        true,
    ))

    return nodeParameterTypes.map((parameterType, index) => {
        const functionParameterType = functionParameterTypes?.[index]

        // Suggestions are scoped by what the *function* parameter accepts (e.g.
        // `T` widens to `any`, so anything in scope is a valid candidate), even
        // when the node value has narrowed the actual parameter type — otherwise
        // setting a boolean literal in a generic slot would silently hide all
        // other suggestions.
        const suggestionType = functionParameterType
            ? widenForSuggestions(checker, functionParameterType, node!)
            : undefined

        // Value-driven list items: when the argument is an array literal, the
        // list renders exactly one item per entered element (like an object's
        // properties mirror its fields). The item's input kind and select
        // options come from the declared element type; the item's `type` is the
        // concrete value's base type (e.g. "string"). This overrides the
        // type-driven, union-expanded items a plain type analysis would produce.
        // The whole-list suggestions (references/nodes that produce a matching
        // list) are still surfaced, scoped by what the function accepts.
        // The same value-driven cardinality holds for an object literal: each
        // entered property mirrors a field, and any list nested inside it renders
        // one item per entered element (see buildValueDrivenObjectSchema).
        const functionDeclarations = Array.from(declaredFunctionsMap.values())
        // Built *with* suggestions: the declared type is what decides which
        // suggestions a nested property or list element offers, and the merge takes
        // them from here so they stay the same whether or not a value was entered
        // (the node side's nested suggestions are narrowed by the concrete value —
        // see mergeSchemas).
        const functionSchema = functionParameterType
            ? getSchema(
                checker,
                node,
                functionParameterType,
                functionDeclarations,
                functions,
                true
            )
            : undefined

        // An object literal is only expanded value-first when the node's resolved
        // parameter type is genuinely an object. Against a scalar slot the `{}`
        // value is a type mismatch (or a conditional that collapsed to a scalar),
        // so the schema must follow the resolved kind — it falls through to the
        // merge path below and is never forced into a `data` shape. Arrays are
        // routed by the literal alone: a list slot's cardinality always comes from
        // the value.
        //
        // An optional slot resolves to `<declared> | undefined`, and a union carries
        // none of its members' type flags — so the nullish part is stripped before
        // the test. Without that, an object value in an optional object slot would
        // fall through to the merge path and lose every entered field.
        const nodeTypeIsObject = isPlainObjectType(checker, nonNullishType(parameterType))

        const argExpr = getArgumentExpression(node, index)

        // A union declared parameter type enumerates the *options* of the slot,
        // and the entered value picks one of them (see declaredUnionMember). The
        // node side resolves such a slot to the union itself, which is neither an
        // object nor a list — so without recovering the member here an object
        // value in a `COLOR | OBJECT<…>` slot would take the merge path and lose
        // every entered field, and the dedicated input of the member it picked.
        const declaredMember = argExpr
            ? declaredUnionMember(checker, functionParameterType, argExpr)
            : undefined
        const declaredParameterType = declaredMember ?? functionParameterType

        if (
            argExpr &&
            (ts.isArrayLiteralExpression(argExpr) ||
                (ts.isObjectLiteralExpression(argExpr) &&
                    (nodeTypeIsObject ||
                        (declaredMember != null && isPlainObjectType(checker, declaredMember)))))
        ) {
            const wholeSuggestions = suggestionCandidates(getSchema(
                checker,
                node,
                parameterType,
                functionDeclarations,
                functions,
                true,
                suggestionType,
            ))
            return {
                schema: ts.isArrayLiteralExpression(argExpr)
                    ? buildValueDrivenListSchema(
                        checker,
                        node,
                        declaredParameterType,
                        argExpr,
                        functionDeclarations,
                        functions,
                        wholeSuggestions,
                        anySuggestions,
                    )
                    : buildValueDrivenObjectSchema(
                        checker,
                        node,
                        declaredParameterType,
                        argExpr,
                        functionDeclarations,
                        functions,
                        wholeSuggestions,
                        anySuggestions,
                    ),
                blockedBy: funktionDependencies
                    .filter((dep) => dep.parameterIndex === index)
                    .map((dep) => dep.dependsOnIndex),
            }
        }

        // Specialized list-* inputs are a declared-type concern; the node value
        // only contributes concrete element types, so normalize what it produced.
        const nodeSchema = normalizeNodeSchema(getSchema(
            checker,
            node,
            parameterType,
            functionDeclarations,
            functions,
            true,
            suggestionType,
        ))

        return {
            schema: mergeSchemas(
                functionSchema,
                nodeSchema,
                valueProvidedByIndex[index] ?? false,
                anySuggestions,
            ),
            blockedBy: funktionDependencies
                .filter((dep) => dep.parameterIndex === index)
                .map((dep) => dep.dependsOnIndex),
        }
    })
}

/**
 * Returns the argument expression at the given position of the node's call
 * expression, or undefined when the node has no call initializer or fewer
 * arguments.
 */
const getArgumentExpression = (
    node: ts.VariableDeclaration,
    index: number,
): ts.Expression | undefined => {
    if (!node.initializer || !ts.isCallExpression(node.initializer)) return undefined
    return node.initializer.arguments[index]
}

// Primitive item kinds whose schema is rebuilt value-first: the declared kind is
// kept, but the item's `type` comes from the concrete value while the declared
// element type's suggestions (options, references, nodes) are carried along.
const PRIMITIVE_ITEM_INPUTS = new Set(["select", "boolean", "number", "text"])

// Type flags of a value that says nothing about the shape of the slot it sits
// in: an unfilled field, written out as `null` (or left `undefined`), rather than
// a value of a concrete type.
const NO_TYPE_FLAGS =
    ts.TypeFlags.Null | ts.TypeFlags.Undefined | ts.TypeFlags.Void | ts.TypeFlags.Never

/**
 * Returns true if the value's type carries no information about the slot — a
 * `null` entry in an otherwise filled object. The declared type stands for such a
 * position: `{test: null}` against `OBJECT<{test: NUMBER}>` is still a number
 * input *of type number*, waiting to be filled, not a number input of type
 * `null`.
 */
const carriesNoType = (type: Type): boolean => (type.flags & NO_TYPE_FLAGS) !== 0

/**
 * Returns true if the type is a plain object — the structural shape a `data`
 * input is built from — and not a list, which has its own value-driven expansion.
 */
const isPlainObjectType = (checker: ts.TypeChecker, type: Type): boolean =>
    (type.flags & ts.TypeFlags.Object) !== 0 &&
    !checker.isArrayType(type) &&
    !checker.isTupleType(type)

/**
 * The keys an object literal assigns, in source order. Shorthand and spread
 * members are skipped — the value-driven expansion only reads plain property
 * assignments.
 */
const objectLiteralKeys = (objectExpr: ts.ObjectLiteralExpression): string[] =>
    objectExpr.properties
        .filter(ts.isPropertyAssignment)
        .map((property) => propertyKey(property))

/**
 * The member of a declared *union* type that the entered value picked, or
 * `undefined` when there is no union to choose from — or when the value does not
 * identify one of its members.
 *
 * A union declared type enumerates the *options* of a slot: that is what
 * `declaredItems` spells out for a list, one entry per member. A value sitting in
 * the slot is one of those options, so everything the member declares — its input
 * kind, its properties and required list, the suggestions of every level — is
 * what describes the entered value. Resolving it is what keeps an entered
 * `items[i]` a refinement of one of the `declaredItems` instead of a shape read
 * off the raw value: a COLOR in a `LIST<COLOR | OBJECT<…>>` stays a color input
 * rather than being expanded back into the `{hue, saturation, lightness}` object
 * the color input replaces.
 *
 * An options union is deliberately left unresolved: its members are the options
 * of *one* input (`'GET' | 'POST' | …` renders a single select offering all six,
 * `boolean` one boolean input), not alternative inputs, so narrowing it to the
 * entered literal would hide the rest — see {@link isOptionsUnion}.
 *
 * Matching is tiered, because an entered value is routinely half-filled and a
 * half-filled value must still find its member:
 * 1. the member the value's type is assignable to;
 * 2. for an object literal, the member declaring the most of the entered keys —
 *    `{test: null}` names `OBJECT<{test: NUMBER}>` even though `null` is not
 *    assignable to `NUMBER` under strict null checks;
 * 3. for an array literal, the member that is itself a list.
 *
 * A value of type `any`/`unknown` (e.g. an unresolvable reference) matches every
 * member and therefore identifies none, so it resolves to nothing.
 */
const declaredUnionMember = (
    checker: ts.TypeChecker,
    declaredType: Type | undefined,
    value: ts.Expression,
): Type | undefined => {
    if (!declaredType) return undefined

    // An optional slot (`<declared> | undefined`) is not a union of options; it
    // collapses to its single real member, which getSchema resolves on its own.
    const stripped = nonNullishType(declaredType)
    if (!stripped.isUnion() || isOptionsUnion(stripped)) return undefined

    const members = stripped.types.filter(
        (t) => (t.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)) === 0,
    )
    if (members.length < 2) return undefined

    const valueType = checker.getTypeAtLocation(value)
    if ((valueType.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)) === 0) {
        const assignable = members.find((member) =>
            checker.isTypeAssignableTo(valueType, member),
        )
        if (assignable) return assignable
    }

    if (ts.isObjectLiteralExpression(value)) {
        const keys = objectLiteralKeys(value)
        let best: Type | undefined
        let bestScore = 0
        for (const member of members) {
            const score = keys.filter(
                (key) => checker.getPropertyOfType(member, key) != null,
            ).length
            if (score > bestScore) {
                best = member
                bestScore = score
            }
        }
        return best
    }

    if (ts.isArrayLiteralExpression(value)) {
        return members.find(
            (member) => checker.isArrayType(member) || checker.isTupleType(member),
        )
    }

    return undefined
}

/**
 * Builds a value-driven list schema from an array-literal argument.
 *
 * The list kind (e.g. `list`, `list-select`) comes from the declared function
 * list type, while `items` has exactly one entry per entered element (like an
 * object's properties mirror its fields). Nested array literals recurse, so the
 * per-value cardinality holds at every level. Whole-list suggestions (what can
 * produce the list) are attached when provided.
 */
const buildValueDrivenListSchema = (
    checker: ts.TypeChecker,
    node: ts.VariableDeclaration,
    funcListType: Type | undefined,
    arrayExpr: ts.ArrayLiteralExpression,
    functionDeclarations: ts.FunctionDeclaration[],
    functions: FunctionDefinition[],
    suggestions?: SuggestionCandidate[],
    anySuggestions?: SuggestionCandidate[],
): Schema => {
    const funcSchema = funcListType
        ? getSchema(checker, node, funcListType, functionDeclarations, functions, true)
        : undefined
    const isListKind =
        funcSchema != null &&
        (funcSchema.input as string | undefined)?.startsWith("list") === true
    // The declared element type, looked up on the non-nullish part so an optional
    // list (`LIST<TEXT> | undefined`) still yields its element rather than treating
    // every entry as an unconstrained slot.
    const declaredListType = funcListType ? nonNullishType(funcListType) : undefined
    const funcElementType =
        declaredListType && checker.isArrayType(declaredListType)
            ? checker.getTypeArguments(declaredListType as ts.TypeReference)[0]
            : undefined

    const items = arrayExpr.elements.map((element) =>
        buildValueDrivenItem(checker, node, funcElementType, element, functionDeclarations, functions, anySuggestions),
    )

    return withSuggestions(
        {
            input: isListKind ? funcSchema!.input : "list",
            type:
                (isListKind ? funcSchema!.type : undefined) ??
                checker.typeToString(checker.getBaseTypeOfLiteralType(checker.getTypeAtLocation(arrayExpr))),
            items,
            // What an element *may* be, kept alongside the entered elements: `items`
            // is value-driven here, so on its own it cannot say what to render for a
            // new element — and for an empty `[]` it says nothing at all.
            declaredItems: declaredItemsOf(
                isListKind ? (funcSchema as ListInput).items : undefined,
                anySuggestions,
            ),
        } as Schema,
        suggestions ?? ownSuggestions(funcSchema, anySuggestions),
    )
}

/**
 * The suggestions a value-driven container carries for its own level when the
 * caller has none to hand down — i.e. at every nested position, since only the
 * parameter root is given the whole-slot set.
 *
 * It is the declared type's own set, or the constant `any` set when the declared
 * type does not constrain this position (no declared type at all, or a generic
 * one). That mirrors the rule {@link mergeSchemas} follows, so a nested list or
 * object offers the same suggestions whether or not a value was entered — before
 * this, a nested container came out with none at all while its own items and
 * properties had theirs.
 */
const ownSuggestions = (
    funcSchema: Schema | undefined,
    anySuggestions?: SuggestionCandidate[],
): SuggestionCandidate[] | undefined =>
    !funcSchema || funcSchema.input === "generic"
        ? anySuggestions
        : suggestionCandidates(funcSchema)

/**
 * Builds a single list item schema for one array-literal element.
 *
 * The item's input kind comes from the declared element type; its `type` is the
 * concrete value's base type (literals widened, e.g. "GET" → string). Each item
 * carries the full suggestions of its element slot — literal options (e.g. a
 * select's members or true/false for a boolean), in-scope references, and
 * compatible function nodes. A generic declared element lets the value drive kind
 * and type; a nested array literal recurses into a value-driven list; a
 * structured element (object, …) keeps its declared schema and only contributes
 * to the item count.
 */
const buildValueDrivenItem = (
    checker: ts.TypeChecker,
    node: ts.VariableDeclaration,
    funcElementType: Type | undefined,
    element: ts.Expression,
    functionDeclarations: ts.FunctionDeclaration[],
    functions: FunctionDefinition[],
    anySuggestions?: SuggestionCandidate[],
): Schema => {
    // A union declared element (or property) type lists the options of this
    // position; the entered value picks one, and that member is what describes
    // it. Without this the union — which carries none of its members' type flags
    // — reads as an unconstrained slot, and the value would be expanded as if the
    // declared type said nothing: a COLOR back into a plain object, a declared
    // NUMBER property into whatever the entered value happens to be.
    const declaredType =
        declaredUnionMember(checker, funcElementType, element) ?? funcElementType

    if (ts.isArrayLiteralExpression(element)) {
        return buildValueDrivenListSchema(checker, node, declaredType, element, functionDeclarations, functions, undefined, anySuggestions)
    }

    // A nested object literal recurses into a value-driven object, so a list
    // buried inside it (e.g. `{test: [1, 1, 1]}`) still renders one item per
    // entered element instead of collapsing to a single element-type item.
    if (ts.isObjectLiteralExpression(element)) {
        return buildValueDrivenObjectSchema(checker, node, declaredType, element, functionDeclarations, functions, undefined, anySuggestions)
    }

    const funcElementSchema = declaredType
        ? getSchema(checker, node, declaredType, functionDeclarations, functions, true)
        : undefined
    const funcIsGeneric = !funcElementSchema || funcElementSchema.input === "generic"
    const valueType = checker.getBaseTypeOfLiteralType(checker.getTypeAtLocation(element))

    // Generic declared element: the value drives kind and type, but the slot
    // accepts anything, so the suggestions are the constant `any` set — not the
    // subset the concrete value would narrow to.
    if (funcIsGeneric) {
        return genericNodeSchema(
            getSchema(checker, node, valueType, functionDeclarations, functions, true),
            anySuggestions,
        )
    }

    // Primitive/select element: keep the declared kind and suggestions, but take
    // the concrete value's base type as the item type. An unfilled entry (`null`)
    // narrows nothing, so there the declared type stands (see carriesNoType).
    if (PRIMITIVE_ITEM_INPUTS.has(funcElementSchema!.input as string)) {
        return withSuggestions(
            {
                ...funcElementSchema!,
                ...(carriesNoType(valueType)
                    ? {}
                    : {type: checker.typeToString(valueType)}),
            } as Schema,
            suggestionCandidates(funcElementSchema!),
        )
    }

    // Structured element (object, …): keep the declared schema, whose every level
    // already carries the suggestions of the type it describes.
    return declaredSchema(funcElementSchema!, anySuggestions)
}

/**
 * Builds a value-driven object (`data`) schema from an object-literal argument.
 *
 * `properties` holds the declared fields plus one entry per entered field, so
 * cardinality is preserved through every nesting level — a list nested inside the
 * object renders one item per element instead of collapsing to its single element
 * type — while a field the value does not mention keeps its declared schema and
 * stays renderable. Each property's schema is
 * built the same way a list element is (see {@link buildValueDrivenItem}): its
 * input kind and suggestions come from the declared property type when the
 * function declares a concrete object, and a generic slot lets the value drive
 * the shape while carrying the constant `any` suggestions. Whole-object
 * suggestions (references/nodes that produce a matching object) are attached when
 * provided.
 */
const buildValueDrivenObjectSchema = (
    checker: ts.TypeChecker,
    node: ts.VariableDeclaration,
    funcObjectType: Type | undefined,
    objectExpr: ts.ObjectLiteralExpression,
    functionDeclarations: ts.FunctionDeclaration[],
    functions: FunctionDefinition[],
    suggestions?: SuggestionCandidate[],
    anySuggestions?: SuggestionCandidate[],
): Schema => {
    const funcSchema = funcObjectType
        ? getSchema(checker, node, funcObjectType, functionDeclarations, functions, true)
        : undefined
    const isDataKind = funcSchema?.input === "data"

    // Value-driven expansion only applies to a *structural* slot: a declared
    // `data` object, whose properties and nested cardinality mirror the entered
    // value, or a generic slot, which constrains nothing and lets the value drive
    // the shape. Any other declared input is dedicated — the function side has
    // already decided what the parameter is, and an entered value never downgrades
    // it (the same rule mergeSchemas and buildValueDrivenItem follow).
    //
    // This matters for every data type that is structurally an object but renders
    // as its own input (COLOR, FILE, and a `TYPE` / `<T extends TYPE>` picker):
    // expanding it here would turn it back into the very `data` shape its input
    // replaces. The declared schema is kept as-is — only the rendered `type` takes
    // the entered value's concrete shape, mirroring how the instantiated return
    // payload renders (see getSchema's custom-input handling).
    if (funcSchema && !isDataKind && funcSchema.input !== "generic") {
        return withSuggestions(
            {
                ...funcSchema,
                type: checker.typeToString(
                    checker.getBaseTypeOfLiteralType(checker.getTypeAtLocation(objectExpr)),
                ),
            } as Schema,
            suggestions ?? suggestionCandidates(funcSchema),
        )
    }

    // Start from the declared fields: the entered value refines and extends the
    // declared object, it never removes from it. A partially filled value would
    // otherwise drop every field it does not mention — leaving the UI with no way
    // to render (or suggest anything for) the fields still to be filled. A generic
    // slot declares nothing, so there the entered fields are all there is.
    const declaredProperties = isDataKind ? ((funcSchema as DataInput).properties ?? {}) : {}
    const properties: Record<string, Schema | Schema[]> = {}
    for (const [key, value] of Object.entries(declaredProperties)) {
        properties[key] = Array.isArray(value)
            ? value.map((member) => declaredSchema(member, anySuggestions))
            : declaredSchema(value, anySuggestions)
    }

    const enteredKeys: string[] = []

    for (const property of objectExpr.properties) {
        if (!ts.isPropertyAssignment(property)) continue
        const key = propertyKey(property)
        // Only a concrete declared object contributes a per-property type; a
        // generic slot leaves each entered field unconstrained.
        const funcPropertyType = isDataKind
            ? getObjectPropertyType(checker, nonNullishType(funcObjectType!), key)
            : undefined
        properties[key] = buildValueDrivenItem(
            checker,
            node,
            funcPropertyType,
            property.initializer,
            functionDeclarations,
            functions,
            anySuggestions,
        )
        enteredKeys.push(key)
    }

    // Optionality is a property of the declared type, so its required list stands
    // as-is — entering a value neither makes a field required nor relieves it. Only
    // a generic slot has no declared list, and there every entered field is taken as
    // required: the value is all the shape there is.
    const required = isDataKind ? ((funcSchema as DataInput).required ?? []) : enteredKeys

    return withSuggestions(
        {
            input: "data",
            type:
                (isDataKind ? funcSchema!.type : undefined) ??
                checker.typeToString(checker.getBaseTypeOfLiteralType(checker.getTypeAtLocation(objectExpr))),
            properties,
            required,
        } as Schema,
        suggestions ?? ownSuggestions(funcSchema, anySuggestions),
    )
}

/**
 * The name an object-literal property assigns, with a quoted or numeric key read
 * as its text rather than its source spelling.
 */
const propertyKey = (property: ts.PropertyAssignment): string =>
    ts.isStringLiteralLike(property.name) || ts.isNumericLiteral(property.name)
        ? property.name.text
        : property.name.getText()

/**
 * Resolves the declared type of a named property on an object type, or undefined
 * when the type has no such property (e.g. a field entered in the value that the
 * declared object does not constrain).
 */
const getObjectPropertyType = (
    checker: ts.TypeChecker,
    objectType: Type,
    key: string,
): Type | undefined => {
    const symbol = checker.getPropertyOfType(objectType, key)
    if (!symbol) return undefined
    const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0]
    return declaration
        ? checker.getTypeOfSymbolAtLocation(symbol, declaration)
        : undefined
}

// Widen a function parameter type so that suggestion collection asks "what could
// the function accept here", not "what does the current value narrow this to".
// An unconstrained type parameter accepts anything → `any`. A constrained type
// parameter is replaced by its constraint. Any generic type with free type parameters
// (e.g. LIST<T>, OBJECT<T>) is widened by substituting `any` for each free
// TypeParameter, because TypeScript's isTypeAssignableTo returns false for concrete
// types against generics with free T even though they are structurally valid candidates.
//
// For array types (TypeReference) the public createArrayType API rebuilds the widened
// type directly. For type-alias types (e.g. mapped types like OBJECT<T>) the source
// code is pre-seeded with `declare const __widen_<Name>: <Name><any, …>` declarations
// so the widened type can be looked up in the checker's scope via node.
const widenForSuggestions = (checker: ts.TypeChecker, type: ts.Type, node: ts.VariableDeclaration): ts.Type => {
    if ((type.flags & ts.TypeFlags.TypeParameter) !== 0) {
        const decl = type.symbol?.declarations?.[0]
        if (decl && ts.isTypeParameterDeclaration(decl) && decl.constraint) {
            return checker.getTypeFromTypeNode(decl.constraint)
        }
        return checker.getAnyType()
    }

    // A conditional type that still depends on a free type parameter cannot be
    // resolved to a single branch for suggestion scoping (e.g.
    // HTTP_PAYLOAD<S> = S extends 'application/json' ? OBJECT<{}> : … stays
    // unresolved while S is free, and isTypeAssignableTo against it is always
    // false). Its base constraint is the union of every branch
    // (string | OBJECT<{}> | undefined) — exactly the set of values the function
    // could accept here — so widen to that.
    if ((type.flags & ts.TypeFlags.Conditional) !== 0) {
        return checker.getBaseConstraintOfType(type) ?? checker.getAnyType()
    }

    if ((type.flags & ts.TypeFlags.Object) !== 0 && hasFreeTypeParam(type, checker, new Set())) {
        const aliasName: string | undefined = (type as any).aliasSymbol?.getName()
        if (aliasName) {
            const widenedSym = checker
                .getSymbolsInScope(node, ts.SymbolFlags.Variable)
                .find(s => s.getName() === `__widen_${aliasName}`)
            if (widenedSym) {
                return checker.getTypeOfSymbolAtLocation(widenedSym, node)
            }
        }
        return checker.getAnyType()
    }

    return type
}

// Returns true if type itself or any of its type arguments (direct or alias) is a
// free TypeParameter, recursing into nested generic types.
const hasFreeTypeParam = (type: ts.Type, checker: ts.TypeChecker, visited: Set<ts.Type>): boolean => {
    if (visited.has(type)) return false
    visited.add(type)
    if ((type.flags & ts.TypeFlags.TypeParameter) !== 0) return true
    if ((type.flags & ts.TypeFlags.Object) !== 0) {
        if (checker.getTypeArguments(type as ts.TypeReference).some(arg => hasFreeTypeParam(arg, checker, visited))) return true
        const aliasArgs = (type as any).aliasTypeArguments as ts.Type[] | undefined
        if (aliasArgs?.some(arg => hasFreeTypeParam(arg, checker, visited))) return true
    }
    return false
}

