import {describe, expect, it} from 'vitest';
import {getReferenceSuggestions} from '../src/suggestion/getReferenceSuggestions';
import {Flow} from "@code0-tech/sagittarius-graphql-types";
import {DATA_TYPES, FUNCTION_SIGNATURES} from "./data";

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
                        functionDefinition: {identifier: "std::math::add"},
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
                        functionDefinition: {identifier: "std::math::add"},
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
                        functionDefinition: {identifier: "std::math::add"},
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
                        functionDefinition: {identifier: "std::math::add"},
                        parameters: {nodes: []}
                        // node1 ist nicht mit node2 verbunden
                    },
                    {
                        id: node2Id,
                        functionDefinition: {identifier: "std::math::add"},
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
                        functionDefinition: {identifier: "std::control::for_each"},
                        parameters: {
                            nodes: [
                                {value: {__typename: "LiteralValue", value: [1, 2, 3]}},
                                {value: {__typename: "NodeFunctionIdWrapper", id: childId}}
                            ]
                        }
                    },
                    {
                        id: childId,
                        functionDefinition: {identifier: "std::math::add"},
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
                        functionDefinition: {identifier: "std::math::add"},
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
                        functionDefinition: {identifier: "std::math::add"},
                        parameters: {nodes: []},
                        nextNodeId: node2Id
                    },
                    {
                        id: node2Id,
                        functionDefinition: {identifier: "std::math::add"},
                        parameters: {nodes: []}
                    }
                ]
            }
        };

        // Wir suchen nach einem String, node1 gibt aber NUMBER zurück
        const suggestions = getReferenceSuggestions(flow, node2Id, "string", FUNCTION_SIGNATURES, DATA_TYPES);

        expect(suggestions.some(s => s.nodeFunctionId === node1Id)).toBe(false);
    });
});
