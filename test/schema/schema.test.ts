import {describe, expect, it} from "vitest";
import {DataType, Flow, FunctionDefinition} from "@code0-tech/sagittarius-graphql-types";
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

        const {parameters: [first]} = getSignatureSchema(
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

        const {parameters: [refResult]} = getSignatureSchema(
            refFlow,
            DATA_TYPES,
            FUNCTION_SIGNATURES,
            "gid://sagittarius/NodeFunction/2",
        );
        const {parameters: [literalResult]} = getSignatureSchema(
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
            const {parameters: [r]} = getSignatureSchema(
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

    it('std::control::value with array literal is offered as a LIST reference in std::list::at', () => {
        // Node 1: std::control::value<T>(value: T): T receives a literal array [1, 2, 3].
        // TypeScript infers T = number[], so the node's return type is number[] (LIST<NUMBER>).
        //
        // Node 2: std::list::at<T>(list: LIST<T>, index: NUMBER): T
        // The `list` parameter expects LIST<T> (any array). number[] is assignable to
        // LIST<T> (T unconstrained → upper bound unknown → number[] ⊆ unknown[]), so
        // node 1 must appear as a ReferenceValue suggestion for the `list` parameter.
        const flow: Flow = {
            id: "gid://sagittarius/Flow/1",
            startingNodeId: "gid://sagittarius/NodeFunction/1",
            signature: "(): void",
            nodes: {
                nodes: [
                    {
                        id: "gid://sagittarius/NodeFunction/1",
                        functionDefinition: {identifier: "std::control::value"},
                        nextNodeId: "gid://sagittarius/NodeFunction/2",
                        parameters: {
                            nodes: [
                                {value: {__typename: "LiteralValue", value: [1, 2, 3]}},
                            ],
                        },
                    },
                    {
                        id: "gid://sagittarius/NodeFunction/2",
                        functionDefinition: {identifier: "std::list::at"},
                        parameters: {
                            nodes: [
                                {value: null},
                                {value: {__typename: "LiteralValue", value: 0}},
                            ],
                        },
                    },
                ],
            },
        };

        const {parameters: [listSchema]} = getSignatureSchema(
            flow,
            DATA_TYPES,
            FUNCTION_SIGNATURES,
            "gid://sagittarius/NodeFunction/2",
        );

        // The `list` parameter is of type LIST<T> → must render as a list input.
        expect(listSchema.schema.input).toBe("list");

        // Node 1 returns LIST<NUMBER>, which is assignable to LIST<T>.
        // Its return value is a direct reference (no property path).
        const suggestions = (listSchema.schema.suggestions ?? []) as any[];
        expect(suggestions.length).toBeGreaterThan(0);
        expect(
            suggestions.some(
                (s) =>
                    s.__typename === "ReferenceValue" &&
                    s.nodeFunctionId === "gid://sagittarius/NodeFunction/1" &&
                    !s.referencePath,
            ),
        ).toBe(true);
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

        const {parameters: [first]} = getSignatureSchema(
            flow,
            DATA_TYPES,
            FUNCTION_SIGNATURES,
            "gid://sagittarius/NodeFunction/1",
        );

        expect(first.schema.input).toBe("text");
    });

    it('offers a saved object as a ReferenceValue suggestion in rest::control::respond payload', () => {
        // Node 1: std::control::value<T>(value: T): T saves an object literal, so its
        //   return type is an OBJECT.
        // Node 2: rest::control::respond
        //   <S extends HTTP_SCHEMA>(http_status_code, headers: OBJECT<{}>, http_schema: S,
        //                           payload: HTTP_PAYLOAD<S>): void
        //   With http_schema = "application/json", HTTP_PAYLOAD<S> resolves to OBJECT<{}>.
        //
        // Node 1 returns an object, which is assignable to OBJECT<{}>, so node 1 must be
        // offered as a ReferenceValue suggestion for the payload parameter.
        const flow: Flow = {
            id: "gid://sagittarius/Flow/1",
            startingNodeId: "gid://sagittarius/NodeFunction/1",
            signature: "(): void",
            nodes: {
                nodes: [
                    {
                        id: "gid://sagittarius/NodeFunction/1",
                        functionDefinition: {identifier: "std::control::value"},
                        nextNodeId: "gid://sagittarius/NodeFunction/2",
                        parameters: {
                            nodes: [
                                {value: {__typename: "LiteralValue", value: {}}},
                            ],
                        },
                    },
                    {
                        id: "gid://sagittarius/NodeFunction/2",
                        functionDefinition: {identifier: "rest::control::respond"},
                        parameters: {
                            nodes: [
                                {value: {__typename: "LiteralValue", value: 200}},
                                {value: {__typename: "LiteralValue", value: {}}},
                                {value: {__typename: "LiteralValue", value: "application/json"}},
                                {value: {__typename: "LiteralValue", value: {}}},
                            ],
                        },
                    },
                ],
            },
        };

        const result = getSignatureSchema(
            flow,
            DATA_TYPES,
            FUNCTION_SIGNATURES,
            "gid://sagittarius/NodeFunction/2",
        );

        // payload is the 4th parameter of rest::control::respond.
        const payloadSchema = result.parameters[3];

        // application/json → HTTP_PAYLOAD<S> = OBJECT<{}> → open object input.
        expect(payloadSchema.schema.input).toBe("data");

        // Node 1 (std::control::value) returns an object assignable to OBJECT<{}>.
        // Its return value is a direct reference (no property path).
        const suggestions = (payloadSchema.schema.suggestions ?? []) as any[];
        expect(suggestions.length).toBeGreaterThan(0);
        expect(
            suggestions.some(
                (s) =>
                    s.__typename === "ReferenceValue" &&
                    s.nodeFunctionId === "gid://sagittarius/NodeFunction/1" &&
                    !s.referencePath,
            ),
        ).toBe(true);
    });

    it('offers a nullable TEXT return as a ReferenceValue suggestion for a plain TEXT parameter', () => {
        // Node 1: custom::text::nullable(): TEXT | null — no parameters, returns a
        //   nullable string.
        // Node 2: std::text::split(value: TEXT, delimiter: TEXT): LIST<TEXT>
        //
        // The `value` parameter is declared as plain TEXT (string). Node 1's return
        // type is string | null. Strict assignability would reject string | null → string,
        // but the editor must still offer node 1 as a ReferenceValue suggestion here:
        // the nullish part of a reference's type should be ignored for suggestion scoping.
        const NULLABLE_TEXT_FN: FunctionDefinition = {
            id: "gid://sagittarius/FunctionDefinition/9001",
            identifier: "custom::text::nullable",
            signature: "(): TEXT | null",
        };

        const flow: Flow = {
            id: "gid://sagittarius/Flow/1",
            startingNodeId: "gid://sagittarius/NodeFunction/1",
            signature: "(): void",
            nodes: {
                nodes: [
                    {
                        id: "gid://sagittarius/NodeFunction/1",
                        functionDefinition: {identifier: "custom::text::nullable"},
                        nextNodeId: "gid://sagittarius/NodeFunction/2",
                        parameters: {
                            nodes: [],
                        },
                    },
                    {
                        id: "gid://sagittarius/NodeFunction/2",
                        functionDefinition: {identifier: "std::text::split"},
                        parameters: {
                            nodes: [
                                {value: null},
                                {value: {__typename: "LiteralValue", value: ","}},
                            ],
                        },
                    },
                ],
            },
        };

        const {parameters: [valueSchema]} = getSignatureSchema(
            flow,
            DATA_TYPES,
            [...FUNCTION_SIGNATURES, NULLABLE_TEXT_FN],
            "gid://sagittarius/NodeFunction/2",
        );

        // value: TEXT → free-form text input.
        expect(valueSchema.schema.input).toBe("text");

        // Node 1 returns TEXT | null; stripping the nullish part leaves TEXT, which is
        // assignable to the TEXT parameter. Its return value is a direct reference
        // (no property path).
        const suggestions = (valueSchema.schema.suggestions ?? []) as any[];
        expect(
            suggestions.some(
                (s) =>
                    s.__typename === "ReferenceValue" &&
                    s.nodeFunctionId === "gid://sagittarius/NodeFunction/1" &&
                    !s.referencePath,
            ),
        ).toBe(true);
    });

    it('offers a nullable object property as a ReferenceValue path suggestion for a plain TEXT parameter', () => {
        // Node 1: custom::text::nullable_object(): {text?: TEXT | null} — no parameters,
        //   returns an object whose `text` property is optional and nullable.
        // Node 2: std::text::split(value: TEXT, delimiter: TEXT): LIST<TEXT>
        //
        // The `value` parameter is declared as plain TEXT (string). Node 1's `text`
        // property has type string | null | undefined. Strict assignability would
        // reject it, but the editor must still offer node 1's `text` property as a
        // ReferenceValue suggestion with referencePath [{path: "text"}]: the nullish
        // part of a reference's type should be ignored for suggestion scoping.
        const NULLABLE_OBJECT_FN: FunctionDefinition = {
            id: "gid://sagittarius/FunctionDefinition/9002",
            identifier: "custom::text::nullable_object",
            signature: "(): {text?: TEXT | null}",
        };

        const flow: Flow = {
            id: "gid://sagittarius/Flow/1",
            startingNodeId: "gid://sagittarius/NodeFunction/1",
            signature: "(): void",
            nodes: {
                nodes: [
                    {
                        id: "gid://sagittarius/NodeFunction/1",
                        functionDefinition: {identifier: "custom::text::nullable_object"},
                        nextNodeId: "gid://sagittarius/NodeFunction/2",
                        parameters: {
                            nodes: [],
                        },
                    },
                    {
                        id: "gid://sagittarius/NodeFunction/2",
                        functionDefinition: {identifier: "std::text::split"},
                        parameters: {
                            nodes: [
                                {value: null},
                                {value: {__typename: "LiteralValue", value: ","}},
                            ],
                        },
                    },
                ],
            },
        };

        const {parameters: [valueSchema]} = getSignatureSchema(
            flow,
            DATA_TYPES,
            [...FUNCTION_SIGNATURES, NULLABLE_OBJECT_FN],
            "gid://sagittarius/NodeFunction/2",
        );

        // value: TEXT → free-form text input.
        expect(valueSchema.schema.input).toBe("text");

        // Node 1's `text` property is TEXT | null | undefined; stripping the nullish
        // part leaves TEXT, which is assignable to the TEXT parameter → node 1 must
        // be offered with referencePath [{path: "text"}].
        const suggestions = (valueSchema.schema.suggestions ?? []) as any[];
        expect(
            suggestions.some(
                (s) =>
                    s.__typename === "ReferenceValue" &&
                    s.nodeFunctionId === "gid://sagittarius/NodeFunction/1" &&
                    Array.isArray(s.referencePath) &&
                    s.referencePath.length === 1 &&
                    s.referencePath[0].path === "text",
            ),
        ).toBe(true);
    });

    it('offers a nested nullable object property as a ReferenceValue path suggestion for a plain TEXT parameter', () => {
        // Node 1: custom::text::nested_nullable_object(): {test?: {bla?: TEXT | null} | null}
        //   — no parameters, returns an object whose `test` property is an optional,
        //   nullable object which itself holds an optional, nullable `bla` property.
        // Node 2: std::text::split(value: TEXT, delimiter: TEXT): LIST<TEXT>
        //
        // The `value` parameter is declared as plain TEXT (string). Node 1's `test.bla`
        // property has type string | null | undefined behind a nullable `test` object.
        // Strict assignability would reject it, but the editor must still offer node 1's
        // `test.bla` property as a ReferenceValue suggestion with referencePath
        // [{path: "test"}, {path: "bla"}]: the nullish parts along the reference chain
        // should be ignored for suggestion scoping.
        const NESTED_NULLABLE_OBJECT_FN: FunctionDefinition = {
            id: "gid://sagittarius/FunctionDefinition/9003",
            identifier: "custom::text::nested_nullable_object",
            signature: "(): {test?: {bla?: TEXT | null} | null}",
        };

        const flow: Flow = {
            id: "gid://sagittarius/Flow/1",
            startingNodeId: "gid://sagittarius/NodeFunction/1",
            signature: "(): void",
            nodes: {
                nodes: [
                    {
                        id: "gid://sagittarius/NodeFunction/1",
                        functionDefinition: {identifier: "custom::text::nested_nullable_object"},
                        nextNodeId: "gid://sagittarius/NodeFunction/2",
                        parameters: {
                            nodes: [],
                        },
                    },
                    {
                        id: "gid://sagittarius/NodeFunction/2",
                        functionDefinition: {identifier: "std::text::split"},
                        parameters: {
                            nodes: [
                                {value: null},
                                {value: {__typename: "LiteralValue", value: ","}},
                            ],
                        },
                    },
                ],
            },
        };

        const {parameters: [valueSchema]} = getSignatureSchema(
            flow,
            DATA_TYPES,
            [...FUNCTION_SIGNATURES, NESTED_NULLABLE_OBJECT_FN],
            "gid://sagittarius/NodeFunction/2",
        );

        // value: TEXT → free-form text input.
        expect(valueSchema.schema.input).toBe("text");

        // Node 1's `test.bla` property is TEXT | null | undefined nested inside the
        // nullable `test` object; stripping the nullish parts leaves TEXT, which is
        // assignable to the TEXT parameter → node 1 must be offered with
        // referencePath [{path: "test"}, {path: "bla"}].
        const suggestions = (valueSchema.schema.suggestions ?? []) as any[];
        expect(
            suggestions.some(
                (s) =>
                    s.__typename === "ReferenceValue" &&
                    s.nodeFunctionId === "gid://sagittarius/NodeFunction/1" &&
                    Array.isArray(s.referencePath) &&
                    s.referencePath.length === 2 &&
                    s.referencePath[0].path === "test" &&
                    s.referencePath[1].path === "bla",
            ),
        ).toBe(true);
    });

    it('offers all paths of a deeply nested non-recursive object as ReferenceValue suggestions', () => {
        // Node 1: custom::test::deeply_nested(): a 10-level nested object ending in TEXT.
        // Node 2: std::text::split(value: TEXT, delimiter: TEXT): LIST<TEXT>
        //
        // Reference path extraction caps traversal depth only for recursive data
        // types. A deeply nested but acyclic object must be traversed exhaustively,
        // so even the leaf 10 levels down is offered as a suggestion.
        const DEEPLY_NESTED_FN: FunctionDefinition = {
            id: "gid://sagittarius/FunctionDefinition/9004",
            identifier: "custom::test::deeply_nested",
            signature: "(): { l1: { l2: { l3: { l4: { l5: { l6: { l7: { l8: { l9: { l10: TEXT } } } } } } } } } }",
        };

        const flow: Flow = {
            id: "gid://sagittarius/Flow/1",
            startingNodeId: "gid://sagittarius/NodeFunction/1",
            signature: "(): void",
            nodes: {
                nodes: [
                    {
                        id: "gid://sagittarius/NodeFunction/1",
                        functionDefinition: {identifier: "custom::test::deeply_nested"},
                        nextNodeId: "gid://sagittarius/NodeFunction/2",
                        parameters: {
                            nodes: [],
                        },
                    },
                    {
                        id: "gid://sagittarius/NodeFunction/2",
                        functionDefinition: {identifier: "std::text::split"},
                        parameters: {
                            nodes: [
                                {value: null},
                                {value: {__typename: "LiteralValue", value: ","}},
                            ],
                        },
                    },
                ],
            },
        };

        const {parameters: [valueSchema]} = getSignatureSchema(
            flow,
            DATA_TYPES,
            [...FUNCTION_SIGNATURES, DEEPLY_NESTED_FN],
            "gid://sagittarius/NodeFunction/2",
        );

        // value: TEXT → free-form text input.
        expect(valueSchema.schema.input).toBe("text");

        const paths = ((valueSchema.schema.suggestions ?? []) as any[])
            .filter(
                (s) =>
                    s.__typename === "ReferenceValue" &&
                    s.nodeFunctionId === "gid://sagittarius/NodeFunction/1",
            )
            .map((s) => (s.referencePath ?? []).map((p: any) => p.path).join("."));

        expect(paths).toContain("l1.l2.l3.l4.l5.l6.l7.l8.l9.l10");
    });

    it('cuts cycles and depth-caps traversal of recursive data types', () => {
        // Two families of recursive data types, both returned by node 1:
        //
        // 1. A mutually recursive pair (RECURSIVE_ORDER ↔ RECURSIVE_CUSTOMER), the
        //    same shape external actions ship for entity graphs (e.g. Shopware's
        //    order → delivery → order). A branch must stop as soon as a type
        //    already on it reappears, instead of overflowing the stack.
        //
        // 2. A cycle of 8 distinct types (CHAIN_1 → … → CHAIN_8 → CHAIN_1). The
        //    per-branch cycle cut alone would allow simple paths through all 8
        //    types, so recursive types are additionally depth-capped at 7 levels.
        const RECURSIVE_DATA_TYPES = [
            {
                identifier: "RECURSIVE_ORDER",
                genericKeys: [],
                type: "{ id: TEXT; customer?: RECURSIVE_CUSTOMER | null }"
            },
            {
                identifier: "RECURSIVE_CUSTOMER",
                genericKeys: [],
                type: "{ name: TEXT; lastOrder?: RECURSIVE_ORDER | null }"
            },
            {identifier: "CHAIN_1", genericKeys: [], type: "{ value: TEXT; next?: CHAIN_2 | null }"},
            {identifier: "CHAIN_2", genericKeys: [], type: "{ value: TEXT; next?: CHAIN_3 | null }"},
            {identifier: "CHAIN_3", genericKeys: [], type: "{ value: TEXT; next?: CHAIN_4 | null }"},
            {identifier: "CHAIN_4", genericKeys: [], type: "{ value: TEXT; next?: CHAIN_5 | null }"},
            {identifier: "CHAIN_5", genericKeys: [], type: "{ value: TEXT; next?: CHAIN_6 | null }"},
            {identifier: "CHAIN_6", genericKeys: [], type: "{ value: TEXT; next?: CHAIN_7 | null }"},
            {identifier: "CHAIN_7", genericKeys: [], type: "{ value: TEXT; next?: CHAIN_8 | null }"},
            {identifier: "CHAIN_8", genericKeys: [], type: "{ value: TEXT; next?: CHAIN_1 | null }"},
        ];

        const RECURSIVE_FN: FunctionDefinition = {
            id: "gid://sagittarius/FunctionDefinition/9005",
            identifier: "custom::test::recursive",
            signature: "(): { pair: RECURSIVE_ORDER; chain: CHAIN_1 }",
        };

        const flow: Flow = {
            id: "gid://sagittarius/Flow/1",
            startingNodeId: "gid://sagittarius/NodeFunction/1",
            signature: "(): void",
            nodes: {
                nodes: [
                    {
                        id: "gid://sagittarius/NodeFunction/1",
                        functionDefinition: {identifier: "custom::test::recursive"},
                        nextNodeId: "gid://sagittarius/NodeFunction/2",
                        parameters: {
                            nodes: [],
                        },
                    },
                    {
                        id: "gid://sagittarius/NodeFunction/2",
                        functionDefinition: {identifier: "std::text::split"},
                        parameters: {
                            nodes: [
                                {value: null},
                                {value: {__typename: "LiteralValue", value: ","}},
                            ],
                        },
                    },
                ],
            },
        };

        const {parameters: [valueSchema]} = getSignatureSchema(
            flow,
            [...DATA_TYPES, ...RECURSIVE_DATA_TYPES],
            [...FUNCTION_SIGNATURES, RECURSIVE_FN],
            "gid://sagittarius/NodeFunction/2",
        );

        // value: TEXT → free-form text input.
        expect(valueSchema.schema.input).toBe("text");

        const paths = ((valueSchema.schema.suggestions ?? []) as any[])
            .filter(
                (s) =>
                    s.__typename === "ReferenceValue" &&
                    s.nodeFunctionId === "gid://sagittarius/NodeFunction/1",
            )
            .map((s) => (s.referencePath ?? []).map((p: any) => p.path).join("."));

        // Properties inside the cycle are still reachable …
        expect(paths).toContain("pair.id");
        expect(paths).toContain("pair.customer.name");
        // … but the branch stops where RECURSIVE_ORDER would reappear on it.
        expect(paths).not.toContain("pair.customer.lastOrder.id");

        // The chain is walked through distinct types up to the depth cap of 7
        // (chain + 5×next + value) …
        expect(paths).toContain("chain.next.next.next.next.next.value");
        // … and no further, even though the next type would still be new to the branch.
        expect(paths).not.toContain("chain.next.next.next.next.next.next.value");
    });

    it('unblocks std::list::push item once the list is provided, even as an empty literal', () => {
        // std::list::push → <T>(list: LIST<T>, item: T): NUMBER
        // `item` shares the type parameter T with `list`, so it starts out
        // blockedBy [0]. Providing the `list` argument satisfies that dependency,
        // so `item` becomes unblocked — an empty list literal `[]` counts as a
        // provided value just like a concrete list does.
        const buildPushFlow = (listValue: any): Flow => ({
            id: "gid://sagittarius/Flow/1",
            startingNodeId: "gid://sagittarius/NodeFunction/1",
            signature: "(): void",
            nodes: {
                nodes: [
                    {
                        id: "gid://sagittarius/NodeFunction/1",
                        functionDefinition: {identifier: "std::list::push"},
                        parameters: {
                            nodes: [
                                {value: listValue},
                                {value: null},
                            ],
                        },
                    },
                ],
            },
        });

        // With no list provided, `item` is blocked by the list parameter (index 0).
        const blockedResult = getSignatureSchema(
            buildPushFlow(null),
            DATA_TYPES,
            FUNCTION_SIGNATURES,
            "gid://sagittarius/NodeFunction/1",
        );
        expect(blockedResult.parameters[1].blockedBy).toEqual([0]);

        // Providing an empty list literal `[]` satisfies the dependency, so the
        // `item` parameter is now unblocked.
        const emptyResult = getSignatureSchema(
            buildPushFlow({__typename: "LiteralValue", value: []}),
            DATA_TYPES,
            FUNCTION_SIGNATURES,
            "gid://sagittarius/NodeFunction/1",
        );
        const [emptyList, emptyItem] = emptyResult.parameters;

        expect(emptyList.schema.input).toBe("list");
        expect(emptyList.blockedBy).toEqual([]);
        expect(emptyItem.blockedBy).toEqual([]);
    });

    it('keeps std::list::push item blocked while the list has no value', () => {
        // std::list::push → <T>(list: LIST<T>, item: T): NUMBER
        // As long as the `list` parameter (index 0) carries no value, T cannot be
        // pinned, so `item` (index 1) must stay blockedBy [0] and fall back to a
        // generic input. This holds whether the list slot is `null` or an explicit
        // null-typed value.
        const buildPushFlow = (listValue: any): Flow => ({
            id: "gid://sagittarius/Flow/1",
            startingNodeId: "gid://sagittarius/NodeFunction/1",
            signature: "(): void",
            nodes: {
                nodes: [
                    {
                        id: "gid://sagittarius/NodeFunction/1",
                        functionDefinition: {identifier: "std::list::push"},
                        parameters: {
                            nodes: [
                                {value: listValue},
                                {value: null},
                            ],
                        },
                    },
                ],
            },
        });

        // No parameter object at all for the list slot.
        const nullResult = getSignatureSchema(
            buildPushFlow(null),
            DATA_TYPES,
            FUNCTION_SIGNATURES,
            "gid://sagittarius/NodeFunction/1",
        );
        const [nullList, nullItem] = nullResult.parameters;

        // The list itself is never blocked — nothing feeds it.
        expect(nullList.blockedBy).toEqual([]);
        // item stays blocked by the list and has no concrete type yet.
        expect(nullItem.blockedBy).toEqual([0]);
        expect(nullItem.schema.input).toBe("generic");
    });

    it('keeps a later std::list::push item blocked when its list references an earlier node', () => {
        // Two-node flow. Node 1 (std::list::push) returns NUMBER. Node 2 is another
        // std::list::push whose `list` parameter is still empty, so its `item`
        // parameter must stay blockedBy [0] — an unrelated, already-configured
        // predecessor node does not pin node 2's T.
        const flow: Flow = {
            id: "gid://sagittarius/Flow/1",
            startingNodeId: "gid://sagittarius/NodeFunction/1",
            signature: "(): void",
            nodes: {
                nodes: [
                    {
                        id: "gid://sagittarius/NodeFunction/1",
                        functionDefinition: {identifier: "std::list::push"},
                        nextNodeId: "gid://sagittarius/NodeFunction/2",
                        parameters: {
                            nodes: [
                                {value: {__typename: "LiteralValue", value: [1, 2, 3]}},
                                {value: {__typename: "LiteralValue", value: 4}},
                            ],
                        },
                    },
                    {
                        id: "gid://sagittarius/NodeFunction/2",
                        functionDefinition: {identifier: "std::list::push"},
                        parameters: {
                            nodes: [
                                {value: null},
                                {value: null},
                            ],
                        },
                    },
                ],
            },
        };

        const {parameters: [list, item]} = getSignatureSchema(
            flow,
            DATA_TYPES,
            FUNCTION_SIGNATURES,
            "gid://sagittarius/NodeFunction/2",
        );

        expect(list.blockedBy).toEqual([]);
        expect(item.blockedBy).toEqual([0]);
        expect(item.schema.input).toBe("generic");
    });

    describe("return schema", () => {
        // Single-node flow calling `identifier` with the given parameters, probed at that node.
        const singleNode = (identifier: string, params: any[]): Flow => ({
            id: "gid://sagittarius/Flow/1",
            startingNodeId: "gid://sagittarius/NodeFunction/1",
            signature: "(): void",
            nodes: {
                nodes: [
                    {
                        id: "gid://sagittarius/NodeFunction/1",
                        functionDefinition: {identifier},
                        parameters: {nodes: params},
                    },
                ],
            },
        });

        const returnOf = (identifier: string, params: any[]) =>
            getSignatureSchema(
                singleNode(identifier, params),
                DATA_TYPES,
                FUNCTION_SIGNATURES,
                "gid://sagittarius/NodeFunction/1",
            ).return;

        // Asserts every schema node in the tree (root, nested properties, list
        // items) has no suggestions — a return schema describes an output, so it
        // never carries input suggestions.
        const expectNoSuggestionsAnywhere = (schema: any, path = "return"): void => {
            expect(
                schema.suggestions === undefined ||
                (Array.isArray(schema.suggestions) && schema.suggestions.length === 0),
                `${path} unexpectedly has suggestions: ${JSON.stringify(schema.suggestions)}`,
            ).toBe(true);
            for (const [key, child] of Object.entries(schema.properties ?? {})) {
                const children = Array.isArray(child) ? child : [child];
                children.forEach((c, i) =>
                    expectNoSuggestionsAnywhere(c, `${path}.properties.${key}[${i}]`),
                );
            }
            (schema.items ?? []).forEach((item: any, i: number) =>
                expectNoSuggestionsAnywhere(item, `${path}.items[${i}]`),
            );
        };

        it("resolves a NUMBER return to a number input", () => {
            // std::boolean::as_number → (value: BOOLEAN): NUMBER
            const ret = returnOf("std::boolean::as_number", [
                {value: {__typename: "LiteralValue", value: true}},
            ]);
            expect(ret).toEqual({input: "number", type: "number"});
        });

        it("resolves a TEXT return to a text input", () => {
            // std::boolean::as_text → (value: BOOLEAN): TEXT
            const ret = returnOf("std::boolean::as_text", [
                {value: {__typename: "LiteralValue", value: true}},
            ]);
            expect(ret).toEqual({input: "text", type: "string"});
        });

        it("resolves a BOOLEAN return to a boolean input", () => {
            // std::boolean::from_number → (value: NUMBER): BOOLEAN
            const ret = returnOf("std::boolean::from_number", [
                {value: {__typename: "LiteralValue", value: 1}},
            ]);
            expect(ret).toEqual({input: "boolean", type: "boolean"});
        });

        it("resolves an object return (HTTP_RESPONSE) to a data input with its properties", () => {
            // http::request::send → (...): HTTP_RESPONSE<any>
            const ret = returnOf("http::request::send", [
                {value: {__typename: "LiteralValue", value: "GET"}},
                {value: {__typename: "LiteralValue", value: "/x"}},
                {value: null},
                {value: null},
                {value: null},
                {value: null},
                {value: null},
                {value: null},
            ]);
            expect(ret.input).toBe("data");
            const dataRet = ret as { properties: Record<string, unknown>; required: string[] };
            expect(Object.keys(dataRet.properties)).toEqual(
                expect.arrayContaining(["payload", "headers", "http_status_code"]),
            );
            expect(dataRet.required).toEqual(
                expect.arrayContaining(["payload", "headers", "http_status_code"]),
            );
            // The return type describes an output, so it carries no input
            // suggestions — at any nesting level.
            expectNoSuggestionsAnywhere(ret);
        });

        it("instantiates a generic return type from the supplied arguments", () => {
            // std::list::at → <T>(list: LIST<T>, index: NUMBER): T
            // A list of numbers binds T = NUMBER, so the return is a number input.
            const ret = returnOf("std::list::at", [
                {value: {__typename: "LiteralValue", value: [10, 20, 30]}},
                {value: {__typename: "LiteralValue", value: 0}},
            ]);
            expect(ret).toEqual({input: "number", type: "number"});
        });

        it("returns a generic input for a void signature and no nodeId at the flow level", () => {
            const result = getSignatureSchema(
                singleNode("std::boolean::as_number", [
                    {value: {__typename: "LiteralValue", value: true}},
                ]),
                DATA_TYPES,
                FUNCTION_SIGNATURES,
            );
            // Flow-level probe: no target node, flow signature is `(): void`.
            expect(result.nodeId).toBeUndefined();
            expect(result.return).toEqual({input: "generic", type: "void"});
        });

        // A trigger is analyzed at the flow level (no nodeId). The flow's own
        // signature carries the return type, and its `settings` supply the
        // arguments the generic return is instantiated from. This mirrors the
        // REST trigger: <T>(input_schema: TYPE<T>, ...): REST_ADAPTER_INPUT<T>.
        const restTrigger = (inputSchema: any): Flow => ({
            id: "gid://sagittarius/Flow/1",
            startingNodeId: "gid://sagittarius/NodeFunction/1",
            signature:
                "<T>(input_schema: TYPE<T>, httpURL: HTTP_URL, httpMethod: HTTP_METHOD): REST_ADAPTER_INPUT<T>",
            settings: {
                nodes: [
                    {value: inputSchema},
                    {value: "/users"},
                    {value: "GET"},
                ],
            },
            nodes: {nodes: []},
        } as Flow);

        it("resolves a trigger's return schema at the flow level (no nodeId) from its settings", () => {
            const result = getSignatureSchema(
                restTrigger({name: "text"}),
                DATA_TYPES,
                FUNCTION_SIGNATURES,
            );

            // Flow-level probe → no target node.
            expect(result.nodeId).toBeUndefined();

            // REST_ADAPTER_INPUT<T> is an object → data input with its four fields.
            const ret = result.return as {
                input: string;
                properties: Record<string, any>;
                required: string[];
            };
            expect(ret.input).toBe("data");
            expect(Object.keys(ret.properties)).toEqual(
                expect.arrayContaining([
                    "payload",
                    "headers",
                    "query_params",
                    "path_params",
                ]),
            );
            expect(ret.required).toEqual(
                expect.arrayContaining([
                    "payload",
                    "headers",
                    "query_params",
                    "path_params",
                ]),
            );

            // T is bound from the input_schema setting ({name: TEXT}), so the
            // payload keeps that concrete shape.
            const payload = ret.properties.payload;
            expect(payload.input).toBe("data");
            expect(Object.keys(payload.properties)).toEqual(["name"]);
            expect(payload.properties.name.input).toBe("text");

            // The remaining REST fields are open objects.
            expect(ret.properties.headers.input).toBe("data");
            expect(ret.properties.query_params.input).toBe("data");
            expect(ret.properties.path_params.input).toBe("data");

            // A return type describes an output → no suggestions anywhere.
            expectNoSuggestionsAnywhere(ret);
        });

        it("instantiates the trigger's generic return payload from a primitive input_schema setting", () => {
            const result = getSignatureSchema(
                restTrigger(42),
                DATA_TYPES,
                FUNCTION_SIGNATURES,
            );

            expect(result.nodeId).toBeUndefined();

            // input_schema = 42 → T = NUMBER → payload is a number input.
            const ret = result.return as { properties: Record<string, any> };
            expect(ret.properties.payload).toEqual({input: "number", type: "number"});
            expectNoSuggestionsAnywhere(ret);
        });

        it("never carries suggestions, whatever the return type", () => {
            // Primitive, object, list and generic returns all stay suggestion-free.
            expectNoSuggestionsAnywhere(
                returnOf("std::boolean::as_number", [
                    {value: {__typename: "LiteralValue", value: true}},
                ]),
            );
            expectNoSuggestionsAnywhere(
                returnOf("std::list::at", [
                    {value: {__typename: "LiteralValue", value: [1, 2, 3]}},
                    {value: {__typename: "LiteralValue", value: 0}},
                ]),
            );
            expectNoSuggestionsAnywhere(
                returnOf("http::request::send", [
                    {value: {__typename: "LiteralValue", value: "GET"}},
                    {value: {__typename: "LiteralValue", value: "/x"}},
                    {value: null},
                    {value: null},
                    {value: null},
                    {value: null},
                    {value: null},
                    {value: null},
                ]),
            );
        });
    });

    describe("DATE data type", () => {
        // DATE is declared as `type DATE = number`, but the schema layer must
        // surface a dedicated date input instead of the number input its
        // underlying type would otherwise produce.
        it("resolves to a date input", () => {
            // `type` renders the underlying type; DATE is branded (`number & {}`)
            // so its alias survives detection, but the brand is stripped from the
            // rendered `type` (see stringifyType) → a clean "number".
            expect(getTypeSchema("DATE", DATA_TYPES)).toEqual({
                input: "date",
                type: "number",
            });
        });

        it("resolves to a date input when nested in a list and object", () => {
            const list = getTypeSchema("LIST<DATE>", DATA_TYPES) as any;
            expect(list.input).toBe("list");
            expect(list.items[0]).toEqual({input: "date", type: "number"});

            const object = getTypeSchema("{ created: DATE }", DATA_TYPES) as any;
            expect(object.input).toBe("data");
            expect(object.properties.created).toEqual({input: "date", type: "number"});
        });

        it("still resolves a plain NUMBER to a number input", () => {
            expect(getTypeSchema("NUMBER", DATA_TYPES)).toEqual({
                input: "number",
                type: "number",
            });
        });
    });

    describe("FILE data type", () => {
        // FILE is declared as `{ contentType: M; valueType: 'base64'; value: string }`,
        // and the schema layer expands those internal properties into a `data`
        // input. The `contentType` generic is surfaced as a literal-typed
        // property when it is constrained.
        it("resolves to a data input carrying the mimetype", () => {
            expect(getTypeSchema("FILE<'image/png'>", DATA_TYPES)).toEqual({
                input: "data",
                type: '{ contentType: "image/png"; fileName: string; valueType: "base64"; value: string; }',
                properties: {
                    contentType: { input: "select", type: '"image/png"' },
                    fileName: { input: "text", type: "string" },
                    valueType: { input: "select", type: '"base64"' },
                    value: { input: "text", type: "string" },
                },
                required: ["contentType", "fileName", "valueType", "value"],
            });
        });

        it("surfaces a string contentType for an unconstrained FILE", () => {
            expect(getTypeSchema("FILE<TEXT>", DATA_TYPES)).toEqual({
                input: "data",
                type: '{ contentType: string; fileName: string; valueType: "base64"; value: string; }',
                properties: {
                    contentType: { input: "text", type: "string" },
                    fileName: { input: "text", type: "string" },
                    valueType: { input: "select", type: '"base64"' },
                    value: { input: "text", type: "string" },
                },
                required: ["contentType", "fileName", "valueType", "value"],
            });
        });

        it("surfaces the raw contentType when the constraint is not a valid MIME type", () => {
            expect(getTypeSchema("FILE<'not-a-mimetype'>", DATA_TYPES)).toEqual({
                input: "data",
                type: '{ contentType: "not-a-mimetype"; fileName: string; valueType: "base64"; value: string; }',
                properties: {
                    contentType: { input: "select", type: '"not-a-mimetype"' },
                    fileName: { input: "text", type: "string" },
                    valueType: { input: "select", type: '"base64"' },
                    value: { input: "text", type: "string" },
                },
                required: ["contentType", "fileName", "valueType", "value"],
            });
        });

        it("resolves to a file input when nested in an object", () => {
            const object = getTypeSchema(
                "{ avatar: FILE<'image/png'> }",
                DATA_TYPES
            ) as any;
            expect(object.input).toBe("data");
            expect(object.properties.avatar).toEqual({
                input: "file",
                type: '{ contentType: "image/png"; fileName: string; valueType: "base64"; value: string; }',
                mimetype: "image/png",
            });
        });

        // Any array/list of FILE surfaces a dedicated multi-file input rather
        // than a generic list of file objects, and carries the same mimetype.
        it("resolves LIST<FILE> to a list-file input", () => {
            expect(getTypeSchema("LIST<FILE<'application/pdf'>>", DATA_TYPES)).toEqual({
                input: "list-file",
                type: 'FILE<"application/pdf">[]',
                mimetype: "application/pdf",
            });
        });

        it("resolves the FILE[] array form to a list-file input", () => {
            expect(getTypeSchema("FILE<'image/png'>[]", DATA_TYPES)).toEqual({
                input: "list-file",
                type: 'FILE<"image/png">[]',
                mimetype: "image/png",
            });
        });

        it("resolves the FILE[] array form to a list-file input", () => {
            expect(getTypeSchema("(FILE<'image/png'> | number)[]", DATA_TYPES)).toEqual({
                input: "list",
                items: [
                    {
                        "input": "number",
                        "type": "number",
                    },
                    {
                        "input": "file",
                        "mimetype": "image/png",
                        "type": '{ contentType: "image/png"; fileName: string; valueType: "base64"; value: string; }',
                    },
                ],
                type: '(number | FILE<"image/png">)[]'
            });
        });

        it("falls back to the wildcard mimetype for a list of unconstrained FILEs", () => {
            expect(getTypeSchema("LIST<FILE<TEXT>>", DATA_TYPES)).toEqual({
                input: "list-file",
                type: 'FILE<string>[]',
                mimetype: "*/*",
            });
        });

        it("resolves a list-file input when nested in an object", () => {
            const object = getTypeSchema(
                "{ docs: LIST<FILE<'application/pdf'>> }",
                DATA_TYPES
            ) as any;
            expect(object.input).toBe("data");
            expect(object.properties.docs).toEqual({
                input: "list-file",
                type: 'FILE<"application/pdf">[]',
                mimetype: "application/pdf",
            });
        });
    });

    describe("COLOR data type", () => {
        // COLOR is declared as
        // `{ hue: number; saturation: number; lightness: number; alpha?: number }`,
        // but the schema layer must surface a dedicated color input instead of
        // expanding those internal channels into a `data` input. Like DATE it
        // carries no additional properties.
        const COLOR_TYPE =
            "{ hue: number; saturation: number; lightness: number; alpha?: number | undefined; }";

        it("resolves to a color input", () => {
            expect(getTypeSchema("COLOR", DATA_TYPES)).toEqual({
                input: "color",
                type: COLOR_TYPE,
            });
        });

        it("resolves to a color input when nested in a list and object", () => {
            const list = getTypeSchema("LIST<COLOR>", DATA_TYPES) as any;
            expect(list.input).toBe("list");
            expect(list.items[0]).toEqual({input: "color", type: COLOR_TYPE});

            const object = getTypeSchema("{ background: COLOR }", DATA_TYPES) as any;
            expect(object.input).toBe("data");
            expect(object.properties.background).toEqual({
                input: "color",
                type: COLOR_TYPE,
            });
        });

        it("still expands a coincidental color-shaped object without the COLOR alias", () => {
            const object = getTypeSchema(
                "{ hue: number; saturation: number; lightness: number }",
                DATA_TYPES
            ) as any;
            expect(object.input).toBe("data");
            expect(object.properties.hue).toEqual({input: "number", type: "number"});
        });
    });

    describe("list-select input", () => {
        // A plain select stays a primitive input; only wrapping it in an array
        // promotes it to a dedicated list-select. Its `items` are the element
        // schemas, exactly like a generic list — one select schema per literal.
        const methodItems = [
            {input: "select", type: '"GET"'},
            {input: "select", type: '"POST"'},
            {input: "select", type: '"PUT"'},
            {input: "select", type: '"DELETE"'},
            {input: "select", type: '"PATCH"'},
            {input: "select", type: '"HEAD"'},
        ];

        it("leaves a single select as a primitive select input", () => {
            expect(getTypeSchema("HTTP_METHOD", DATA_TYPES)).toEqual({
                input: "select",
                type: '"GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD"',
            });
        });

        it("resolves a list of a select data type to a list-select carrying its item schemas", () => {
            expect(getTypeSchema("LIST<HTTP_METHOD>", DATA_TYPES)).toEqual({
                input: "list-select",
                type: "HTTP_METHOD[]",
                items: methodItems,
            });
        });

        it("resolves a list of an inline literal union to a list-select", () => {
            expect(getTypeSchema("LIST<'GET' | 'POST'>", DATA_TYPES)).toEqual({
                input: "list-select",
                type: '("GET" | "POST")[]',
                items: [
                    {input: "select", type: '"GET"'},
                    {input: "select", type: '"POST"'},
                ],
            });
        });

        it("resolves a list of a number literal union to a list-select", () => {
            expect(getTypeSchema("LIST<1 | 2 | 3>", DATA_TYPES)).toEqual({
                input: "list-select",
                type: "(1 | 2 | 3)[]",
                items: [
                    {input: "select", type: "1"},
                    {input: "select", type: "2"},
                    {input: "select", type: "3"},
                ],
            });
        });

        it("resolves a list of a single literal to a list-select", () => {
            expect(getTypeSchema("LIST<'GET'>", DATA_TYPES)).toEqual({
                input: "list-select",
                type: '"GET"[]',
                items: [{input: "select", type: '"GET"'}],
            });
        });

        it("resolves a list-select when nested in an object", () => {
            const object = getTypeSchema(
                "{ methods: LIST<HTTP_METHOD> }",
                DATA_TYPES
            ) as any;
            expect(object.input).toBe("data");
            expect(object.properties.methods).toEqual({
                input: "list-select",
                type: "HTTP_METHOD[]",
                items: methodItems,
            });
        });

        it("promotes a list of booleans to list-boolean, not list-select", () => {
            expect(getTypeSchema("LIST<boolean>", DATA_TYPES)).toEqual({
                input: "list-boolean",
                type: "boolean[]",
                items: [
                    {input: "boolean", type: "false"},
                    {input: "boolean", type: "true"},
                ],
            });
        });

        // A synthetic function whose parameters/return are a concrete
        // LIST<HTTP_METHOD> — the stock signatures only expose generic LIST<T>,
        // which would never resolve to a concrete list-select.
        const pickMethods: FunctionDefinition = {
            __typename: "FunctionDefinition",
            id: "gid://sagittarius/FunctionDefinition/900",
            identifier: "test::methods::pick",
            signature:
                "(primary: LIST<HTTP_METHOD>, fallback: LIST<HTTP_METHOD>): LIST<HTTP_METHOD>",
        } as FunctionDefinition;
        const functions = [...FUNCTION_SIGNATURES, pickMethods];

        it("surfaces list-select in a signature schema with only valid reference suggestions", () => {
            // node1 returns LIST<HTTP_METHOD>; node2's first parameter references it.
            const flow: Flow = {
                id: "gid://sagittarius/Flow/1",
                startingNodeId: "gid://sagittarius/NodeFunction/1",
                signature: "(): void",
                nodes: {
                    nodes: [
                        {
                            id: "gid://sagittarius/NodeFunction/1",
                            functionDefinition: {identifier: "test::methods::pick"},
                            nextNodeId: "gid://sagittarius/NodeFunction/2",
                            parameters: {nodes: [{value: null}, {value: null}]},
                        },
                        {
                            id: "gid://sagittarius/NodeFunction/2",
                            functionDefinition: {identifier: "test::methods::pick"},
                            parameters: {
                                nodes: [
                                    {
                                        value: {
                                            __typename: "ReferenceValue",
                                            nodeFunctionId: "gid://sagittarius/NodeFunction/1",
                                        },
                                    },
                                    {value: null},
                                ],
                            },
                        },
                    ],
                },
            } as unknown as Flow;

            const {parameters: [first]} = getSignatureSchema(
                flow,
                DATA_TYPES,
                functions,
                "gid://sagittarius/NodeFunction/2",
            );

            expect(first.schema.input).toBe("list-select");
            expect((first.schema as any).items).toEqual(methodItems);

            // The only suggestion is the in-scope reference to node1, whose
            // return type (LIST<HTTP_METHOD>) matches the parameter. No stray
            // single-method / cross-type suggestions leak in.
            expect(first.schema.suggestions).toEqual([
                {
                    __typename: "ReferenceValue",
                    nodeFunctionId: "gid://sagittarius/NodeFunction/1",
                },
            ]);
        });

        it("keeps the full items and stays a list-select when a value is provided", () => {
            // A provided literal array must not collapse the options to just the
            // supplied values — the function-declared type stays the source of truth.
            const flow: Flow = {
                id: "gid://sagittarius/Flow/1",
                startingNodeId: "gid://sagittarius/NodeFunction/1",
                signature: "(): void",
                nodes: {
                    nodes: [
                        {
                            id: "gid://sagittarius/NodeFunction/1",
                            functionDefinition: {identifier: "test::methods::pick"},
                            parameters: {
                                nodes: [
                                    {value: {__typename: "LiteralValue", value: ["GET", "POST"]}},
                                    {value: null},
                                ],
                            },
                        },
                    ],
                },
            } as unknown as Flow;

            const {parameters: [first]} = getSignatureSchema(
                flow,
                DATA_TYPES,
                functions,
                "gid://sagittarius/NodeFunction/1",
            );

            expect(first.schema.input).toBe("list-select");
            expect((first.schema as any).items).toEqual(methodItems);
            expect(first.schema.suggestions).toBeUndefined();
        });
    });

    describe("list-boolean / list-number / list-text inputs", () => {
        // A homogeneous list of a plain primitive surfaces a dedicated
        // multi-<primitive> input. Like list-select (and a generic list) these
        // carry the element schemas in `items` — one primitive schema per element.
        // A boolean element normalizes to the `false | true` union, which — like
        // any union element — splits into one schema per member.
        const booleanItems = [
            {input: "boolean", type: "false"},
            {input: "boolean", type: "true"},
        ];
        const numberItems = [{input: "number", type: "number"}];
        const textItems = [{input: "text", type: "string"}];

        it("resolves LIST<BOOLEAN> to list-boolean", () => {
            expect(getTypeSchema("LIST<BOOLEAN>", DATA_TYPES)).toEqual({
                input: "list-boolean",
                type: "boolean[]",
                items: booleanItems,
            });
        });

        it("resolves LIST<NUMBER> to list-number", () => {
            expect(getTypeSchema("LIST<NUMBER>", DATA_TYPES)).toEqual({
                input: "list-number",
                type: "number[]",
                items: numberItems,
            });
        });

        it("resolves the number[] array form to list-number", () => {
            expect(getTypeSchema("number[]", DATA_TYPES)).toEqual({
                input: "list-number",
                type: "number[]",
                items: numberItems,
            });
        });

        it("resolves LIST<TEXT> to list-text", () => {
            expect(getTypeSchema("LIST<TEXT>", DATA_TYPES)).toEqual({
                input: "list-text",
                type: "string[]",
                items: textItems,
            });
        });

        it("resolves the primitive list inputs when nested in an object", () => {
            const object = getTypeSchema(
                "{ tags: LIST<TEXT>, counts: LIST<NUMBER>, flags: LIST<BOOLEAN> }",
                DATA_TYPES,
            ) as any;
            expect(object.input).toBe("data");
            expect(object.properties).toEqual({
                tags: {input: "list-text", type: "string[]", items: textItems},
                counts: {input: "list-number", type: "number[]", items: numberItems},
                flags: {input: "list-boolean", type: "boolean[]", items: booleanItems},
            });
        });

        it("only promotes the inner list of LIST<LIST<TEXT>>, outer stays a generic list", () => {
            const outer = getTypeSchema("LIST<LIST<TEXT>>", DATA_TYPES) as any;
            expect(outer.input).toBe("list");
            expect(outer.items).toEqual([{input: "list-text", type: "string[]", items: textItems}]);
        });

        // Custom-input elements must not be swallowed by the primitive promotion:
        // DATE (number underneath) and COLOR (object) keep their per-item schema.
        it("does not promote LIST<DATE> or LIST<COLOR> to a primitive list input", () => {
            const dateList = getTypeSchema("LIST<DATE>", DATA_TYPES) as any;
            expect(dateList.input).toBe("list");
            expect(dateList.items[0].input).toBe("date");

            const colorList = getTypeSchema("LIST<COLOR>", DATA_TYPES) as any;
            expect(colorList.input).toBe("list");
            expect(colorList.items[0].input).toBe("color");
        });
    });

    describe("union-typed property (string | nested object) reference suggestions", () => {
        // A custom datatype that is an object. One of its keys, `flexible`, is a
        // union of a plain string (TEXT) or a nested object. The nested object in
        // turn has a `deep` key of type string (TEXT).
        //
        //   type UNION_HOLDER = { flexible: TEXT | { deep: TEXT } }
        //
        // A custom function returns this datatype, and a downstream node uses
        // std::text::split whose `value` parameter is a plain TEXT (string).
        //
        // Question under test: when offering reference suggestions for that string
        // parameter, does the engine suggest
        //   (a) node1.flexible          — because the union branch could be a string
        //   (b) node1.flexible.deep     — the string key inside the nested-object branch
        const UNION_HOLDER_DATATYPE: DataType = {
            __typename: "DataType",
            id: "gid://sagittarius/DataType/9100",
            identifier: "UNION_HOLDER",
            genericKeys: [],
            type: "{ flexible: TEXT | { deep: TEXT } }",
        } as unknown as DataType;

        const UNION_HOLDER_FN: FunctionDefinition = {
            id: "gid://sagittarius/FunctionDefinition/9100",
            identifier: "custom::union::produce",
            signature: "(): UNION_HOLDER",
        } as FunctionDefinition;

        const buildFlow = (): Flow => ({
            id: "gid://sagittarius/Flow/1",
            startingNodeId: "gid://sagittarius/NodeFunction/1",
            signature: "(): void",
            nodes: {
                nodes: [
                    {
                        id: "gid://sagittarius/NodeFunction/1",
                        functionDefinition: {identifier: "custom::union::produce"},
                        nextNodeId: "gid://sagittarius/NodeFunction/2",
                        parameters: {nodes: []},
                    },
                    {
                        id: "gid://sagittarius/NodeFunction/2",
                        functionDefinition: {identifier: "std::text::split"},
                        parameters: {
                            nodes: [
                                {value: null},
                                {value: {__typename: "LiteralValue", value: ","}},
                            ],
                        },
                    },
                ],
            },
        });

        const getValueSuggestions = (): any[] => {
            const {parameters: [valueSchema]} = getSignatureSchema(
                buildFlow(),
                [...DATA_TYPES, UNION_HOLDER_DATATYPE],
                [...FUNCTION_SIGNATURES, UNION_HOLDER_FN],
                "gid://sagittarius/NodeFunction/2",
            );

            // value: TEXT → free-form text input.
            expect(valueSchema.schema.input).toBe("text");

            return (valueSchema.schema.suggestions ?? []) as any[];
        };

        const hasReferencePath = (suggestions: any[], path: string[]): boolean =>
            suggestions.some(
                (s) =>
                    s.__typename === "ReferenceValue" &&
                    s.nodeFunctionId === "gid://sagittarius/NodeFunction/1" &&
                    Array.isArray(s.referencePath) &&
                    s.referencePath.length === path.length &&
                    s.referencePath.every((p: any, i: number) => p.path === path[i]),
            );

        it("suggests the union key itself, since one branch is a string", () => {
            const suggestions = getValueSuggestions();

            // `flexible` is `TEXT | { deep: TEXT }`. Because one branch of the union
            // is a string, `node1.flexible` should be offered as a candidate for the
            // string `value` parameter.
            expect(hasReferencePath(suggestions, ["flexible"])).toBe(true);
        });

        it("suggests a string key nested inside the union's object branch", () => {
            const suggestions = getValueSuggestions();

            // The nested-object branch of `flexible` has a string key `deep`. It
            // should be reachable as `node1.flexible.deep` for the string parameter.
            expect(hasReferencePath(suggestions, ["flexible", "deep"])).toBe(true);
        });
    });

})