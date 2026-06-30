import {describe, expect, it} from "vitest";
import {Flow} from "@code0-tech/sagittarius-graphql-types";
import {getSignatureSchema, getTypeSchema} from "../../src";
import {DATA_TYPES, FUNCTION_SIGNATURES} from "../data";

describe("Schema", () => {

    it('1', () => {

        const flow: Flow = {
            id: "gid://sagittarius/Flow/1",
            startingNodeId: "gid://sagittarius/NodeFunction/1",
            nodes: {
                nodes: [
                    {
                        id: "gid://sagittarius/NodeFunction/1",
                        functionDefinition: {identifier: "std::number::add"},
                        parameters: {
                            nodes: [
                                {value: {__typename: "LiteralValue", value: 1}},
                                {value: {__typename: "LiteralValue", value: 0}}
                            ]
                        },
                        nextNodeId: "gid://sagittarius/NodeFunction/2"
                    },
                    {
                        id: "gid://sagittarius/NodeFunction/2",
                        functionDefinition: {identifier: "std::list::for_each"},
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
                                        __typename: "SubFlowValue",
                                        startingNodeId: "gid://sagittarius/NodeFunction/3"
                                    }
                                }
                            ]
                        }
                    },
                    {
                        id: "gid://sagittarius/NodeFunction/3",
                        functionDefinition: {identifier: "std::number::add"},
                        parameters: {
                            nodes: [
                                {
                                    value: {
                                        __typename: "ReferenceValue",
                                        nodeFunctionId: "gid://sagittarius/NodeFunction/2",
                                        parameterIndex: 1,
                                        inputIndex: 0,
                                        referencePath: [{path: "test"}]
                                    }
                                },
                                {
                                    value: {__typename: "LiteralValue", value: 10}
                                }
                            ]
                        }
                    }
                ]
            },
            signature: "(test: HTTP_METHOD): void"
        };

        const result = getSignatureSchema(flow, DATA_TYPES, FUNCTION_SIGNATURES);

        //console.dir(result, {depth: null})
    });

    it('2', () => {

        const flow: Flow = {
            "__typename": "Flow",
            "id": "gid://sagittarius/Flow/1",
            "createdAt": "2026-06-19T15:34:11Z",
            "name": "Test_v1",
            "signature": "<T>(input_schema: TYPE<T>, httpURL: HTTP_URL, httpMethod: HTTP_METHOD): REST_ADAPTER_INPUT<T>",
            "nodes": {
                "__typename": "NodeFunctionConnection",
                "nodes": [
                    {
                        "__typename": "NodeFunction",
                        "id": "gid://sagittarius/NodeFunction/1",
                        "nextNodeId": null,
                        "createdAt": "2026-06-19T15:36:19Z",
                        "updatedAt": "2026-06-19T15:36:19Z",
                        "parameters": {
                            "__typename": "NodeParameterConnection",
                            "count": 8,
                            "nodes": [
                                {
                                    "__typename": "NodeParameter",
                                    "id": "gid://sagittarius/NodeParameter/1",
                                    "updatedAt": "2026-06-19T15:36:19Z",
                                    "createdAt": "2026-06-19T15:36:19Z",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/19",
                                        "identifier": "http_method",
                                        "createdAt": "2026-06-19T15:33:17Z",
                                        "updatedAt": "2026-06-19T15:33:17Z"
                                    },
                                    "value": {
                                        "__typename": "LiteralValue",
                                        "value": "GET"
                                    }
                                },
                                {
                                    "__typename": "NodeParameter",
                                    "id": "gid://sagittarius/NodeParameter/2",
                                    "updatedAt": "2026-06-19T15:36:19Z",
                                    "createdAt": "2026-06-19T15:36:19Z",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/20",
                                        "identifier": "url",
                                        "createdAt": "2026-06-19T15:33:17Z",
                                        "updatedAt": "2026-06-19T15:33:17Z"
                                    },
                                    "value": {
                                        "__typename": "LiteralValue",
                                        "value": "/test"
                                    }
                                },
                                {
                                    "__typename": "NodeParameter",
                                    "id": "gid://sagittarius/NodeParameter/3",
                                    "updatedAt": "2026-06-19T15:36:19Z",
                                    "createdAt": "2026-06-19T15:36:19Z",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/21",
                                        "identifier": "http_auth",
                                        "createdAt": "2026-06-19T15:33:17Z",
                                        "updatedAt": "2026-06-19T15:33:17Z"
                                    },
                                    "value": null
                                },
                                {
                                    "__typename": "NodeParameter",
                                    "id": "gid://sagittarius/NodeParameter/4",
                                    "updatedAt": "2026-06-19T15:37:56Z",
                                    "createdAt": "2026-06-19T15:36:19Z",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/22",
                                        "identifier": "http_auth_value",
                                        "createdAt": "2026-06-19T15:33:17Z",
                                        "updatedAt": "2026-06-19T15:33:17Z"
                                    },
                                    "value": null
                                },
                                {
                                    "__typename": "NodeParameter",
                                    "id": "gid://sagittarius/NodeParameter/5",
                                    "updatedAt": "2026-06-19T15:36:19Z",
                                    "createdAt": "2026-06-19T15:36:19Z",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/23",
                                        "identifier": "http_auth_place",
                                        "createdAt": "2026-06-19T15:33:17Z",
                                        "updatedAt": "2026-06-19T15:33:17Z"
                                    },
                                    "value": null
                                },
                                {
                                    "__typename": "NodeParameter",
                                    "id": "gid://sagittarius/NodeParameter/6",
                                    "updatedAt": "2026-06-19T15:36:19Z",
                                    "createdAt": "2026-06-19T15:36:19Z",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/24",
                                        "identifier": "http_schema",
                                        "createdAt": "2026-06-19T15:33:17Z",
                                        "updatedAt": "2026-06-19T15:33:17Z"
                                    },
                                    "value": null
                                },
                                {
                                    "__typename": "NodeParameter",
                                    "id": "gid://sagittarius/NodeParameter/7",
                                    "updatedAt": "2026-06-19T15:39:03Z",
                                    "createdAt": "2026-06-19T15:36:19Z",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/25",
                                        "identifier": "payload",
                                        "createdAt": "2026-06-19T15:33:17Z",
                                        "updatedAt": "2026-06-19T15:33:17Z"
                                    },
                                    "value": null
                                },
                                {
                                    "__typename": "NodeParameter",
                                    "id": "gid://sagittarius/NodeParameter/8",
                                    "updatedAt": "2026-06-19T15:49:12Z",
                                    "createdAt": "2026-06-19T15:36:19Z",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/26",
                                        "identifier": "headers",
                                        "createdAt": "2026-06-19T15:33:17Z",
                                        "updatedAt": "2026-06-19T15:33:17Z"
                                    },
                                    "value": null
                                }
                            ],
                            "pageInfo": {
                                "endCursor": "OA",
                                "hasNextPage": false,
                                "__typename": "PageInfo"
                            }
                        },
                        "functionDefinition": {
                            "__typename": "FunctionDefinition",
                            "id": "gid://sagittarius/FunctionDefinition/13",
                            "identifier": "http::request::send"
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
                "count": 0,
                "nodes": [],
                "pageInfo": {
                    "endCursor": null,
                    "hasNextPage": false,
                    "__typename": "PageInfo"
                }
            },
            "startingNodeId": "gid://sagittarius/NodeFunction/1",
            "type": {
                "id": "gid://sagittarius/FlowType/2",
                "__typename": "FlowType"
            },
            "executionResults": {
                "__typename": "ExecutionResultConnection",
                "count": 0,
                "nodes": [],
                "pageInfo": {
                    "endCursor": null,
                    "hasNextPage": false,
                    "__typename": "PageInfo"
                }
            },
            "disabledReason": null,
            "updatedAt": "2026-06-19T15:49:14Z",
            "userAbilities": {
                "deleteFlow": true,
                "__typename": "FlowUserAbilities"
            }
        };

        const result = getSignatureSchema(flow, DATA_TYPES, FUNCTION_SIGNATURES, "gid://sagittarius/NodeFunction/1");

        //console.dir(result, {depth: null})

    });

    it('3', () => {
        const result = getTypeSchema("{text: NUMBER, bla?: LIST<TEXT>}", DATA_TYPES);

        //console.dir(result, {depth: null})
    });

    it('merges function-typed select suggestions with concrete node value', () => {
        // http_method has function-declared type HTTP_METHOD ('GET' | 'POST' | ...).
        // Node value "GET" must not collapse the select suggestions to just ['GET'].
        const flow: Flow = {
            id: "gid://sagittarius/Flow/1",
            startingNodeId: "gid://sagittarius/NodeFunction/1",
            signature: "(): void",
            nodes: {
                nodes: [
                    {
                        id: "gid://sagittarius/NodeFunction/1",
                        functionDefinition: {identifier: "http::request::send"},
                        parameters: {
                            nodes: [
                                {value: {__typename: "LiteralValue", value: "GET"}},
                                {value: {__typename: "LiteralValue", value: "/x"}},
                                {value: null},
                                {value: null},
                                {value: null},
                                {value: null},
                                {value: null},
                                {value: null},
                            ],
                        },
                    },
                ],
            },
        };

        const [first] = getSignatureSchema(
            flow,
            DATA_TYPES,
            FUNCTION_SIGNATURES,
            "gid://sagittarius/NodeFunction/1",
        );

        expect(first.schema.input).toBe("select");
        const values = (first.schema.suggestions ?? []).map((s: any) => s.value);
        expect(values).toEqual(
            expect.arrayContaining(["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"]),
        );
    });

    it('return: ReferenceValue (payload) vs LiteralValue feeding a generic T parameter', () => {
        // Two-node flow:
        //   node 1: http::request::send → returns HTTP_RESPONSE<any> ({ payload, headers, http_status_code }).
        //   node 2: std::control::return<T>(value: T)
        // We probe node 2's parameter schema once with a ReferenceValue that pulls
        // the .payload of node 1, and once with a LiteralValue. Both feed the same
        // generic T parameter, so the schema's structural shape is driven by the
        // node side (function side is generic).
        const buildFlow = (returnValue: any): Flow => ({
            id: "gid://sagittarius/Flow/1",
            startingNodeId: "gid://sagittarius/NodeFunction/1",
            signature: "(): void",
            nodes: {
                nodes: [
                    {
                        id: "gid://sagittarius/NodeFunction/1",
                        functionDefinition: {identifier: "http::request::send"},
                        nextNodeId: "gid://sagittarius/NodeFunction/2",
                        parameters: {
                            nodes: [
                                {value: {__typename: "LiteralValue", value: "GET"}},
                                {value: {__typename: "LiteralValue", value: "/x"}},
                                {value: null},
                                {value: null},
                                {value: null},
                                {value: null},
                                {value: null},
                                {value: null},
                            ],
                        },
                    },
                    {
                        id: "gid://sagittarius/NodeFunction/2",
                        functionDefinition: {identifier: "std::control::return"},
                        parameters: {
                            nodes: [{value: returnValue}],
                        },
                    },
                ],
            },
        });

        const refFlow = buildFlow({
            __typename: "ReferenceValue",
            nodeFunctionId: "gid://sagittarius/NodeFunction/1",
            referencePath: [{path: "payload"}],
        });
        const literalFlow = buildFlow({
            __typename: "LiteralValue",
            value: "hello",
        });

        const [refResult] = getSignatureSchema(
            refFlow,
            DATA_TYPES,
            FUNCTION_SIGNATURES,
            "gid://sagittarius/NodeFunction/2",
        );
        const [literalResult] = getSignatureSchema(
            literalFlow,
            DATA_TYPES,
            FUNCTION_SIGNATURES,
            "gid://sagittarius/NodeFunction/2",
        );

        // Function side is generic for both. The node side decides the structural shape.

        // ReferenceValue → node value resolves to HTTP_RESPONSE<any>.payload = any.
        // `any` carries no structural info but its runtime shape is open — surface it
        // as a `data` schema (open object) rather than the dead-end `generic`.
        expect(refResult.schema.input).toBe("data");

        // Every reference in scope (node 1 with each of its response paths, plus
        // top-level node/flow references and zero-arg node-function nodes) is
        // assignable to `any`, so all of them must be offered as suggestions.
        const refSuggestions = (refResult.schema.suggestions ?? []) as any[];
        expect(refSuggestions.length).toBeGreaterThan(0);
        expect(
            refSuggestions.some(
                (s) =>
                    s.__typename === "ReferenceValue" &&
                    s.nodeFunctionId === "gid://sagittarius/NodeFunction/1" &&
                    Array.isArray(s.referencePath) &&
                    s.referencePath.some((p: any) => p.path === "payload"),
            ),
        ).toBe(true);
        expect(
            refSuggestions.some(
                (s) =>
                    s.__typename === "ReferenceValue" &&
                    s.nodeFunctionId === "gid://sagittarius/NodeFunction/1" &&
                    Array.isArray(s.referencePath) &&
                    s.referencePath.some((p: any) => p.path === "headers"),
            ),
        ).toBe(true);
        expect(
            refSuggestions.some(
                (s) =>
                    s.__typename === "ReferenceValue" &&
                    s.nodeFunctionId === "gid://sagittarius/NodeFunction/1" &&
                    Array.isArray(s.referencePath) &&
                    s.referencePath.some((p: any) => p.path === "http_status_code"),
            ),
        ).toBe(true);

        // LiteralValue "hello" → narrows T to the string literal "hello". The node
        // schema alone would be a select with one option; the merge must demote it
        // to free-form text because the function side is generic.
        expect(literalResult.schema.input).toBe("text");

        const literalSuggestions = (literalResult.schema.suggestions ?? []) as any[];

        // Suggestions are scoped by the *function* side (T → any), not by the narrow
        // "hello" literal. Every response field of node 1 is reachable, not just the
        // payload that happens to be `any`-typed.
        for (const expectedPath of ["payload", "headers", "http_status_code"]) {
            expect(
                literalSuggestions.some(
                    (s) =>
                        s.__typename === "ReferenceValue" &&
                        s.nodeFunctionId === "gid://sagittarius/NodeFunction/1" &&
                        Array.isArray(s.referencePath) &&
                        s.referencePath.some((p: any) => p.path === expectedPath),
                ),
            ).toBe(true);
        }
    });

    it('generic function parameter gives the same suggestion set regardless of the current literal kind', () => {
        // `std::control::return<T>(value: T)` accepts anything. The set of
        // suggestions the user can pick from should not shrink just because the
        // currently-set value happens to narrow T (e.g. to `boolean`).
        const buildFlow = (returnValue: any): Flow => ({
            id: "gid://sagittarius/Flow/1",
            startingNodeId: "gid://sagittarius/NodeFunction/1",
            signature: "(): void",
            nodes: {
                nodes: [
                    {
                        id: "gid://sagittarius/NodeFunction/1",
                        functionDefinition: {identifier: "http::request::send"},
                        nextNodeId: "gid://sagittarius/NodeFunction/2",
                        parameters: {
                            nodes: [
                                {value: {__typename: "LiteralValue", value: "GET"}},
                                {value: {__typename: "LiteralValue", value: "/x"}},
                                {value: null},
                                {value: null},
                                {value: null},
                                {value: null},
                                {value: null},
                                {value: null},
                            ],
                        },
                    },
                    {
                        id: "gid://sagittarius/NodeFunction/2",
                        functionDefinition: {identifier: "std::control::return"},
                        parameters: {
                            nodes: [{value: returnValue}],
                        },
                    },
                ],
            },
        });

        const probe = (returnValue: any) => {
            const [r] = getSignatureSchema(
                buildFlow(returnValue),
                DATA_TYPES,
                FUNCTION_SIGNATURES,
                "gid://sagittarius/NodeFunction/2",
            );
            return ((r.schema.suggestions ?? []) as any[]).map((s) =>
                JSON.stringify(s),
            );
        };

        // Snapshot the set of references/node-functions surfaced for each value
        // kind. Strip literal-value suggestions because those legitimately differ
        // (the empty-object case has no literal alternative; the boolean case
        // would surface `true`/`false` via getValues of the booleans constraint).
        const onlyRefsAndNodes = (sigs: string[]) =>
            sigs.filter((s) => !s.includes('"LiteralValue"'));

        const objectSet = onlyRefsAndNodes(
            probe({__typename: "LiteralValue", value: {}}),
        );
        const boolSet = onlyRefsAndNodes(
            probe({__typename: "LiteralValue", value: true}),
        );
        const stringSet = onlyRefsAndNodes(
            probe({__typename: "LiteralValue", value: "x"}),
        );
        const numberSet = onlyRefsAndNodes(
            probe({__typename: "LiteralValue", value: 42}),
        );

        // All sets are non-empty (the function accepts anything → references in
        // scope are valid candidates) and identical to each other.
        expect(objectSet.length).toBeGreaterThan(0);
        expect(new Set(boolSet)).toEqual(new Set(objectSet));
        expect(new Set(stringSet)).toEqual(new Set(objectSet));
        expect(new Set(numberSet)).toEqual(new Set(objectSet));
    });

    it('demotes select to free-form when function parameter is generic', () => {
        // std::control::return<T>(value: T): T — function declares T, node sets a
        // string literal. Result must be text (free-form), NOT select with one option.
        const flow: Flow = {
            id: "gid://sagittarius/Flow/2",
            startingNodeId: "gid://sagittarius/NodeFunction/1",
            signature: "(): void",
            nodes: {
                nodes: [
                    {
                        id: "gid://sagittarius/NodeFunction/1",
                        functionDefinition: {identifier: "std::control::return"},
                        parameters: {
                            nodes: [
                                {value: {__typename: "LiteralValue", value: "Test"}},
                            ],
                        },
                    },
                ],
            },
        };

        const [first] = getSignatureSchema(
            flow,
            DATA_TYPES,
            FUNCTION_SIGNATURES,
            "gid://sagittarius/NodeFunction/1",
        );

        expect(first.schema.input).toBe("text");
    });

})