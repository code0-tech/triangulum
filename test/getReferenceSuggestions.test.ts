import {describe, it} from 'vitest';
import {getReferenceSuggestions} from '../src/suggestion/getReferenceSuggestions';
import {Flow} from "@code0-tech/sagittarius-graphql-types";
import {DATA_TYPES, FUNCTION_SIGNATURES} from "./data";
import {getSchema} from "../src/suggestion/getSchema";

describe('getReferenceSuggestions', () => {
    it('sd', () => {
        const flow: Flow = {
            "__typename": "Flow",
            "id": "gid://sagittarius/Flow/1",
            "createdAt": "2026-03-17T14:02:31Z",
            "name": "Test",
            "signature": "(httpURL: HTTP_URL, httpMethod: HTTP_METHOD): REST_ADAPTER_INPUT<{}>",
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
                                            {
                                                "test": "test"
                                            }
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
                                },
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
                        "flowSettingIdentifier": "httpURL",
                        "value": ""
                    },
                    {
                        "__typename": "FlowSetting",
                        "id": "gid://sagittarius/FlowSetting/2",
                        "createdAt": "2026-03-17T14:17:48Z",
                        "updatedAt": "2026-03-17T14:17:48Z",
                        "flowSettingIdentifier": "httpMethod",
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

        const schema = getSchema(flow, DATA_TYPES, FUNCTION_SIGNATURES,  "gid://sagittarius/NodeFunction/3");

        console.dir(schema, { depth: null, colors: true });
    });

    it('2', () => {
        const flow: Flow = {
            "__typename": "Flow",
            "id": "gid://sagittarius/Flow/1",
            "createdAt": "2026-04-13T13:49:03Z",
            "name": "/test/Test",
            "signature": "(httpURL: HTTP_URL, httpMethod: HTTP_METHOD): REST_ADAPTER_INPUT<{}>",
            "nodes": {
                "__typename": "NodeFunctionConnection",
                "nodes": [
                    {
                        "__typename": "NodeFunction",
                        "id": "gid://sagittarius/NodeFunction/1",
                        "functionDefinition": {
                            "__typename": "FunctionDefinition",
                            "id": "gid://sagittarius/FunctionDefinition/42",
                            "identifier": "http::response::create"
                        },
                        "parameters": {
                            "__typename": "NodeParameterConnection",
                            "nodes": [
                                {
                                    "__typename": "NodeParameter",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/66",
                                        "identifier": "http_status_code"
                                    },
                                    "value": null
                                },
                                {
                                    "__typename": "NodeParameter",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/67",
                                        "identifier": "headers"
                                    },
                                    "value": {
                                        "__typename": "LiteralValue",
                                        "value": {}
                                    }
                                },
                                {
                                    "__typename": "NodeParameter",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/68",
                                        "identifier": "payload"
                                    },
                                    "value": null
                                }
                            ]
                        },
                        "nextNodeId": "gid://sagittarius/NodeFunction/2"
                    },
                    {
                        "__typename": "NodeFunction",
                        "id": "gid://sagittarius/NodeFunction/2",
                        "functionDefinition": {
                            "__typename": "FunctionDefinition",
                            "id": "gid://sagittarius/FunctionDefinition/114",
                            "identifier": "rest::control::respond"
                        },
                        "parameters": {
                            "__typename": "NodeParameterConnection",
                            "nodes": [
                                {
                                    "__typename": "NodeParameter",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/177",
                                        "identifier": "http_response"
                                    },
                                    "value": {
                                        "__typename": "LiteralValue",
                                        "value": {
                                            "body": null,
                                            "headers": {},
                                            "status_code": 0
                                        }
                                    }
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
                        "createdAt": "2026-04-13T13:50:15Z",
                        "updatedAt": "2026-04-13T13:50:15Z",
                        "flowSettingIdentifier": "httpURL",
                        "value": "/test"
                    },
                    {
                        "__typename": "FlowSetting",
                        "id": "gid://sagittarius/FlowSetting/2",
                        "createdAt": "2026-04-13T13:50:15Z",
                        "updatedAt": "2026-04-13T13:50:15Z",
                        "flowSettingIdentifier": "httpMethod",
                        "value": "GET"
                    }
                ],
                "pageInfo": {
                    "__typename": "PageInfo",
                    "endCursor": "Mg",
                    "hasNextPage": false
                }
            },
            "startingNodeId": "gid://sagittarius/NodeFunction/1",
            "type": {
                "__typename": "FlowType",
                "id": "gid://sagittarius/FlowType/1"
            },
            "disabledReason": null,
            "userAbilities": {
                "__typename": "FlowUserAbilities",
                "deleteFlow": true
            }
        };

        const suggestions = getReferenceSuggestions(flow, "gid://sagittarius/NodeFunction/2", 0, FUNCTION_SIGNATURES, DATA_TYPES);

        //expect(suggestions.some(s => !s.nodeFunctionId)).toBe(true);
    });
});
