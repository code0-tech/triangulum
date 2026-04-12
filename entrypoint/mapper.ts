import {SingleValidationInputData} from "./readSingle";
import {
    DataType,
    Flow, FlowSetting,
    FunctionDefinition,
    NodeFunction,
    NodeParameter,
    NodeParameterValue,
    ParameterDefinition,
} from "@code0-tech/sagittarius-graphql-types";
import {
    DefinitionDataType,
    FunctionDefinition as TucanaFunctionDefinition,
    NodeFunction as TucanaNodeFunction,
    NodeParameter as TucanaNodeParameter,
    ParameterDefinition as TucanaParameterDefinition,
    FlowSetting as TucanaFlowSetting,
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
        signature: flow.signature,
        startingNodeId: gid('NodeFunction', flow.startingNodeId) as NodeFunction['id'],
        settings: {
            nodes: flow.settings.map(mapFlowSetting)
        },
        nodes: {
            nodes: flow.nodeFunctions.map(mapNodeFunction)
        }
    };
}

function mapFlowSetting(flowSetting: TucanaFlowSetting): FlowSetting {
    return {
        __typename: "FlowSetting",
        id: gid('FlowSetting', flowSetting.databaseId) as FlowSetting['id'],
        flowSettingIdentifier: flowSetting.flowSettingId,
        value: flowSetting.value ? toAllowedValue(flowSetting.value) : null,
    }
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

function mapFunctionDefinition(functionDefinition: TucanaFunctionDefinition): FunctionDefinition {
    return {
        identifier: functionDefinition.runtimeName,
        signature: functionDefinition.signature,
        parameterDefinitions: {
            nodes: functionDefinition.parameterDefinitions.map(mapParameterDefinition)
        }
    }
}

function mapParameterDefinition(parameterDefinition: TucanaParameterDefinition): ParameterDefinition {
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