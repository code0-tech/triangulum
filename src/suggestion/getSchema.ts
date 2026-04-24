import {
    DataType,
    Flow,
    FunctionDefinition,
    LiteralValue,
    NodeFunction,
    ReferenceValue
} from "@code0-tech/sagittarius-graphql-types"
import {createCompilerHost, generateFlowSourceCode, sanitizeId} from "../utils"
import ts, {NumberLiteralType, StringLiteralType, Type} from "typescript"

export interface TemporaryLiteralValue extends LiteralValue {
    references?: Record<string, ReferenceValue>
}

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
    nodeId?: NodeFunction['id']
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
        return checker.getTypeOfSymbolAtLocation(symbol!, funktion)
    })

    const combinedParameterTypes: Type[] | undefined = funktionParameterTypes?.map((p, i) => {
        const nodeType = nodeParameterTypes?.[i];
        if (!nodeType) return p;

        const pSymbol = p.getSymbol();
        const nodeSymbol = nodeType.getSymbol();

        if (pSymbol && nodeSymbol && pSymbol === nodeSymbol) {
            return nodeType;
        }

        if (p.isTypeParameter()) {
            const constraint = checker.getBaseConstraintOfType(p);
            if (!constraint || checker.isTypeAssignableTo(nodeType, constraint)) {
                return nodeType;
            }
        }

        if (checker.isTypeAssignableTo(nodeType, p)) {
            return nodeType;
        }

        return p;
    })

    const generateSchema = (type: ts.Type): Schema => {

        const literalValueSuggestions = getLiteralValueSuggestions(type)
        const suggestions = {
            suggestions: [...literalValueSuggestions]
        }

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
    const typeParamNames = node.typeParameters?.map(tp => tp.name.getText()) || [];
    const usage: Record<string, number[]> = {};

    node.parameters.forEach((p, i) => {
        const text = p.type?.getText() || "";
        typeParamNames.forEach(t => {
            if (text.includes(t)) (usage[t] ??= []).push(i);
        });
    });

    return Object.values(usage)
        .filter(indices => indices.length > 1)
        .map(([first, ...rest]) => rest.map(idx => ({parameterIndex: idx, dependsOnIndex: first})))
        .flat();
}