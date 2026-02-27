import { describe, expect, it } from 'vitest';
import { getFlowValidation } from '../src/getFlowValidation';
import {Flow} from "@code0-tech/sagittarius-graphql-types"; // Pfad ggf. anpassen

describe('getFlowValidation - Integrationstest', () => {
    it('sollte einen komplexen Flow mit verschachtelten Scopes und Generics validieren', () => {

        const flow: Flow = {
            nodes: {
                nodes: [
                    {
                        id: "gid://sagittarius/NodeFunction/1",
                        functionDefinition: { identifier: "std::math::add" },
                        parameters: {
                            nodes: [
                                { value: { __typename: "LiteralValue", value: 1 } },
                                { value: { __typename: "LiteralValue", value: 0 } }
                            ]
                        },
                        nextNodeId: "gid://sagittarius/NodeFunction/2"
                    },
                    {
                        id: "gid://sagittarius/NodeFunction/2",
                        functionDefinition: { identifier: "std::control::for_each" },
                        parameters: {
                            nodes: [
                                {
                                    value: {
                                        __typename: "LiteralValue",
                                        value: [{test: 1}]
                                    }
                                },
                                {
                                    value: {
                                        __typename: "NodeFunctionIdWrapper",
                                        id: "gid://sagittarius/NodeFunction/3"
                                    }
                                }
                            ]
                        }
                    },
                    {
                        id: "gid://sagittarius/NodeFunction/3",
                        functionDefinition: { identifier: "std::math::add" },
                        parameters: {
                            nodes: [
                                {
                                    value: {
                                        __typename: "ReferenceValue",
                                        nodeFunctionId: "gid://sagittarius/NodeFunction/2",
                                        parameterIndex: 1,
                                        inputIndex: 0,
                                        referencePath: [{ path: "test" }]
                                    }
                                },
                                {
                                    value: { __typename: "LiteralValue", value: 10 }
                                }
                            ]
                        }
                    }
                ]
            }
        };

        const result = getFlowValidation(flow);

        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

});