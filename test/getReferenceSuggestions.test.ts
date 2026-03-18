import {describe, expect, it} from 'vitest';
import {getReferenceSuggestions} from '../src/suggestion/getReferenceSuggestions';
import {Flow} from "@code0-tech/sagittarius-graphql-types";
import {DATA_TYPES, FUNCTION_SIGNATURES} from "./data";
import {getTypesFromNode} from "../src";

const node1Id = "gid://sagittarius/NodeFunction/1" as any;
const node2Id = "gid://sagittarius/NodeFunction/2" as any;
const parentId = "gid://sagittarius/NodeFunction/10" as any;
const childId = "gid://sagittarius/NodeFunction/11" as any;

describe('getReferenceSuggestions', () => {
    it('sollte Flow Input vorschlagen, wenn der Typ passt', () => {
        const flow: Flow = {
            inputType: "NUMBER",
            nodes: {
                nodes: [
                    {
                        id: node1Id,
                        functionDefinition: {identifier: "std::number::add"},
                        parameters: {nodes: []}
                    }
                ]
            }
        };

        const suggestions = getReferenceSuggestions(flow, node1Id, "number", FUNCTION_SIGNATURES, DATA_TYPES);

        expect(suggestions.some(s => !s.nodeFunctionId)).toBe(true);
    });

    it('sollte Rückgabewerte vorheriger Nodes vorschlagen', () => {
        const flow: Flow = {
            nodes: {
                nodes: [
                    {
                        id: node1Id,
                        functionDefinition: {identifier: "std::number::add"},
                        parameters: {
                            nodes: [
                                {value: {__typename: "LiteralValue", value: 1}},
                                {value: {__typename: "LiteralValue", value: 2}}
                            ]
                        },
                        nextNodeId: node2Id
                    },
                    {
                        id: node2Id,
                        functionDefinition: {identifier: "std::number::add"},
                        parameters: {nodes: []}
                    }
                ]
            }
        };

        const suggestions = getReferenceSuggestions(flow, node2Id, "number", FUNCTION_SIGNATURES, DATA_TYPES);

        expect(suggestions.some(s => s.nodeFunctionId === node1Id)).toBe(true);
    });

    it('sollte keine Rückgabewerte von Nodes vorschlagen, die nicht im Pfad liegen', () => {
        const flow: Flow = {
            nodes: {
                nodes: [
                    {
                        id: node1Id,
                        functionDefinition: {identifier: "std::number::add"},
                        parameters: {nodes: []}
                        // node1 ist nicht mit node2 verbunden
                    },
                    {
                        id: node2Id,
                        functionDefinition: {identifier: "std::number::add"},
                        parameters: {nodes: []}
                    }
                ]
            }
        };

        const suggestions = getReferenceSuggestions(flow, node2Id, "number", FUNCTION_SIGNATURES, DATA_TYPES);

        expect(suggestions.some(s => s.nodeFunctionId === node1Id)).toBe(false);
    });

    it('sollte Scope-Inputs in verschachtelten Scopes vorschlagen (z.B. for_each)', () => {
        const flow: Flow = {
            nodes: {
                nodes: [
                    {
                        id: parentId,
                        functionDefinition: {identifier: "std::list::for_each"},
                        parameters: {
                            nodes: [
                                {value: {__typename: "LiteralValue", value: [1, 2, 3]}},
                                {value: {__typename: "NodeFunctionIdWrapper", id: childId}}
                            ]
                        }
                    },
                    {
                        id: childId,
                        functionDefinition: {identifier: "std::number::add"},
                        parameters: {nodes: []}
                    }
                ]
            }
        };

        const suggestions = getReferenceSuggestions(flow, childId, "number", FUNCTION_SIGNATURES, DATA_TYPES);

        expect(suggestions.some(s => s.nodeFunctionId === parentId && s.parameterIndex === 1 && s.inputIndex === 0)).toBe(true);
    });

    it('sollte Untereigenschaften vorschlagen (referencePath)', () => {
        const flow: Flow = {
            nodes: {
                nodes: [
                    {
                        id: node1Id,
                        functionDefinition: {identifier: "std::list::at"}, // Rückgabetyp R
                        parameters: {
                            nodes: [
                                {
                                    value: {
                                        __typename: "LiteralValue",
                                        value: [{user: {name: "Nico", age: 30}}]
                                    }
                                },
                                {value: {__typename: "LiteralValue", value: 0}}
                            ]
                        },
                        nextNodeId: node2Id
                    },
                    {
                        id: node2Id,
                        functionDefinition: {identifier: "std::number::add"},
                        parameters: {nodes: []}
                    }
                ]
            }
        };

        // Wir suchen nach einer Zahl (NUMBER)
        const suggestions = getReferenceSuggestions(flow, node2Id, "number", FUNCTION_SIGNATURES, DATA_TYPES);

        // Es sollte node1.user.age finden
        const ageSuggestion = suggestions.find(s =>
            s.nodeFunctionId === node1Id &&
            s.referencePath?.length === 2 &&
            s.referencePath[0].path === "user" &&
            s.referencePath[1].path === "age"
        );

        expect(ageSuggestion).toBeDefined();
    });

    it('sollte nur Typ-kompatible Vorschläge machen', () => {
        const flow: Flow = {
            nodes: {
                nodes: [
                    {
                        id: node1Id,
                        functionDefinition: {identifier: "std::number::add"},
                        parameters: {nodes: []},
                        nextNodeId: node2Id
                    },
                    {
                        id: node2Id,
                        functionDefinition: {identifier: "std::number::add"},
                        parameters: {nodes: []}
                    }
                ]
            }
        };

        // Wir suchen nach einem String, node1 gibt aber NUMBER zurück
        const suggestions = getReferenceSuggestions(flow, node2Id, "TEXT", FUNCTION_SIGNATURES, DATA_TYPES);

        expect(suggestions.some(s => s.nodeFunctionId === node1Id)).toBe(false);
    });

    it('sollte nur Typ-kompatible Vorschläge machen', () => {
        const flow: Flow = {
            nodes: {
                nodes: [
                    {
                        id: node1Id,
                        functionDefinition: {identifier: "std::number::add"},
                        parameters: {nodes: []},
                        nextNodeId: node2Id
                    },
                    {
                        id: node2Id,
                        functionDefinition: {identifier: "std::number::add"},
                        parameters: {nodes: []}
                    }
                ]
            }
        };

        // Wir suchen nach einem String, node1 gibt aber NUMBER zurück
        const suggestions = getReferenceSuggestions(flow, node2Id, "TEXT", FUNCTION_SIGNATURES, DATA_TYPES);

        expect(suggestions.some(s => s.nodeFunctionId === node1Id)).toBe(false);
    });

    it('sd', () => {
        const flow: Flow = {
            "__typename": "Flow",
            "id": "gid://sagittarius/Flow/1",
            "createdAt": "2026-03-17T14:02:31Z",
            "name": "Test",
            "inputType": "REST_ADAPTER_INPUT",
            "returnType": "HTTP_RESPONSE",
            "nodes": {
                "__typename": "NodeFunctionConnection",
                "nodes": [
                    {
                        "__typename": "NodeFunction",
                        "id": "gid://sagittarius/NodeFunction/3",
                        "functionDefinition": {
                            "__typename": "FunctionDefinition",
                            "id": "gid://sagittarius/FunctionDefinition/7",
                            "identifier": "std::list::for_each"
                        },
                        "parameters": {
                            "__typename": "NodeParameterConnection",
                            "nodes": [
                                {
                                    "__typename": "NodeParameter",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/10",
                                        "identifier": "list"
                                    },
                                    "value": {
                                        "__typename": "LiteralValue",
                                        "value": [
                                            1,
                                            2,
                                            3,
                                            4,
                                            5
                                        ]
                                    }
                                },
                                {
                                    "__typename": "NodeParameter",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/11",
                                        "identifier": "consumer"
                                    },
                                    "value": {
                                        "id": "gid://sagittarius/NodeFunction/4",
                                        "__typename": "NodeFunctionIdWrapper"
                                    }
                                }
                            ]
                        }
                    },
                    {
                        "__typename": "NodeFunction",
                        "id": "gid://sagittarius/NodeFunction/4",
                        "functionDefinition": {
                            "__typename": "FunctionDefinition",
                            "id": "gid://sagittarius/FunctionDefinition/112",
                            "identifier": "std::control::value"
                        },
                        "parameters": {
                            "__typename": "NodeParameterConnection",
                            "nodes": [
                                {
                                    "__typename": "NodeParameter",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/174",
                                        "identifier": "value"
                                    },
                                    "value": null
                                }
                            ]
                        }
                    }
                ]
            },
            "project": {
                "__typename": "NamespaceProject",
                "id": "gid://sagittarius/NamespaceProject/1"
            },
            "settings": {
                "__typename": "FlowSettingConnection",
                "count": 2,
                "nodes": [
                    {
                        "__typename": "FlowSetting",
                        "id": "gid://sagittarius/FlowSetting/1",
                        "createdAt": "2026-03-17T14:17:48Z",
                        "updatedAt": "2026-03-17T14:17:48Z",
                        "flowSettingIdentifier": "HTTP_METHOD",
                        "value": ""
                    },
                    {
                        "__typename": "FlowSetting",
                        "id": "gid://sagittarius/FlowSetting/2",
                        "createdAt": "2026-03-17T14:17:48Z",
                        "updatedAt": "2026-03-17T14:17:48Z",
                        "flowSettingIdentifier": "HTTP_URL",
                        "value": ""
                    }
                ],
                "pageInfo": {
                    "__typename": "PageInfo",
                    "endCursor": "Mg",
                    "hasNextPage": false
                }
            },
            "startingNodeId": "gid://sagittarius/NodeFunction/3",
            "type": {
                "__typename": "FlowType",
                "id": "gid://sagittarius/FlowType/1"
            },
            "userAbilities": {
                "__typename": "FlowUserAbilities",
                "deleteFlow": true
            }
        };

        const suggestions = getReferenceSuggestions(flow, "gid://sagittarius/NodeFunction/4", "any", FUNCTION_SIGNATURES, DATA_TYPES);

        console.log(JSON.stringify(suggestions))

        expect(suggestions.some(s => !s.nodeFunctionId)).toBe(true);
    });
});
