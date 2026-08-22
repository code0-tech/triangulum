import {SingleValidationInputData} from "./readSingle";
import {
    DataType,
    Flow, FlowSetting,
    FunctionDefinition,
    NodeFunction,
    NodeParameter,
    NodeParameterValue,
    ParameterDefinition,
    SubFlowValue,
    SubFlowValueSetting,
} from "@code0-tech/sagittarius-graphql-types";
import {
    DefinitionDataType,
    FunctionDefinition as TucanaFunctionDefinition,
    NodeFunction as TucanaNodeFunction,
    NodeParameter as TucanaNodeParameter,
    ParameterDefinition as TucanaParameterDefinition,
    FlowSetting as TucanaFlowSetting,
    ValidationFlow,
    SubFlow as TucanaSubFlow,
    SubFlowSetting as TucanaSubFlowSetting,
    NodeValue as TucanaNodeValue,
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
        id: gid('FlowSetting', flowSetting.databaseId!) as FlowSetting['id'],
        flowSettingIdentifier: flowSetting.flowSettingId,
        value: flowSetting.value ? toAllowedValue(flowSetting.value) : null,
    }
}

function mapNodeFunction(nodeFunction: TucanaNodeFunction): NodeFunction {
    return {
        id: gid('NodeFunction', nodeFunction.databaseId!) as NodeFunction['id'],
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
    const value = mapNodeValue(nodeParameter.value!);

    return {
        id: gid('NodeParameter', nodeParameter.databaseId) as NodeParameter['id'],
        value
    }
}

function mapNodeValue(tucanaNodeValue: TucanaNodeValue): NodeParameterValue {
    let value: NodeParameterValue = {}
    const nodeValue = tucanaNodeValue.value

    if (nodeValue?.oneofKind === 'literalValue') {
        value = {
            __typename: 'LiteralValue',
            value: toAllowedValue(nodeValue.literalValue.value!),
            references: nodeValue.literalValue.references.map(r => ({
                signature: r.signature,
                value: mapNodeValue(r.value!)
            }))

        };
    } else if (nodeValue?.oneofKind === 'referenceValue') {
        const target = nodeValue.referenceValue.target;

        value = {
            __typename: 'ReferenceValue',
            referencePath: nodeValue.referenceValue.paths.map(p => ({
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
    } else if (nodeValue?.oneofKind === 'subFlow') {
        value = mapSubFlow(nodeValue.subFlow);
    }

    return value;
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

function mapSubFlow(subFlow: TucanaSubFlow): SubFlowValue {
    const value: SubFlowValue = {
        __typename: 'SubFlowValue',
        signature: subFlow.signature,
        settings: subFlow.settings.map(mapSubFlowSetting)
    };

    if (subFlow.executionReference.oneofKind === 'startingNodeId') {
        value.startingNodeId = gid('NodeFunction', subFlow.executionReference.startingNodeId) as NodeFunction['id'];
    } else if (subFlow.executionReference.oneofKind === 'function') {
        value.functionDefinition = {
            identifier: subFlow.executionReference.function.functionIdentifier,
        } as FunctionDefinition;
    }

    return value;
}

function mapSubFlowSetting(setting: TucanaSubFlowSetting): SubFlowValueSetting {
    return {
        __typename: 'SubFlowValueSetting',
        identifier: setting.identifier,
        defaultValue: setting.defaultValue ? toAllowedValue(setting.defaultValue) : null,
        optional: setting.optional,
        hidden: setting.hidden
    };
}

function mapDataType(dataType: DefinitionDataType): DataType {
    return {
        identifier: dataType.identifier,
        type: dataType.type,
        genericKeys: dataType.genericKeys
    };
}