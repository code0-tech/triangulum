import { describe, expect, it } from 'vitest';
import { getFlowValidation } from '../src/validation/getFlowValidation';
import {Flow} from "@code0-tech/sagittarius-graphql-types"; // Pfad ggf. anpassen
import {FUNCTION_SIGNATURES, DATA_TYPES} from "./data";

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
                                        inputIndex: 0, //TODO: Das wird gerade einfach nicht berücksichtigt
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

        const result = getFlowValidation(flow, FUNCTION_SIGNATURES, DATA_TYPES);

        expect(result.isValid).toBe(true);
        expect(result.diagnostics).toHaveLength(0);
    });

    it('sollte einen komplexen Flow mit verschachtelten Scopes und Generics validieren', () => {

        const flow: Flow = {
            nodes: {
                nodes: [
                    {
                        id: "gid://sagittarius/NodeFunction/1",
                        functionDefinition: { identifier: "std::list::at" },
                        parameters: {
                            nodes: [
                                { value: null },
                                { value: { __typename: "LiteralValue", value: 0 } }
                            ]
                        },
                        nextNodeId: "gid://sagittarius/NodeFunction/2"
                    },
                    {
                        id: "gid://sagittarius/NodeFunction/2",
                        functionDefinition: { identifier: "std::math::add" },
                        parameters: {
                            nodes: [
                                {
                                    value: {
                                        __typename: "ReferenceValue",
                                        nodeFunctionId: "gid://sagittarius/NodeFunction/1"
                                    }
                                },
                                {
                                    value: null
                                }
                            ]
                        }
                    }
                ]
            }
        };

        const result = getFlowValidation(flow, FUNCTION_SIGNATURES, DATA_TYPES);

        expect(result.isValid).toBe(true);
        expect(result.diagnostics).toHaveLength(0);
    });

    it('sollte nodeId und parameterIndex in den Diagnostics zurückgeben', () => {
        const flow: Flow = {
            nodes: {
                nodes: [
                    {
                        id: "gid://sagittarius/NodeFunction/1",
                        functionDefinition: { identifier: "std::math::add" },
                        parameters: {
                            nodes: [
                                { value: { __typename: "LiteralValue", value: "not accessibility a number" } },
                                { value: { __typename: "LiteralValue", value: 10 } }
                            ]
                        }
                    }
                ]
            }
        };

        const result = getFlowValidation(flow, FUNCTION_SIGNATURES, DATA_TYPES);

        console.log(result);

        expect(result.isValid).toBe(false);
        const diagnostic = result.diagnostics.find(d => d.nodeId === "gid://sagittarius/NodeFunction/1" && d.parameterIndex === 0);
        expect(diagnostic).toBeDefined();
        expect(diagnostic?.message).toContain("number");
    });

});