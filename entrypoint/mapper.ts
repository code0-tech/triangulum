import {SingleValidationInputData} from "./readSingle";
import {
    DataType,
    Flow,
    FunctionDefinition,
    LiteralValue,
    NodeFunction,
    NodeParameter,
    NodeParameterValue, ParameterDefinition,
} from "@code0-tech/sagittarius-graphql-types";
import {
    DefinitionDataType,
    NodeFunction as TucanaNodeFunction,
    NodeParameter as TucanaNodeParameter, RuntimeFunctionDefinition, RuntimeParameterDefinition,
    ValidationFlow,
} from "@code0-tech/tucana/shared";
import {toAllowedValue} from "@code0-tech/tucana/helpers";

export type TriangulumFlowValidationInput = {
    flow?: Flow,
    functions?: FunctionDefinition[],
    dataTypes?: DataType[]
}

export function mapToFlowValidation(data: SingleValidationInputData): TriangulumFlowValidationInput {
    return {
        flow: mapFlow(data.flow!),
        functions: data.functions.map(mapFunctionDefinition),
        dataTypes: data.dataTypes.map(mapDataType)
    }
}

function gid(type: string, id: bigint | number) {
    return `gid://sagittarius/${type}/${Number(id)}`;
}

function mapFlow(flow: ValidationFlow): Flow {
    return {
        __typename: "Flow",
        id: gid('Flow', flow.flowId) as Flow['id'],
        inputType: flow.inputType,
        returnType: flow.returnType,
        startingNodeId: gid('NodeFunction', flow.startingNodeId) as NodeFunction['id'],
        nodes: {
            nodes: flow.nodeFunctions.map(mapNodeFunction)
        }
    };
}

function mapNodeFunction(nodeFunction: TucanaNodeFunction): NodeFunction {
    return {
        id: gid('NodeFunction', nodeFunction.databaseId) as NodeFunction['id'],
        functionDefinition: {
            identifier: nodeFunction.runtimeFunctionId
        },
        nextNodeId: nodeFunction.nextNodeId ? gid('NodeFunction', nodeFunction.nextNodeId) as NodeFunction['id'] : undefined,
        parameters: {
            nodes: nodeFunction.parameters.map(mapNodeParameter)
        }
    }
}

function mapNodeParameter(nodeParameter: TucanaNodeParameter): NodeParameter {
    let value: NodeParameterValue = {}
    const nodeParameterValue = nodeParameter.value?.value

    if (nodeParameterValue?.oneofKind === 'literalValue') {
        value = {
            __typename: 'LiteralValue',
            value: toAllowedValue(nodeParameterValue.literalValue)
        };
    } else if (nodeParameterValue?.oneofKind === 'referenceValue') {
        const target = nodeParameterValue.referenceValue.target;

        value = {
            __typename: 'ReferenceValue',
            referencePath: nodeParameterValue.referenceValue.paths.map(p => ({
                __typename: 'ReferencePath',
                path: p.path,
                arrayIndex: Number(p.arrayIndex)
            }))
        }

        if (target.oneofKind === 'nodeId') {
            value.nodeFunctionId = gid('NodeFunction', target.nodeId) as NodeFunction['id']
        } else if (target.oneofKind === 'inputType') {
            value.nodeFunctionId = gid('NodeFunction', target.inputType.nodeId) as NodeFunction['id']
            value.parameterIndex = Number(target.inputType.parameterIndex)
            value.inputIndex = Number(target.inputType.inputIndex)
        }
    } else if (nodeParameterValue?.oneofKind === 'nodeFunctionId') {
        value = {
            __typename: 'NodeFunctionIdWrapper',
            id: gid('NodeFunction', nodeParameterValue.nodeFunctionId) as NodeFunction['id']
        }
    }

    return {
        id: gid('NodeParameter', nodeParameter.databaseId) as NodeParameter['id'],
        value
    }
}

function mapFunctionDefinition(functionDefinition: RuntimeFunctionDefinition): FunctionDefinition {
    return {
        identifier: functionDefinition.runtimeName,
        signature: functionDefinition.signature,
        parameterDefinitions: {
            nodes: functionDefinition.runtimeParameterDefinitions.map(mapParameterDefinition)
        }
    }
}

function mapParameterDefinition(parameterDefinition: RuntimeParameterDefinition): ParameterDefinition {
    return {
        identifier: parameterDefinition.runtimeName,
    }
}

function mapDataType(dataType: DefinitionDataType): DataType {
    return {
        identifier: dataType.identifier,
        type: dataType.type,
        genericKeys: dataType.genericKeys
    };
}