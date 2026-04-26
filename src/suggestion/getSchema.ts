import {
    DataType,
    Flow,
    FunctionDefinition,
    LiteralValue,
    NodeFunction,
    ReferencePath,
    ReferenceValue
} from "@code0-tech/sagittarius-graphql-types"
import {createCompilerHost, generateFlowSourceCode, sanitizeId} from "../utils"
import ts, {NumberLiteralType, StringLiteralType, Type} from "typescript"

interface Input {
    input?: string
    suggestions?: (NodeFunction | ReferenceValue | LiteralValue)[]
}

interface GenericInput {
    input?: "generic"
}

interface SubFlowInput {
    input?: "sub-flow"
}

interface PrimitiveInput extends Input {
    input?: "boolean" | "number" | "text" | "select"
}

interface DataInput extends Input {
    input?: "data"
    properties?: Record<string, Schema | Schema[]>
    required?: string[]
}

interface ListInput extends Input {
    input?: "list"
    items?: Schema | Schema[]
}

interface TypeInput extends Input {
    input?: "type"
    properties?: Record<string, Schema | Schema[]>
    required?: string[]
}

type Schema = PrimitiveInput | DataInput | ListInput | TypeInput | SubFlowInput | GenericInput

interface ParameterSchema {
    schema: Schema
    blockedBy?: number[]
}

export const getSchema = (
    flow: Flow,
    dataTypes: DataType[],
    functions: FunctionDefinition[],
    nodeId?: NodeFunction['id'],
    schema?: (type: ts.Type) => Schema | null
): ParameterSchema[] => {

    const sourceCode = generateFlowSourceCode(flow, functions, dataTypes)

    const fileName = "index.ts"
    const host = createCompilerHost(fileName, sourceCode)
    const sourceFile = host.getSourceFile(fileName)!
    const program = host.languageService.getProgram()!
    const checker = program.getTypeChecker()

    const node2 = flow.nodes?.nodes?.find(n => n?.id === nodeId)
    const functionId = `fn_${node2?.functionDefinition?.identifier?.replace(/::/g, '_')}`
    const realNodeId = `node_${sanitizeId(nodeId || "")}`

    const declaredFunctionsMap = new Map<string, ts.FunctionDeclaration>(
        sourceFile.statements
            .filter(ts.isFunctionDeclaration)
            .map(node => [node.name!.getText(), node])
    )

    const constantNames = new Map<string, ts.VariableDeclaration>(
        sourceFile.statements
            .flatMap(node => {
                const results: ts.VariableDeclaration[] = []

                node.forEachChild(function visitor(child) {
                    if (ts.isVariableDeclaration(child)) {
                        if ((child.parent.flags & ts.NodeFlags.Const) !== 0) {
                            results.push(child)
                        }
                    }
                    child.forEachChild(visitor)
                })

                return results
            })
            .map(decl => [decl.name.getText(), decl] as [string, ts.VariableDeclaration])
    )

    const node = constantNames.get(realNodeId)
    const funktion = declaredFunctionsMap.get(functionId)

    const nodeParameterTypes: Type[] | undefined = checker.getResolvedSignature(node?.initializer as ts.CallExpression)?.parameters.map(p => {
        return checker.getTypeOfSymbolAtLocation(p, node?.initializer as ts.CallExpression)
    })

    const funktionParameterTypes: Type[] | undefined = funktion?.parameters?.map(p => {
        const symbol = checker.getSymbolAtLocation(p.name)
        return checker.getTypeOfSymbolAtLocation(symbol!, node?.initializer as ts.CallExpression)
    })

    const combinedParameterTypes: Type[] | undefined = funktionParameterTypes?.map((p, i) => {
        const nodeType = nodeParameterTypes?.[i]
        if (!nodeType) return p

        const pSymbol = p.getSymbol()
        const nodeSymbol = nodeType.getSymbol()

        if (pSymbol && nodeSymbol && pSymbol === nodeSymbol) {
            return nodeType
        }

        if (p.isTypeParameter()) {
            const constraint = checker.getBaseConstraintOfType(p)
            if (!constraint || checker.isTypeAssignableTo(nodeType, constraint)) {
                return nodeType
            }
        }

        if (checker.isTypeAssignableTo(nodeType, p)) {
            return nodeType
        }

        return p
    })

    const generateSchema = (type: ts.Type): Schema => {

        const literalValueSuggestions = getLiteralValueSuggestions(type)
        const referenceSuggestions = getReferenceSuggestions(checker, node!, type, checker.getSymbolsInScope(node!, ts.SymbolFlags.Variable))
        const nodeSuggestions = getNodeSuggestions(checker, Array.from(declaredFunctionsMap.values()), functions, type)
        const suggestions = {
            suggestions: [...literalValueSuggestions, ...referenceSuggestions, ...nodeSuggestions],
        }

        const customSchema = schema?.(type)
        if (customSchema) return customSchema

        if (isPrimitiveLiteralUnion(type)) return {input: "select", ...suggestions}

        if (isBoolean(type)) return {input: "boolean", ...suggestions}
        if (isNumber(type)) return {input: "number", ...suggestions}
        if (isString(type)) return {input: "text", ...suggestions}

        if (isSubFlow(type)) return {input: "sub-flow", ...suggestions}

        if (isArrayType(checker, type)) {
            const itemType = checker.getTypeArguments(type as ts.TypeReference)[0]
            const itemTypes = itemType.isUnion() ? itemType.types : [itemType]
            const itemSchemas = itemTypes.map(itemType => generateSchema(itemType))

            return {
                input: "list",
                items: itemSchemas.length === 1 ? itemSchemas[0] : itemSchemas,
                ...suggestions
            }
        }

        if (
            (type.flags & ts.TypeFlags.Object) !== 0
        ) {
            const properties: Record<string, Schema | Schema[]> = {}
            const required: string[] = []

            for (const property of checker.getPropertiesOfType(type)) {
                const declaration = property.valueDeclaration ?? property.declarations?.[0]

                if (!declaration) continue

                const propertyType = checker.getTypeOfSymbolAtLocation(property, declaration)

                const isOptional =
                    (property.flags & ts.SymbolFlags.Optional) !== 0 ||
                    (
                        propertyType.isUnion() &&
                        propertyType.types.some(t => (t.flags & ts.TypeFlags.Undefined) !== 0)
                    )

                const propertyTypes = propertyType.isUnion()
                    ? propertyType.types.filter(t => (t.flags & ts.TypeFlags.Undefined) === 0)
                    : [propertyType]

                const propertySchemas = propertyTypes.map(generateSchema)

                properties[property.name] =
                    propertySchemas.length === 1 ? propertySchemas[0] : propertySchemas

                if (!isOptional) {
                    required.push(property.name)
                }
            }

            return {
                input: "data",
                properties,
                required,
                ...suggestions
            }
        }

        return {
            input: "generic"
        }
    }

    const funktionDependencies = getParameterDependencies(funktion!)

    return combinedParameterTypes?.map((value, index) => {
        return {
            schema: generateSchema(value),
            blockedBy: funktionDependencies
                .filter(dep => dep.parameterIndex === index)
                .map(dep => dep.dependsOnIndex)
        }
    }) || []
}

function getLiteralValueSuggestions(type: ts.Type): LiteralValue[] {

    if (type.isUnion()) {
        return type.types.flatMap(getLiteralValueSuggestions)
    }

    if (type.isStringLiteral()) return [{
        value: (type as StringLiteralType).value,
        __typename: "LiteralValue"
    }]

    if (type.isNumberLiteral()) return [{
        value: (type as NumberLiteralType).value.toString(),
    }]

    if ((type as any).intrinsicName === "true") return [{
        value: "true",
        __typename: "LiteralValue"
    }]

    if ((type as any).intrinsicName === "false") return [{
        value: "true",
        __typename: "LiteralValue"
    }]

    return []
}

function getNodeSuggestions(checker: ts.TypeChecker, functionDeclarations: ts.FunctionDeclaration[], functions: FunctionDefinition[], paramType: ts.Type): NodeFunction[] {

    if (isSubFlow(paramType)) return []

    return functionDeclarations.flatMap(func => {

        const signature = checker.getSignatureFromDeclaration(func)
        const returnType = checker.getReturnTypeOfSignature(signature!)

        const simplifiedReturnType = returnType.isTypeParameter()
            ? (checker.getBaseConstraintOfType(returnType) || checker.getAnyType())
            : returnType

        if (checker.isTypeAssignableTo(simplifiedReturnType, paramType)) {
            const functionName = func.name?.getText().replace("fn_", "").replace("_", "::").replace("_", "::")
            const funktion = functions.find(f => f.identifier === functionName)

            const node: NodeFunction = {
                __typename: "NodeFunction",
                id: `gid://sagittarius/NodeFunction/1`,
                functionDefinition: {
                    __typename: "FunctionDefinition",
                    id: funktion?.id,
                    identifier: funktion?.identifier,
                },
                ...((funktion?.parameterDefinitions?.nodes?.length ?? 0) > 0 ? {
                    parameters: {
                        __typename: "NodeParameterConnection",
                        nodes:
                            (funktion?.parameterDefinitions?.nodes || []).map(p => ({
                                __typename: "NodeParameter",
                                parameterDefinition: {
                                    __typename: "ParameterDefinition",
                                    id: p?.id,
                                    identifier: p?.identifier
                                },
                                value: p?.defaultValue ? {
                                    __typename: "LiteralValue",
                                    value: p.defaultValue.value
                                } : null
                            }))
                    }
                } : {}),
            }
            return node
        }
        return []
    })

}

function getReferenceSuggestions(checker: ts.TypeChecker, node: ts.VariableDeclaration, paramType: ts.Type, symbols: ts.Symbol[]): ReferenceValue[] {

    return symbols.flatMap(symbol => {
        const name = symbol.getName()

        if (!name.startsWith("node_") && !name.startsWith("p_") && !name.startsWith("flow_")) return []

        const symbolDeclaration = symbol.getDeclarations()?.[0]
        if (!symbolDeclaration) return []
        if (symbolDeclaration.getEnd() >= node.getEnd()!) return []

        const symbolType = checker.getTypeOfSymbolAtLocation(symbol, node)

        if (name.startsWith("node_")) {
            if (!((symbolType.flags & ts.TypeFlags.Void) !== 0)) {

                const nodeFunctionId = name
                    .replace("node_", "")
                    .replace(/___/g, "://")
                    .replace(/__/g, "/")
                    .replace(/_/g, "/")

                const propertyPaths = extractObjectProperties(symbolType, checker, paramType)

                return propertyPaths.flatMap(({path}) => {
                    const referenceValue: ReferenceValue = {
                        __typename: 'ReferenceValue',
                        nodeFunctionId: nodeFunctionId as any
                    }

                    if (path.length > 0) referenceValue.referencePath = path

                    return referenceValue
                })

            }
        } else if (name.startsWith("p_")) {

            const idPart = name.replace("p_", "")
            const lastUnderscoreIndex = idPart.lastIndexOf("_")
            const rawId = idPart.substring(0, lastUnderscoreIndex)
            const paramIndexFromName = parseInt(idPart.substring(lastUnderscoreIndex + 1), 10)

            const nodeFunctionId = rawId
                .replace("p_", "")
                .replace(/___/g, "://")
                .replace(/__/g, "/")
                .replace(/_/g, "/")

            if (checker.isTupleType(symbolType)) {
                const typeReference = symbolType as ts.TypeReference
                const typeArguments = checker.getTypeArguments(typeReference)

                return typeArguments.flatMap((tupleElementType, tupleIndex) => {
                    const propertyPaths = extractObjectProperties(tupleElementType, checker, paramType)

                    return propertyPaths.flatMap(({path}) => {
                        const referenceValue: ReferenceValue = {
                            __typename: 'ReferenceValue',
                            nodeFunctionId: nodeFunctionId as any,
                            parameterIndex: isNaN(paramIndexFromName) ? 0 : paramIndexFromName,
                            inputIndex: tupleIndex,
                            inputTypeIdentifier: (typeReference.target as any).labeledElementDeclarations?.[tupleIndex].name.getText()
                        }

                        if (path.length > 0) {
                            referenceValue.referencePath = path
                        }

                        return referenceValue
                    })

                })
            }

        } else if (name.startsWith("flow_")) {
            const propertyPaths = extractObjectProperties(symbolType, checker, paramType)

            return propertyPaths.flatMap(({path}) => {
                const referenceValue: ReferenceValue = {
                    __typename: 'ReferenceValue',
                    nodeFunctionId: null
                }

                if (path.length > 0) referenceValue.referencePath = path

                return referenceValue
            })
        }

        return []
    })

}

function isBoolean(type: ts.Type): boolean {
    return (
        (type.flags & ts.TypeFlags.Boolean) !== 0 ||
        (type.flags & ts.TypeFlags.BooleanLiteral) !== 0
    )
}

function isSubFlow(type: ts.Type): boolean {
    return (
        type.getCallSignatures().length > 0
    )
}

function isNumber(type: ts.Type): boolean {
    return (
        (type.flags & ts.TypeFlags.Number) !== 0 ||
        (type.flags & ts.TypeFlags.NumberLiteral) !== 0
    )
}

function isString(type: ts.Type): boolean {
    return (
        (type.flags & ts.TypeFlags.String) !== 0 ||
        (type.flags & ts.TypeFlags.StringLiteral) !== 0
    )
}

function isPrimitive(type: ts.Type): boolean {
    return isString(type) || isNumber(type) || isBoolean(type)
}

function isPrimitiveLiteralUnion(type: ts.Type): boolean {
    if (!type.isUnion()) return false
    return type.types.every(isPrimitive)
}

function isArrayType(checker: ts.TypeChecker, type: ts.Type): boolean {
    return checker.isArrayType(type) || checker.isTupleType(type)
}

function getParameterDependencies(node: ts.FunctionDeclaration) {
    const typeParamNames = node.typeParameters?.map(tp => tp.name.getText()) || []
    const usage: Record<string, number[]> = {}

    node.parameters.forEach((p, i) => {
        const text = p.type?.getText() || ""
        typeParamNames.forEach(t => {
            if (text.includes(t)) (usage[t] ??= []).push(i)
        })
    })

    return Object.values(usage)
        .filter(indices => indices.length > 1)
        .map(([first, ...rest]) => rest.map(idx => ({parameterIndex: idx, dependsOnIndex: first})))
        .flat()
}

const extractObjectProperties = (
    type: ts.Type,
    checker: ts.TypeChecker,
    expectedType: ts.Type,
    currentPath: ReferencePath[] = []
): Array<{ path: ReferencePath[], type: ts.Type }> => {
    const results: Array<{ path: ReferencePath[], type: ts.Type }> = []

    if (checker.isTypeAssignableTo(type, expectedType)) results.push({path: currentPath, type})

    if (isRealObjectType(type)) {
        const properties = type.getProperties()
        if (properties && properties.length > 0) {
            properties.forEach(property => {
                const propType = checker.getTypeOfSymbolAtLocation(property, property.valueDeclaration!)
                const propName = property.getName()
                const newPath = [...currentPath, {path: propName}]

                results.push(...extractObjectProperties(propType, checker, expectedType, newPath))
            })
        }
    }

    return results
}

const isRealObjectType = (type: ts.Type): boolean => {
    const primitiveFlags =
        ts.TypeFlags.String |
        ts.TypeFlags.Number |
        ts.TypeFlags.Boolean |
        ts.TypeFlags.Undefined |
        ts.TypeFlags.Null |
        ts.TypeFlags.BigInt |
        ts.TypeFlags.ESSymbol

    return (type.flags & primitiveFlags) === 0
}