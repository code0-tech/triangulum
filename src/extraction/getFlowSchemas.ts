import ts from "typescript"
import type {
    DataType,
    Flow,
    FunctionDefinition,
    InlineReferenceValue,
    LiteralValue,
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
 * in place (see {@link SchematizedSubFlowValue}) — both a parameter that is a
 * sub-flow itself and an inline sub-flow sitting in a literal's `references`.
 */
export type SchematizedFlow = Flow & SignatureSchemas

/**
 * Enriches a flow with the input and output JSON schemas of its signature and of
 * every sub-flow it contains.
 *
 * The same flow is returned back, but with two additional fields on the flow
 * itself and on every {@link SubFlowValue} it contains — whether it fills a node
 * parameter directly or is an inline reference of a literal parameter:
 * - `inputSchema` — an `object` JSON schema keyed by the signature's parameter names
 * - `outputSchema` — the JSON schema of the signature's return type
 *
 * The schemas are computed from the real signatures, resolved through the same
 * virtual TypeScript program that {@link generateFlowSourceCode} builds:
 * - For the flow, the schemas come from the flow's own `signature`, resolved at
 *   the generated `flow(<settings>)` call so the flow settings instantiate its
 *   type parameters — a generic link between input and output (as a REST flow's
 *   `<T extends TYPE>(input_schema: T, …): REST_ADAPTER_INPUT<T>`) therefore
 *   carries the shape the settings actually supply.
 * - For a sub-flow, the schemas come from the *value* generated at that argument
 *   position — the lambda `(...p) => { …body… }` emitted by
 *   {@link generateFlowSourceCode} — not from the callback parameter the
 *   surrounding function declares. The input carries the real (already
 *   instantiated) argument types the lambda receives, and the output is what the
 *   sub-flow body actually returns (e.g. via a `std::control::return` node),
 *   rather than the `void` the surrounding function merely expects.
 * - An inline sub-flow — one addressed via `${signature}` from a literal value's
 *   `references`, the only way to fill e.g. a `LIST` of sub-flows — is treated
 *   the same way: its schemas come from the expression generated at its position
 *   inside the literal, so it is contextually typed by the surrounding slot just
 *   like a sub-flow parameter. Nested literals are followed.
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
 * Alias name under which an *inline* sub-flow's input/output schema is generated.
 * An inline sub-flow lives inside a literal value's `references`, addressed via
 * `${signature}`; the `path` is the chain of signatures leading to it (longer
 * than one entry only when literals are nested), which keeps the alias stable
 * between type collection and flow re-assembly.
 */
const inlineSubFlowAlias = (
    nodeId: NodeFunction["id"],
    parameterIndex: number,
    path: string[],
    kind: "input" | "output",
): string =>
    `Node_${sanitizeId(nodeId!)}_${parameterIndex}_ref_${path
        .map(sanitizeId)
        .join("_")}_${kind}`

/**
 * Collects the flow's own input/output type expressions from its signature.
 *
 * The signature is read from the generated `flow(...)` *call* — the one
 * {@link generateFlowSourceCode} emits with the flow's settings as positional
 * arguments — rather than from the `declare function flow(...)` declaration, so
 * the settings instantiate the signature's type parameters. This is what makes a
 * generic link between input and output hold: a REST flow declared as
 * `<T extends TYPE>(input_schema: T, …): REST_ADAPTER_INPUT<T>` has its payload
 * resolved to the shape the `input_schema` setting actually carries, instead of
 * collapsing to the `TYPE` bound. The same resolution already drives the sub-flow
 * schemas (whose lambdas are contextually typed by their call), which is why they
 * reflect the settings while the flow's own schemas did not.
 *
 * Falls back to the declaration's signature when no call was generated (no flow)
 * — a flow whose settings are missing or unfilled simply leaves each type
 * parameter at its constraint. A flow without a signature contributes nothing and
 * falls back to the empty schemas.
 */
const collectFlowTypeExpressions = (
    checker: ts.TypeChecker,
    sourceFile: ts.SourceFile,
): Record<string, string> => {
    const flowDeclaration = sourceFile.statements
        .filter(ts.isFunctionDeclaration)
        .find((declaration) => declaration.name?.getText() === "flow")
    if (!flowDeclaration) return {}

    const flowCall = findFlowCallExpression(sourceFile)
    const resolvedSignature = flowCall
        ? checker.getResolvedSignature(flowCall)
        : undefined
    const flowSignature =
        resolvedSignature ?? checker.getSignatureFromDeclaration(flowDeclaration)
    if (!flowSignature) return {}

    const {input, output} = signatureToTypeExpressions(
        checker,
        flowSignature,
        flowCall ?? flowDeclaration,
    )
    return {[FLOW_INPUT_ALIAS]: input, [FLOW_OUTPUT_ALIAS]: output}
}

/**
 * Finds the generated `flow(<settings>)` call, i.e. the initializer of the
 * `const flow_<id> = flow(...)` statement. Traverses the AST because that
 * constant lives inside the generated IIFE.
 */
const findFlowCallExpression = (
    sourceFile: ts.SourceFile,
): ts.CallExpression | undefined => {
    let flowCall: ts.CallExpression | undefined

    sourceFile.forEachChild(function visit(child) {
        if (flowCall) return
        const isFlowCall =
            ts.isCallExpression(child) &&
            ts.isIdentifier(child.expression) &&
            child.expression.text === "flow"
        if (isFlowCall) {
            flowCall = child as ts.CallExpression
            return
        }
        child.forEachChild(visit)
    })

    return flowCall
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
        if (!params?.some(carriesSubFlow)) continue

        const callExpression = nodeCallExpression(constants, node)
        if (!callExpression) continue

        params.forEach((param, index) => {
            // The generated arguments are positional, so the parameter index maps
            // straight onto the call argument holding the sub-flow value(s).
            const argument = callExpression.arguments[index]
            if (!argument) return

            if (isSubFlowParameter(param)) {
                const expressions = signatureTypeExpressionsOf(checker, argument)
                if (!expressions) return
                typeExpressions[subFlowAlias(node.id, index, "input")] =
                    expressions.input
                typeExpressions[subFlowAlias(node.id, index, "output")] =
                    expressions.output
                return
            }

            // Inline sub-flows: the parameter is a literal whose `references`
            // carry sub-flows spliced into its string leaves. They are emitted
            // in the order the literal is walked, so the n-th sub-flow-shaped
            // expression inside the argument belongs to the n-th path.
            const paths = inlineSubFlowPaths(param)
            if (paths.length === 0) return

            const inlineExpressions = collectInlineSubFlowExpressions(argument)
            paths.forEach((path, position) => {
                const inlineExpression = inlineExpressions[position]
                if (!inlineExpression) return

                const expressions = signatureTypeExpressionsOf(
                    checker,
                    inlineExpression,
                )
                if (!expressions) return
                typeExpressions[
                    inlineSubFlowAlias(node.id, index, path, "input")
                ] = expressions.input
                typeExpressions[
                    inlineSubFlowAlias(node.id, index, path, "output")
                ] = expressions.output
            })
        })
    }

    return typeExpressions
}

/**
 * Resolves the input/output type expressions of a generated sub-flow value at
 * `expression` — either the lambda `(...p) => { …body… }` or, for a sub-flow that
 * directly maps a function, the `fn_…` reference itself. Returns `undefined` when
 * the expression has no call signature (an unresolved value).
 */
const signatureTypeExpressionsOf = (
    checker: ts.TypeChecker,
    expression: ts.Expression,
): {input: string; output: string} | undefined => {
    const valueSignature = checker
        .getTypeAtLocation(expression)
        .getCallSignatures()[0]
    if (!valueSignature) return undefined
    return subFlowValueToTypeExpressions(checker, valueSignature, expression)
}

/**
 * Collects, in source order, the sub-flow-shaped expressions emitted inside a
 * generated literal argument: the lambdas of inline sub-flows with their own node
 * tree, and the bare `fn_…` references of inline sub-flows that directly map a
 * function.
 *
 * Arrow functions are not descended into — a sub-flow body may itself contain
 * nodes with sub-flow parameters, and those belong to their own node, not to this
 * literal. An `fn_…` identifier in callee position is a generated node call
 * rather than a sub-flow value and is therefore skipped as well.
 */
const collectInlineSubFlowExpressions = (
    argument: ts.Expression,
): ts.Expression[] => {
    const expressions: ts.Expression[] = []

    const visit = (child: ts.Node): void => {
        if (ts.isArrowFunction(child)) {
            expressions.push(child)
            return
        }
        if (ts.isIdentifier(child) && child.text.startsWith("fn_")) {
            const parent = child.parent as ts.Node | undefined
            const isCallee =
                !!parent &&
                ts.isCallExpression(parent) &&
                parent.expression === child
            if (!isCallee) {
                expressions.push(child)
                return
            }
        }
        child.forEachChild(visit)
    }

    visit(argument)
    return expressions
}

/** Matches a `${signature}` inline-reference token inside a literal string leaf. */
const INLINE_REFERENCE_TOKEN = /\$\{([^}]+)\}/g

/**
 * Lists the paths of every inline sub-flow of a literal parameter, in the order
 * the generated code emits them.
 *
 * The literal value is walked exactly the way the code generator walks it —
 * arrays by index, objects by entry order, strings by `${signature}` token order
 * — so the n-th path lines up with the n-th sub-flow expression in the generated
 * argument. A reference to a nested literal is descended into, and its signature
 * becomes a prefix of the paths found inside it.
 */
const inlineSubFlowPaths = (
    param: NodeParameter | null | undefined,
): string[][] => {
    if (!isLiteralParameter(param)) return []

    const paths: string[][] = []
    collectInlineSubFlowPaths(param.value.value, param.value.references, [], paths)
    return paths
}

const collectInlineSubFlowPaths = (
    value: unknown,
    references: LiteralValue["references"],
    path: string[],
    paths: string[][],
): void => {
    const referenceBySignature = new Map<string, InlineReferenceValue>()
    for (const reference of references ?? []) {
        if (reference?.signature) {
            referenceBySignature.set(reference.signature, reference)
        }
    }
    if (referenceBySignature.size === 0) return

    const walk = (current: unknown): void => {
        if (typeof current === "string") {
            for (const match of current.matchAll(INLINE_REFERENCE_TOKEN)) {
                const inner = referenceBySignature.get(match[1])?.value
                if (!inner) continue
                if (inner.__typename === "SubFlowValue") {
                    paths.push([...path, match[1]])
                } else if (inner.__typename === "LiteralValue") {
                    collectInlineSubFlowPaths(
                        inner.value,
                        inner.references,
                        [...path, match[1]],
                        paths,
                    )
                }
            }
            return
        }
        if (Array.isArray(current)) {
            current.forEach((item) => walk(item))
            return
        }
        if (current !== null && typeof current === "object") {
            Object.values(current as Record<string, unknown>).forEach((item) =>
                walk(item),
            )
        }
    }

    walk(value)
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
 * Enriches every sub-flow of a single node with its generated input/output
 * schemas, leaving all other parameters untouched. This covers both a parameter
 * that *is* a {@link SubFlowValue} and the inline sub-flows nested in a literal
 * parameter's `references` (recursively through nested literals).
 */
const enrichNode = (
    node: NodeFunction,
    schemas: Record<string, JsonSchema>,
): NodeFunction => {
    const params = node.parameters?.nodes
    if (!params?.some(carriesSubFlow)) return node

    const enrichedParams = params.map((param, index) => {
        if (isSubFlowParameter(param)) {
            const value: SchematizedSubFlowValue = {
                ...param.value,
                inputSchema:
                    schemas[subFlowAlias(node.id, index, "input")] ??
                    emptyObjectSchema(),
                outputSchema:
                    schemas[subFlowAlias(node.id, index, "output")] ??
                    emptySchema(),
            }
            return {...param, value} as NodeParameter
        }

        if (!isLiteralParameter(param) || !param.value.references?.length) {
            return param
        }

        const references = enrichInlineReferences(
            param.value.references,
            node.id,
            index,
            [],
            schemas,
        )
        return {
            ...param,
            value: {...param.value, references},
        } as NodeParameter
    })

    return {...node, parameters: {...node.parameters, nodes: enrichedParams}}
}

/**
 * Enriches the inline sub-flows of a literal's `references` with their generated
 * schemas, descending into nested literals so a sub-flow at any depth is covered.
 * References that resolve to anything else are returned untouched.
 */
const enrichInlineReferences = (
    references: NonNullable<LiteralValue["references"]>,
    nodeId: NodeFunction["id"],
    parameterIndex: number,
    path: string[],
    schemas: Record<string, JsonSchema>,
): InlineReferenceValue[] =>
    references.map((reference) => {
        const inner = reference?.value
        if (!reference?.signature || !inner) return reference
        const referencePath = [...path, reference.signature]

        if (inner.__typename === "SubFlowValue") {
            const value: SchematizedSubFlowValue = {
                ...inner,
                inputSchema:
                    schemas[
                        inlineSubFlowAlias(
                            nodeId,
                            parameterIndex,
                            referencePath,
                            "input",
                        )
                    ] ?? emptyObjectSchema(),
                outputSchema:
                    schemas[
                        inlineSubFlowAlias(
                            nodeId,
                            parameterIndex,
                            referencePath,
                            "output",
                        )
                    ] ?? emptySchema(),
            }
            return {...reference, value}
        }

        if (inner.__typename === "LiteralValue" && inner.references?.length) {
            return {
                ...reference,
                value: {
                    ...inner,
                    references: enrichInlineReferences(
                        inner.references,
                        nodeId,
                        parameterIndex,
                        referencePath,
                        schemas,
                    ),
                },
            }
        }

        return reference
    })

// --- Shared helpers ---------------------------------------------------------

/** True when the parameter carries a {@link SubFlowValue}. */
const isSubFlowParameter = (
    param: NodeParameter | null | undefined,
): param is NodeParameter & {value: SubFlowValue} =>
    param?.value?.__typename === "SubFlowValue"

/** True when the parameter carries a {@link LiteralValue}. */
const isLiteralParameter = (
    param: NodeParameter | null | undefined,
): param is NodeParameter & {value: LiteralValue} =>
    param?.value?.__typename === "LiteralValue"

/**
 * True when the parameter holds any sub-flow at all — either directly, or inline
 * inside a literal's `references`.
 */
const carriesSubFlow = (param: NodeParameter | null | undefined): boolean =>
    isSubFlowParameter(param) || inlineSubFlowPaths(param).length > 0

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
