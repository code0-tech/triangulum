import ts from "typescript"
import type {
    DataType,
    Flow,
    FunctionDefinition,
    NodeFunction,
    NodeParameter,
    SubFlowValue,
} from "@code0-tech/sagittarius-graphql-types"
import {createCompilerHost, generateFlowSourceCode, sanitizeId} from "../utils"
import {generateJsonSchemas} from "../util/jsonSchema.util"
import type {JsonSchema} from "../util/jsonSchema.util"

/**
 * The input/output JSON schemas computed for a callable signature.
 *
 * Both are derived from the *real* signature — the flow's own signature for the
 * flow, or the generated lambda value (`(...p) => { …body… }`) for a sub-flow.
 *
 * `inputSchema` is an `object` schema whose `properties` hold one entry per
 * signature parameter, keyed by the parameter name (non-optional parameters are
 * listed in `required`). `outputSchema` describes the return type.
 */
export interface SignatureSchemas {
    /** Object schema whose properties are the signature's parameters, by name. */
    inputSchema: JsonSchema
    /** JSON schema describing the signature's return type. */
    outputSchema: JsonSchema
}

/** A {@link SubFlowValue} enriched with its computed input/output schemas. */
export type SchematizedSubFlowValue = SubFlowValue & SignatureSchemas

/**
 * A {@link Flow} enriched with the input/output schemas of its own signature.
 * Every {@link SubFlowValue} nested in a node parameter is additionally enriched
 * in place (see {@link SchematizedSubFlowValue}).
 */
export type SchematizedFlow = Flow & SignatureSchemas

/**
 * Enriches a flow with the input and output JSON schemas of its signature and of
 * every sub-flow it contains.
 *
 * The same flow is returned back, but with two additional fields on the flow
 * itself and on every {@link SubFlowValue} that appears as a node parameter:
 * - `inputSchema` — an `object` JSON schema keyed by the signature's parameter names
 * - `outputSchema` — the JSON schema of the signature's return type
 *
 * The schemas are computed from the real signatures, resolved through the same
 * virtual TypeScript program that {@link generateFlowSourceCode} builds:
 * - For the flow, the schemas come from the flow's own `signature`.
 * - For a sub-flow, the schemas come from the *value* generated at that argument
 *   position — the lambda `(...p) => { …body… }` emitted by
 *   {@link generateFlowSourceCode} — not from the callback parameter the
 *   surrounding function declares. The input carries the real (already
 *   instantiated) argument types the lambda receives, and the output is what the
 *   sub-flow body actually returns (e.g. via a `std::control::return` node),
 *   rather than the `void` the surrounding function merely expects.
 *
 * The actual JSON Schema generation is delegated to `ts-json-schema-generator`
 * (see {@link generateJsonSchemas}); this function only resolves the real
 * TypeScript type of each parameter/return and hands it over as a type
 * expression.
 *
 * @param flow - The flow to enrich; returned unchanged when undefined
 * @param functions - Available function definitions (drive the generated code)
 * @param dataTypes - Available data type definitions (drive the type aliases)
 * @returns The same flow, enriched with input/output schemas, or `undefined`
 *          when no flow was supplied
 */
export const getFlowSchemas = (
    flow?: Flow,
    functions?: FunctionDefinition[],
    dataTypes?: DataType[],
): SchematizedFlow | undefined => {
    if (!flow) return undefined

    const fileName = "index.ts"
    const sourceCode = generateFlowSourceCode(flow, functions, dataTypes)
    const host = createCompilerHost(fileName, sourceCode)
    const sourceFile = host.getSourceFile(fileName)!
    const checker = host.languageService.getProgram()!.getTypeChecker()

    // Collect every input/output type as a named TypeScript type expression,
    // then generate all JSON schemas in a single pass.
    const typeExpressions = {
        ...collectFlowTypeExpressions(checker, sourceFile),
        ...collectSubFlowTypeExpressions(checker, sourceFile, flow),
    }
    const schemas = generateJsonSchemas(typeExpressions, dataTypes)

    const nodes = (flow.nodes?.nodes ?? []).map((node) =>
        node ? enrichNode(node, schemas) : node,
    )

    return {
        ...flow,
        inputSchema: schemas[FLOW_INPUT_ALIAS] ?? emptyObjectSchema(),
        outputSchema: schemas[FLOW_OUTPUT_ALIAS] ?? emptySchema(),
        nodes: {...flow.nodes, nodes},
    } as SchematizedFlow
}

// --- Type-expression collection ---------------------------------------------

/** Alias names under which the flow's own input/output schemas are generated. */
const FLOW_INPUT_ALIAS = "Flow_input"
const FLOW_OUTPUT_ALIAS = "Flow_output"

/**
 * Alias name under which a sub-flow's input/output schema is generated, derived
 * deterministically from the node and parameter the sub-flow lives at.
 */
const subFlowAlias = (
    nodeId: NodeFunction["id"],
    parameterIndex: number,
    kind: "input" | "output",
): string => `Node_${sanitizeId(nodeId!)}_${parameterIndex}_${kind}`

/**
 * Collects the flow's own input/output type expressions from its declared
 * signature (`declare function flow(...): ...` in the generated source). A flow
 * without a signature contributes nothing and falls back to the empty schemas.
 */
const collectFlowTypeExpressions = (
    checker: ts.TypeChecker,
    sourceFile: ts.SourceFile,
): Record<string, string> => {
    const flowDeclaration = sourceFile.statements
        .filter(ts.isFunctionDeclaration)
        .find((declaration) => declaration.name?.getText() === "flow")
    if (!flowDeclaration) return {}

    const flowSignature = checker.getSignatureFromDeclaration(flowDeclaration)
    if (!flowSignature) return {}

    const {input, output} = signatureToTypeExpressions(
        checker,
        flowSignature,
        flowDeclaration,
    )
    return {[FLOW_INPUT_ALIAS]: input, [FLOW_OUTPUT_ALIAS]: output}
}

/**
 * Collects the input/output type expressions of every sub-flow parameter in the
 * flow. The schema is read from the *value* generated for the sub-flow — i.e. the
 * lambda `(...p) => { …body… }` that {@link generateFlowSourceCode} emits at that
 * argument position — not from the callback *parameter* the surrounding function
 * declares. This way the output reflects what the sub-flow body actually returns
 * (e.g. a `std::control::return` node), rather than the `void` the function
 * merely expects, while the input still carries the real argument types (generics
 * are already instantiated because the lambda is contextually typed by the call).
 */
const collectSubFlowTypeExpressions = (
    checker: ts.TypeChecker,
    sourceFile: ts.SourceFile,
    flow: Flow,
): Record<string, string> => {
    const constants = collectConstantDeclarations(sourceFile)
    const typeExpressions: Record<string, string> = {}

    for (const node of flow.nodes?.nodes ?? []) {
        if (!node?.id) continue
        const params = node.parameters?.nodes
        if (!params?.some(isSubFlowParameter)) continue

        const callExpression = nodeCallExpression(constants, node)
        if (!callExpression) continue

        params.forEach((param, index) => {
            if (!isSubFlowParameter(param)) return

            // The generated arguments are positional, so the parameter index maps
            // straight onto the call argument holding the sub-flow lambda value.
            const argument = callExpression.arguments[index]
            const valueSignature = argument
                ? checker.getTypeAtLocation(argument).getCallSignatures()[0]
                : undefined
            if (!valueSignature) return

            const {input, output} = subFlowValueToTypeExpressions(
                checker,
                valueSignature,
                argument!,
            )
            typeExpressions[subFlowAlias(node.id, index, "input")] = input
            typeExpressions[subFlowAlias(node.id, index, "output")] = output
        })
    }

    return typeExpressions
}

/**
 * Turns the call signature of a generated sub-flow lambda into a pair of type
 * expressions. The lambda is emitted with a single rest parameter (`(...p) => …`)
 * whose contextually-inferred type is a labelled tuple of the callback arguments;
 * that tuple is expanded so the input object is keyed by the argument names (e.g.
 * `item`) instead of the synthetic rest name. The output is the signature's
 * return type — the value the sub-flow body actually yields.
 */
const subFlowValueToTypeExpressions = (
    checker: ts.TypeChecker,
    signature: ts.Signature,
    location: ts.Node,
): {input: string; output: string} => {
    const printType = (type: ts.Type): string =>
        checker.typeToString(type, location, ts.TypeFormatFlags.NoTruncation)

    const members = subFlowInputMembers(checker, signature, location)

    return {
        input: `{ ${members.join("; ")} }`,
        output: printType(checker.getReturnTypeOfSignature(signature)),
    }
}

/**
 * Builds the input members for a sub-flow lambda. Expands the single rest tuple
 * parameter into one member per labelled element; falls back to the raw signature
 * parameters when the parameter is not a tuple (e.g. an unresolved `any[]`).
 */
const subFlowInputMembers = (
    checker: ts.TypeChecker,
    signature: ts.Signature,
    location: ts.Node,
): string[] => {
    const printType = (type: ts.Type): string =>
        checker.typeToString(type, location, ts.TypeFormatFlags.NoTruncation)

    const parameters = signature.getParameters()
    if (parameters.length === 1) {
        const restType = checker.getTypeOfSymbolAtLocation(
            parameters[0],
            parameters[0].valueDeclaration ?? location,
        )
        const tupleMembers = expandTupleMembers(checker, restType, location)
        if (tupleMembers) return tupleMembers
    }

    return parameters.map((parameterSymbol) => {
        const parameterType = checker.getTypeOfSymbolAtLocation(
            parameterSymbol,
            parameterSymbol.valueDeclaration ?? location,
        )
        const optional = isOptionalParameter(parameterSymbol) ? "?" : ""
        return `${parameterSymbol.getName()}${optional}: ${printType(parameterType)}`
    })
}

/**
 * Expands a labelled tuple type into one member expression per element, keyed by
 * the element label (falling back to `arg<i>` for unlabelled elements). Returns
 * `undefined` when the type is not a tuple.
 */
const expandTupleMembers = (
    checker: ts.TypeChecker,
    type: ts.Type,
    location: ts.Node,
): string[] | undefined => {
    const reference = type as ts.TypeReference
    const target = reference.target as ts.TupleType | undefined
    if (!target || (target.objectFlags & ts.ObjectFlags.Tuple) === 0) {
        return undefined
    }

    const elementTypes = checker.getTypeArguments(reference)
    return elementTypes.map((elementType, index) => {
        const declaration = target.labeledElementDeclarations?.[index]
        const name =
            declaration?.name && ts.isIdentifier(declaration.name)
                ? declaration.name.text
                : `arg${index}`
        const optional =
            (target.elementFlags[index] & ts.ElementFlags.Optional) !== 0
                ? "?"
                : ""
        return `${name}${optional}: ${checker.typeToString(
            elementType,
            location,
            ts.TypeFormatFlags.NoTruncation,
        )}`
    })
}

/**
 * Turns a call signature into a pair of TypeScript type expressions: an object
 * type whose members are the signature's parameters keyed by name (parameters
 * with `?`, a default, or a rest are marked optional), and the return type. Both
 * are printed straight from the resolved types so the JSON Schema generator can
 * consume them.
 */
const signatureToTypeExpressions = (
    checker: ts.TypeChecker,
    signature: ts.Signature,
    location: ts.Node,
): {input: string; output: string} => {
    const printType = (type: ts.Type): string =>
        checker.typeToString(type, location, ts.TypeFormatFlags.NoTruncation)

    const members = signature.parameters.map((parameterSymbol) => {
        const parameterType = checker.getTypeOfSymbolAtLocation(
            parameterSymbol,
            parameterSymbol.valueDeclaration ?? location,
        )
        const optional = isOptionalParameter(parameterSymbol) ? "?" : ""
        return `${parameterSymbol.getName()}${optional}: ${printType(parameterType)}`
    })

    return {
        input: `{ ${members.join("; ")} }`,
        output: printType(checker.getReturnTypeOfSignature(signature)),
    }
}

// --- Flow re-assembly -------------------------------------------------------

/** Fallback input schema (an object with no parameters) for an unresolved signature. */
const emptyObjectSchema = (): JsonSchema => ({type: "object"})

/** Fallback output schema (no constraint) for an unresolved signature. */
const emptySchema = (): JsonSchema => ({})

/**
 * Enriches every SubFlowValue parameter of a single node with its generated
 * input/output schemas, leaving all other parameters untouched.
 */
const enrichNode = (
    node: NodeFunction,
    schemas: Record<string, JsonSchema>,
): NodeFunction => {
    const params = node.parameters?.nodes
    if (!params?.some(isSubFlowParameter)) return node

    const enrichedParams = params.map((param, index) => {
        if (!isSubFlowParameter(param)) return param

        const value: SchematizedSubFlowValue = {
            ...param.value,
            inputSchema:
                schemas[subFlowAlias(node.id, index, "input")] ??
                emptyObjectSchema(),
            outputSchema:
                schemas[subFlowAlias(node.id, index, "output")] ?? emptySchema(),
        }
        return {...param, value} as NodeParameter
    })

    return {...node, parameters: {...node.parameters, nodes: enrichedParams}}
}

// --- Shared helpers ---------------------------------------------------------

/** True when the parameter carries a {@link SubFlowValue}. */
const isSubFlowParameter = (
    param: NodeParameter | null | undefined,
): param is NodeParameter & {value: SubFlowValue} =>
    param?.value?.__typename === "SubFlowValue"

/** True when a parameter is optional (`?`), has a default, or is a rest param. */
const isOptionalParameter = (parameterSymbol: ts.Symbol): boolean => {
    const declaration = parameterSymbol.valueDeclaration
    return (
        !!declaration &&
        ts.isParameter(declaration) &&
        (!!declaration.questionToken ||
            !!declaration.initializer ||
            !!declaration.dotDotDotToken)
    )
}

/**
 * Returns the call expression of a node, if any. The node is generated as
 * `const node_<id> = fn_...(arg0, arg1, ...)`; its resolved signature yields the
 * concrete (instantiated) parameter types, including each sub-flow callback.
 */
const nodeCallExpression = (
    constants: Map<string, ts.VariableDeclaration>,
    node: NodeFunction,
): ts.CallExpression | undefined => {
    const initializer = constants.get(`node_${sanitizeId(node.id!)}`)?.initializer
    return initializer && ts.isCallExpression(initializer) ? initializer : undefined
}

/**
 * Collects all `const` variable declarations in the source file, keyed by name.
 * Recursively traverses the AST since node constants live inside the generated
 * IIFE.
 */
const collectConstantDeclarations = (
    sourceFile: ts.SourceFile,
): Map<string, ts.VariableDeclaration> => {
    const constants = new Map<string, ts.VariableDeclaration>()

    sourceFile.statements.forEach((statement) => {
        statement.forEachChild(function visit(child) {
            const isConstDeclaration =
                ts.isVariableDeclaration(child) &&
                (child.parent.flags & ts.NodeFlags.Const) !== 0
            if (isConstDeclaration) {
                constants.set(child.name.getText(), child)
            }
            child.forEachChild(visit)
        })
    })

    return constants
}
