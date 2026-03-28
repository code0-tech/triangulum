import {describe, expect, it} from 'vitest';
import {getReferenceSuggestions} from '../src/suggestion/getReferenceSuggestions';
import {Flow} from "@code0-tech/sagittarius-graphql-types";
import {DATA_TYPES, FUNCTION_SIGNATURES} from "./data";

describe('getReferenceSuggestions', () => {
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

        const suggestions = getReferenceSuggestions(flow, "gid://sagittarius/NodeFunction/4", 0, FUNCTION_SIGNATURES, DATA_TYPES);

        console.log(suggestions)

        //expect(suggestions.some(s => !s.nodeFunctionId)).toBe(true);
    });

    it('2', () => {
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
                        "id": "gid://sagittarius/NodeFunction/17",
                        "nextNodeId": "gid://sagittarius/NodeFunction/30",
                        "createdAt": "2026-03-17T20:07:44Z",
                        "updatedAt": "2026-03-18T17:13:53Z",
                        "parameters": {
                            "__typename": "NodeParameterConnection",
                            "count": 2,
                            "nodes": [
                                {
                                    "__typename": "NodeParameter",
                                    "id": "gid://sagittarius/NodeParameter/86",
                                    "updatedAt": "2026-03-18T17:13:53Z",
                                    "createdAt": "2026-03-17T20:07:44Z",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/10",
                                        "identifier": "list",
                                        "createdAt": "2026-03-17T14:01:53Z",
                                        "updatedAt": "2026-03-17T14:01:53Z"
                                    },
                                    "value": {
                                        "__typename": "NodeFunctionIdWrapper",
                                        "id": "gid://sagittarius/NodeFunction/33"
                                    }
                                },
                                {
                                    "__typename": "NodeParameter",
                                    "id": "gid://sagittarius/NodeParameter/142",
                                    "updatedAt": "2026-03-18T17:13:53Z",
                                    "createdAt": "2026-03-18T17:13:53Z",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/11",
                                        "identifier": "consumer",
                                        "createdAt": "2026-03-17T14:01:53Z",
                                        "updatedAt": "2026-03-17T14:01:53Z"
                                    },
                                    "value": {
                                        "id": "gid://sagittarius/NodeFunction/36",
                                        "__typename": "NodeFunctionIdWrapper"
                                    }
                                }
                            ],
                            "pageInfo": {
                                "__typename": "PageInfo",
                                "endCursor": "MTQy",
                                "hasNextPage": false
                            }
                        },
                        "functionDefinition": {
                            "__typename": "FunctionDefinition",
                            "id": "gid://sagittarius/FunctionDefinition/7",
                            "identifier": "std::list::for_each"
                        }
                    },
                    {
                        "__typename": "NodeFunction",
                        "id": "gid://sagittarius/NodeFunction/30",
                        "nextNodeId": "gid://sagittarius/NodeFunction/35",
                        "createdAt": "2026-03-17T23:02:00Z",
                        "updatedAt": "2026-03-18T17:17:22Z",
                        "parameters": {
                            "__typename": "NodeParameterConnection",
                            "count": 1,
                            "nodes": [
                                {
                                    "__typename": "NodeParameter",
                                    "id": "gid://sagittarius/NodeParameter/136",
                                    "updatedAt": "2026-03-18T17:13:53Z",
                                    "createdAt": "2026-03-17T23:02:00Z",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/117",
                                        "identifier": "value",
                                        "createdAt": "2026-03-17T14:01:55Z",
                                        "updatedAt": "2026-03-17T14:01:55Z"
                                    },
                                    "value": {
                                        "__typename": "NodeFunctionIdWrapper",
                                        "id": "gid://sagittarius/NodeFunction/34"
                                    }
                                }
                            ],
                            "pageInfo": {
                                "__typename": "PageInfo",
                                "endCursor": "MTM2",
                                "hasNextPage": false
                            }
                        },
                        "functionDefinition": {
                            "__typename": "FunctionDefinition",
                            "id": "gid://sagittarius/FunctionDefinition/77",
                            "identifier": "std::boolean::as_number"
                        }
                    },
                    {
                        "__typename": "NodeFunction",
                        "id": "gid://sagittarius/NodeFunction/32",
                        "nextNodeId": null,
                        "createdAt": "2026-03-18T14:48:01Z",
                        "updatedAt": "2026-03-18T17:13:53Z",
                        "parameters": {
                            "__typename": "NodeParameterConnection",
                            "count": 1,
                            "nodes": [
                                {
                                    "__typename": "NodeParameter",
                                    "id": "gid://sagittarius/NodeParameter/140",
                                    "updatedAt": "2026-03-18T17:13:53Z",
                                    "createdAt": "2026-03-18T14:48:01Z",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/113",
                                        "identifier": "value",
                                        "createdAt": "2026-03-17T14:01:55Z",
                                        "updatedAt": "2026-03-17T14:01:55Z"
                                    },
                                    "value": null
                                }
                            ],
                            "pageInfo": {
                                "__typename": "PageInfo",
                                "endCursor": "MTQw",
                                "hasNextPage": false
                            }
                        },
                        "functionDefinition": {
                            "__typename": "FunctionDefinition",
                            "id": "gid://sagittarius/FunctionDefinition/74",
                            "identifier": "std::boolean::from_number"
                        }
                    },
                    {
                        "__typename": "NodeFunction",
                        "id": "gid://sagittarius/NodeFunction/33",
                        "nextNodeId": null,
                        "createdAt": "2026-03-18T14:53:02Z",
                        "updatedAt": "2026-03-18T17:13:53Z",
                        "parameters": {
                            "__typename": "NodeParameterConnection",
                            "count": 1,
                            "nodes": [
                                {
                                    "__typename": "NodeParameter",
                                    "id": "gid://sagittarius/NodeParameter/141",
                                    "updatedAt": "2026-03-18T17:13:53Z",
                                    "createdAt": "2026-03-18T14:53:02Z",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/170",
                                        "identifier": "value",
                                        "createdAt": "2026-03-17T14:01:56Z",
                                        "updatedAt": "2026-03-17T14:01:56Z"
                                    },
                                    "value": {
                                        "__typename": "LiteralValue",
                                        "value": [
                                            1,
                                            2
                                        ]
                                    }
                                }
                            ],
                            "pageInfo": {
                                "__typename": "PageInfo",
                                "endCursor": "MTQx",
                                "hasNextPage": false
                            }
                        },
                        "functionDefinition": {
                            "__typename": "FunctionDefinition",
                            "id": "gid://sagittarius/FunctionDefinition/109",
                            "identifier": "std::control::return"
                        }
                    },
                    {
                        "__typename": "NodeFunction",
                        "id": "gid://sagittarius/NodeFunction/34",
                        "nextNodeId": null,
                        "createdAt": "2026-03-18T17:13:53Z",
                        "updatedAt": "2026-03-18T17:13:53Z",
                        "parameters": {
                            "__typename": "NodeParameterConnection",
                            "count": 2,
                            "nodes": [
                                {
                                    "__typename": "NodeParameter",
                                    "id": "gid://sagittarius/NodeParameter/143",
                                    "updatedAt": "2026-03-18T17:15:02Z",
                                    "createdAt": "2026-03-18T17:13:53Z",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/99",
                                        "identifier": "object",
                                        "createdAt": "2026-03-17T14:01:55Z",
                                        "updatedAt": "2026-03-17T14:01:55Z"
                                    },
                                    "value": {
                                        "__typename": "LiteralValue",
                                        "value": {
                                            "test": true
                                        }
                                    }
                                },
                                {
                                    "__typename": "NodeParameter",
                                    "id": "gid://sagittarius/NodeParameter/144",
                                    "updatedAt": "2026-03-18T17:16:16Z",
                                    "createdAt": "2026-03-18T17:13:53Z",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/100",
                                        "identifier": "key",
                                        "createdAt": "2026-03-17T14:01:55Z",
                                        "updatedAt": "2026-03-17T14:01:55Z"
                                    },
                                    "value": {
                                        "__typename": "LiteralValue",
                                        "value": "test"
                                    }
                                }
                            ],
                            "pageInfo": {
                                "__typename": "PageInfo",
                                "endCursor": "MTQ0",
                                "hasNextPage": false
                            }
                        },
                        "functionDefinition": {
                            "__typename": "FunctionDefinition",
                            "id": "gid://sagittarius/FunctionDefinition/68",
                            "identifier": "std::object::get"
                        }
                    },
                    {
                        "__typename": "NodeFunction",
                        "id": "gid://sagittarius/NodeFunction/35",
                        "nextNodeId": null,
                        "createdAt": "2026-03-18T17:17:22Z",
                        "updatedAt": "2026-03-18T17:17:22Z",
                        "parameters": {
                            "__typename": "NodeParameterConnection",
                            "count": 2,
                            "nodes": [
                                {
                                    "__typename": "NodeParameter",
                                    "id": "gid://sagittarius/NodeParameter/145",
                                    "updatedAt": "2026-03-18T17:17:22Z",
                                    "createdAt": "2026-03-18T17:17:22Z",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/175",
                                        "identifier": "condition",
                                        "createdAt": "2026-03-17T14:01:56Z",
                                        "updatedAt": "2026-03-17T14:01:56Z"
                                    },
                                    "value": null
                                },
                                {
                                    "__typename": "NodeParameter",
                                    "id": "gid://sagittarius/NodeParameter/146",
                                    "updatedAt": "2026-03-18T17:17:22Z",
                                    "createdAt": "2026-03-18T17:17:22Z",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/176",
                                        "identifier": "runnable",
                                        "createdAt": "2026-03-17T14:01:56Z",
                                        "updatedAt": "2026-03-17T14:01:56Z"
                                    },
                                    "value": null
                                }
                            ],
                            "pageInfo": {
                                "__typename": "PageInfo",
                                "endCursor": "MTQ2",
                                "hasNextPage": false
                            }
                        },
                        "functionDefinition": {
                            "__typename": "FunctionDefinition",
                            "id": "gid://sagittarius/FunctionDefinition/113",
                            "identifier": "std::control::if"
                        }
                    },
                    {
                        "__typename": "NodeFunction",
                        "id": "gid://sagittarius/NodeFunction/36",
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
            "startingNodeId": "gid://sagittarius/NodeFunction/17",
            "type": {
                "__typename": "FlowType",
                "id": "gid://sagittarius/FlowType/1"
            },
            "updatedAt": "2026-03-18T17:13:53Z",
            "userAbilities": {
                "__typename": "FlowUserAbilities",
                "deleteFlow": true
            }
        };

        const suggestions = getReferenceSuggestions(flow, "gid://sagittarius/NodeFunction/36", 0, FUNCTION_SIGNATURES, DATA_TYPES);

        //expect(suggestions.some(s => !s.nodeFunctionId)).toBe(true);
    });
});
