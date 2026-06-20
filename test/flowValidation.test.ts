import {describe, expect, it} from 'vitest';
import {getFlowValidation} from '../src/validation/getFlowValidation';
import {Flow} from "@code0-tech/sagittarius-graphql-types"; // Pfad ggf. anpassen
// @ts-ignore
import {DATA_TYPES, FUNCTION_SIGNATURES} from "./data";

describe('getFlowValidation - Integrationstest', () => {
    it('1', () => {

        const flow: Flow = {
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
            }
        };

        const result = getFlowValidation(flow, FUNCTION_SIGNATURES, DATA_TYPES);

        expect(result.isValid).toBe(true);
        expect(result.diagnostics).toHaveLength(0);
        result.diagnostics.forEach((error) => {
            expect(error.parameterIndex).toBeDefined()
        })
    });

    it('2', () => {

        const flow: Flow = {
            nodes: {
                nodes: [
                    {
                        id: "gid://sagittarius/NodeFunction/1",
                        functionDefinition: {identifier: "std::list::at"},
                        parameters: {
                            nodes: [
                                {value: null},
                                {value: {__typename: "LiteralValue", value: 0}}
                            ]
                        },
                        nextNodeId: "gid://sagittarius/NodeFunction/2"
                    },
                    {
                        id: "gid://sagittarius/NodeFunction/2",
                        functionDefinition: {identifier: "std::number::add"},
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

        expect(result.isValid).toBe(false);
        result.diagnostics.forEach((error) => {
            expect(error.nodeId).toBeDefined()
            expect(error.parameterIndex).toBeDefined()
        })
    });

    it('3', () => {
        const flow: Flow = {
            nodes: {
                nodes: [
                    {
                        id: "gid://sagittarius/NodeFunction/1",
                        functionDefinition: {identifier: "std::number::add"},
                        parameters: {
                            nodes: [
                                {value: {__typename: "LiteralValue", value: "not accessibility a number"}},
                                {value: {__typename: "LiteralValue", value: 10}}
                            ]
                        }
                    }
                ]
            }
        };

        const result = getFlowValidation(flow, FUNCTION_SIGNATURES, DATA_TYPES);

        expect(result.isValid).toBe(false);
        result.diagnostics.forEach((error) => {
            expect(error.parameterIndex).toBeDefined()
        })
    });

    it('4', () => {

        const flow: Flow = {
            startingNodeId: "gid://sagittarius/NodeFunction/1",
            nodes: {
                nodes: [
                    {
                        id: "gid://sagittarius/NodeFunction/1",
                        functionDefinition: {identifier: "std::number::add"},
                        parameters: {
                            nodes: [
                                {value: {__typename: "LiteralValue", value: 0}},
                                {value: {__typename: "LiteralValue", value: 0}}
                            ]
                        },
                        nextNodeId: "gid://sagittarius/NodeFunction/2"
                    },
                    {
                        id: "gid://sagittarius/NodeFunction/2",
                        functionDefinition: {identifier: "std::number::add"},
                        parameters: {
                            nodes: [
                                {
                                    value: {
                                        __typename: "ReferenceValue",
                                        nodeFunctionId: "gid://sagittarius/NodeFunction/1"
                                    }
                                },
                                {
                                    value: {
                                        __typename: "LiteralValue",
                                        value: 10,
                                    }
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
        result.diagnostics.forEach((error) => {
            expect(error.parameterIndex).toBeDefined()
        })
    });

    it('5', () => {

        const flow: Flow = {
            startingNodeId: "gid://sagittarius/NodeFunction/2",
            nodes: {
                nodes: [
                    {
                        id: "gid://sagittarius/NodeFunction/1",
                        functionDefinition: {
                            identifier: "std::control::return" as any
                        },
                        parameters: {
                            nodes: [{
                                value: {
                                    __typename: "ReferenceValue",
                                    nodeFunctionId: "gid://sagittarius/NodeFunction/2",
                                    parameterIndex: 1,
                                    inputIndex: 0,
                                }
                            }]
                        }
                    },
                    {
                        id: "gid://sagittarius/NodeFunction/2",
                        functionDefinition: {
                            identifier: "std::list::for_each" as any
                        },
                        parameters: {
                            nodes: [
                                {
                                    value: {
                                        __typename: "LiteralValue",
                                        value: [1]
                                    }
                                },
                                {
                                    value: {
                                        __typename: "SubFlowValue",
                                        startingNodeId: "gid://sagittarius/NodeFunction/1"
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }

        const result = getFlowValidation(flow, FUNCTION_SIGNATURES, DATA_TYPES);

        expect(result.isValid).toBe(true);
        expect(result.diagnostics).toHaveLength(0);
        result.diagnostics.forEach((error) => {
            expect(error.parameterIndex).toBeDefined()
        })
    });

    it('6', () => {

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
                        "id": "gid://sagittarius/NodeFunction/1",
                        "functionDefinition": {
                            "__typename": "FunctionDefinition",
                            "id": "gid://sagittarius/FunctionDefinition/77",
                            "identifier": "std::boolean::as_number"
                        },
                        "parameters": {
                            "__typename": "NodeParameterConnection",
                            "nodes": [
                                {
                                    "__typename": "NodeParameter",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/117",
                                        "identifier": "value"
                                    },
                                    "value": {
                                        "startingNodeId": "gid://sagittarius/NodeFunction/2",
                                        "__typename": "SubFlowValue"
                                    }
                                }
                            ]
                        }
                    },
                    {
                        "__typename": "NodeFunction",
                        "id": "gid://sagittarius/NodeFunction/2",
                        "functionDefinition": {
                            "__typename": "FunctionDefinition",
                            "id": "gid://sagittarius/FunctionDefinition/74",
                            "identifier": "std::boolean::from_number"
                        },
                        "parameters": {
                            "__typename": "NodeParameterConnection",
                            "nodes": [
                                {
                                    "__typename": "NodeParameter",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/113",
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
            "startingNodeId": "gid://sagittarius/NodeFunction/1",
            "type": {
                "__typename": "FlowType",
                "id": "gid://sagittarius/FlowType/1"
            },
            "updatedAt": "2026-03-17T17:21:45Z",
            "userAbilities": {
                "__typename": "FlowUserAbilities",
                "deleteFlow": true
            }
        };

        const result = getFlowValidation(flow, FUNCTION_SIGNATURES, DATA_TYPES);

        expect(result.isValid).toBe(false);
        result.diagnostics.forEach((error) => {
            expect(error.parameterIndex).toBeDefined()
        })
    });

    it('7', () => {

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
                        "id": "gid://sagittarius/NodeFunction/2",
                        "nextNodeId": null,
                        "createdAt": "2026-03-17T14:04:15Z",
                        "updatedAt": "2026-03-17T19:13:40Z",
                        "parameters": {
                            "__typename": "NodeParameterConnection",
                            "count": 1,
                            "nodes": [
                                {
                                    "__typename": "NodeParameter",
                                    "id": "gid://sagittarius/NodeParameter/63",
                                    "updatedAt": "2026-03-17T19:13:40Z",
                                    "createdAt": "2026-03-17T18:35:16Z",
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
                                "endCursor": "NjM",
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
                        "id": "gid://sagittarius/NodeFunction/3",
                        "functionDefinition": {
                            "__typename": "FunctionDefinition",
                            "id": "gid://sagittarius/FunctionDefinition/75",
                            "identifier": "std::boolean::is_equal"
                        },
                        "parameters": {
                            "__typename": "NodeParameterConnection",
                            "nodes": [
                                {
                                    "__typename": "NodeParameter",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/114",
                                        "identifier": "first"
                                    },
                                    "value": {
                                        "startingNodeId": "gid://sagittarius/NodeFunction/4",
                                        "__typename": "SubFlowValue"
                                    }
                                },
                                {
                                    "__typename": "NodeParameter",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/115",
                                        "identifier": "second"
                                    },
                                    "value": null
                                }
                            ]
                        }
                    },
                    {
                        "__typename": "NodeFunction",
                        "id": "gid://sagittarius/NodeFunction/4",
                        "functionDefinition": {
                            "__typename": "FunctionDefinition",
                            "id": "gid://sagittarius/FunctionDefinition/68",
                            "identifier": "std::object::get"
                        },
                        "parameters": {
                            "__typename": "NodeParameterConnection",
                            "nodes": [
                                {
                                    "__typename": "NodeParameter",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/99",
                                        "identifier": "object"
                                    },
                                    "value": {
                                        "__typename": "LiteralValue",
                                        "value": {
                                            "test": 1
                                        }
                                    }
                                },
                                {
                                    "__typename": "NodeParameter",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/100",
                                        "identifier": "key"
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
            "updatedAt": "2026-03-17T19:56:30Z",
            "userAbilities": {
                "__typename": "FlowUserAbilities",
                "deleteFlow": true
            },
        };

        const result = getFlowValidation(flow, FUNCTION_SIGNATURES, DATA_TYPES);

        expect(result.isValid).toBe(false);
        result.diagnostics.forEach((error) => {
            expect(error.parameterIndex).toBeDefined()
        })
    });

    it('8', () => {

        const flow: Flow = {
            "__typename": "Flow",
            "id": "gid://sagittarius/Flow/1",
            "createdAt": "2026-04-12T13:46:13Z",
            "name": "Test",
            "signature": "(httpURL: HTTP_URL, httpMethod: HTTP_METHOD): { body: { test: TEXT } }",
            "nodes": {
                "__typename": "NodeFunctionConnection",
                "nodes": [
                    {
                        "__typename": "NodeFunction",
                        "id": "gid://sagittarius/NodeFunction/1",
                        "functionDefinition": {
                            "__typename": "FunctionDefinition",
                            "id": "gid://sagittarius/FunctionDefinition/9",
                            "identifier": "std::boolean::from_number"
                        },
                        "parameters": {
                            "__typename": "NodeParameterConnection",
                            "nodes": [
                                {
                                    "__typename": "NodeParameter",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/11",
                                        "identifier": "value"
                                    },
                                    "value": {
                                        "__typename": "LiteralValue",
                                        "value": 1
                                    }
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
                            "id": "gid://sagittarius/FunctionDefinition/4",
                            "identifier": "std::control::return"
                        },
                        "parameters": {
                            "__typename": "NodeParameterConnection",
                            "nodes": [
                                {
                                    "__typename": "NodeParameter",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/4",
                                        "identifier": "value"
                                    },
                                    "value": null
                                }
                            ]
                        },
                        "nextNodeId": "gid://sagittarius/NodeFunction/3"
                    },
                    {
                        "__typename": "NodeFunction",
                        "id": "gid://sagittarius/NodeFunction/3",
                        "functionDefinition": {
                            "__typename": "FunctionDefinition",
                            "id": "gid://sagittarius/FunctionDefinition/12",
                            "identifier": "std::boolean::as_text"
                        },
                        "parameters": {
                            "__typename": "NodeParameterConnection",
                            "nodes": [
                                {
                                    "__typename": "NodeParameter",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/15",
                                        "identifier": "value"
                                    },
                                    "value": {
                                        "__typename": "LiteralValue",
                                        "value": false
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
                        "createdAt": "2026-04-12T13:47:31Z",
                        "updatedAt": "2026-04-12T13:47:31Z",
                        "flowSettingIdentifier": "httpURL",
                        "value": "/test"
                    },
                    {
                        "__typename": "FlowSetting",
                        "id": "gid://sagittarius/FlowSetting/2",
                        "createdAt": "2026-04-12T13:47:31Z",
                        "updatedAt": "2026-04-12T13:47:31Z",
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
            "updatedAt": "2026-04-13T00:07:31Z",
            "userAbilities": {
                "__typename": "FlowUserAbilities",
                "deleteFlow": true
            }
        };

        const result = getFlowValidation(flow, FUNCTION_SIGNATURES, DATA_TYPES);

        expect(result.isValid).toBe(true);
        result.diagnostics.forEach((error) => {
            expect(error.parameterIndex).toBeDefined()
        })
    });

    it('9', () => {

        const flow: Flow = {
            "__typename": "Flow",
            "id": "gid://sagittarius/Flow/1",
            "createdAt": "2026-04-13T19:45:44Z",
            "signature": "(httpURL: HTTP_URL, httpMethod: HTTP_METHOD): { payload: { test: BOOLEAN }, headers: { bla: TEXT } }",
            "disabledReason": null,
            "name": "Test",
            "project": {
                "__typename": "NamespaceProject",
                "id": "gid://sagittarius/NamespaceProject/1"
            },
            "settings": {
                "nodes": [
                    {
                        "value": "/test",
                        "flowSettingIdentifier": "httpURL"
                    },
                    {
                        "value": "GET",
                        "flowSettingIdentifier": "httpMethod"
                    }
                ]
            },
            "startingNodeId": "gid://sagittarius/NodeFunction/3",
            "type": {
                "id": "gid://sagittarius/FlowType/2",
                "__typename": "FlowType"
            },
            "updatedAt": "2026-04-13T19:54:55Z",
            "userAbilities": {
                "deleteFlow": true,
                "__typename": "FlowUserAbilities"
            },
            "nodes": {
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
                                    "value": {
                                        "__typename": "LiteralValue",
                                        "value": 200
                                    }
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
                                    "value": {
                                        "__typename": "ReferenceValue",
                                        "nodeFunctionId": null,
                                        "referencePath": [
                                            {
                                                "path": "payload"
                                            },
                                            {
                                                "path": "test"
                                            }
                                        ]
                                    }
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
                                        "__typename": "ReferenceValue",
                                        "nodeFunctionId": "gid://sagittarius/NodeFunction/1"
                                    }
                                }
                            ]
                        }
                    },
                    {
                        "__typename": "NodeFunction",
                        "id": "gid://sagittarius/NodeFunction/3",
                        "functionDefinition": {
                            "__typename": "FunctionDefinition",
                            "id": "gid://sagittarius/FunctionDefinition/5",
                            "identifier": "std::control::if"
                        },
                        "parameters": {
                            "__typename": "NodeParameterConnection",
                            "nodes": [
                                {
                                    "__typename": "NodeParameter",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/6",
                                        "identifier": "condition"
                                    },
                                    "value": {
                                        "__typename": "ReferenceValue",
                                        "nodeFunctionId": null,
                                        "referencePath": [
                                            {
                                                "path": "payload"
                                            },
                                            {
                                                "path": "test"
                                            }
                                        ]
                                    }
                                },
                                {
                                    "__typename": "NodeParameter",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/7",
                                        "identifier": "runnable"
                                    },
                                    "value": {
                                        "startingNodeId": "gid://sagittarius/NodeFunction/4",
                                        "__typename": "SubFlowValue"
                                    }
                                }
                            ]
                        },
                        "nextNodeId": "gid://sagittarius/NodeFunction/1"
                    },
                    {
                        "__typename": "NodeFunction",
                        "id": "gid://sagittarius/NodeFunction/4",
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
                                    "value": {
                                        "__typename": "LiteralValue",
                                        "value": 200
                                    }
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
                                    "value": {
                                        "__typename": "LiteralValue",
                                        "value": "boolean"
                                    }
                                }
                            ]
                        },
                        "nextNodeId": "gid://sagittarius/NodeFunction/5"
                    },
                    {
                        "__typename": "NodeFunction",
                        "id": "gid://sagittarius/NodeFunction/5",
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
                                        "__typename": "ReferenceValue",
                                        "nodeFunctionId": "gid://sagittarius/NodeFunction/4"
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        };

        const result = getFlowValidation(flow, FUNCTION_SIGNATURES, DATA_TYPES);

        expect(result.isValid).toBe(false);
        expect(result.diagnostics).toEqual(expect.arrayContaining([
            expect.objectContaining({
                nodeId: "gid://sagittarius/NodeFunction/1",
                message: 'The function definition "http::response::create" is not reachable.',
                severity: "error",
            }),
            expect.objectContaining({
                nodeId: "gid://sagittarius/NodeFunction/4",
                message: 'The function definition "http::response::create" is not reachable.',
                severity: "error",
            }),
        ]));
    });

    it('11', () => {

        const flow: Flow = {
            "__typename": "Flow",
            "id": "gid://sagittarius/Flow/1",
            "createdAt": "2026-04-12T13:46:13Z",
            "name": "Test",
            "signature": "(httpURL: HTTP_URL, httpMethod: HTTP_METHOD): { body: { test: TEXT } }",
            "nodes": {
                "__typename": "NodeFunctionConnection",
                "nodes": [
                    {
                        "__typename": "NodeFunction",
                        "id": "gid://sagittarius/NodeFunction/1",
                        "functionDefinition": {
                            "__typename": "FunctionDefinition",
                            "id": "gid://sagittarius/FunctionDefinition/9",
                            "identifier": "std::boolean::from_number"
                        },
                        "parameters": {
                            "__typename": "NodeParameterConnection",
                            "nodes": [
                                {
                                    "__typename": "NodeParameter",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/11",
                                        "identifier": "value"
                                    },
                                    "value": {
                                        "__typename": "LiteralValue",
                                        "value": 1
                                    }
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
                            "id": "gid://sagittarius/FunctionDefinition/4",
                            "identifier": "std::control::return"
                        },
                        "parameters": {
                            "__typename": "NodeParameterConnection",
                            "nodes": [
                                {
                                    "__typename": "NodeParameter",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/4",
                                        "identifier": "value"
                                    },
                                    "value": null
                                }
                            ]
                        },
                        "nextNodeId": "gid://sagittarius/NodeFunction/3"
                    },
                    {
                        "__typename": "NodeFunction",
                        "id": "gid://sagittarius/NodeFunction/3",
                        "functionDefinition": {
                            "__typename": "FunctionDefinition",
                            "id": "gid://sagittarius/FunctionDefinition/12",
                            "identifier": "std::boolean::as_text"
                        },
                        "parameters": {
                            "__typename": "NodeParameterConnection",
                            "nodes": [
                                {
                                    "__typename": "NodeParameter",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/15",
                                        "identifier": "value"
                                    },
                                    "value": {
                                        "__typename": "LiteralValue",
                                        "value": false
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
                        "createdAt": "2026-04-12T13:47:31Z",
                        "updatedAt": "2026-04-12T13:47:31Z",
                        "flowSettingIdentifier": "httpURL",
                        "value": "/test"
                    },
                    {
                        "__typename": "FlowSetting",
                        "id": "gid://sagittarius/FlowSetting/2",
                        "createdAt": "2026-04-12T13:47:31Z",
                        "updatedAt": "2026-04-12T13:47:31Z",
                        "flowSettingIdentifier": "httpMethod",
                        "value": "GET2"
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
            "updatedAt": "2026-04-13T00:07:31Z",
            "userAbilities": {
                "__typename": "FlowUserAbilities",
                "deleteFlow": true
            }
        };

        const result = getFlowValidation(flow, FUNCTION_SIGNATURES, DATA_TYPES);

        expect(result.isValid).toBe(false);
        expect(result.diagnostics[0].nodeId).toBe(null)
        expect(result.diagnostics[0].parameterIndex).toBe(1)
    });

    it('12', () => {

        const flow: Flow = {
            "__typename": "Flow",
            "id": "gid://sagittarius/Flow/1",
            "createdAt": "2026-04-12T13:46:13Z",
            "name": "Test",
            "signature": "(httpURL: HTTP_URL, httpMethod: HTTP_METHOD): { body: { test: TEXT } }",
            "nodes": {
                "__typename": "NodeFunctionConnection",
                "nodes": [
                    {
                        "__typename": "NodeFunction",
                        "id": "gid://sagittarius/NodeFunction/1",
                        "functionDefinition": {
                            "__typename": "FunctionDefinition",
                            "id": "gid://sagittarius/FunctionDefinition/9",
                            "identifier": "std::boolean::from_number"
                        },
                        "parameters": {
                            "__typename": "NodeParameterConnection",
                            "nodes": [
                                {
                                    "__typename": "NodeParameter",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/11",
                                        "identifier": "value"
                                    },
                                    "value": {
                                        "__typename": "LiteralValue",
                                        "value": 1
                                    }
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
                            "id": "gid://sagittarius/FunctionDefinition/4",
                            "identifier": "std::control::return"
                        },
                        "parameters": {
                            "__typename": "NodeParameterConnection",
                            "nodes": [
                                {
                                    "__typename": "NodeParameter",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/4",
                                        "identifier": "value"
                                    },
                                    "value": null
                                }
                            ]
                        },
                        "nextNodeId": "gid://sagittarius/NodeFunction/3"
                    },
                    {
                        "__typename": "NodeFunction",
                        "id": "gid://sagittarius/NodeFunction/3",
                        "functionDefinition": {
                            "__typename": "FunctionDefinition",
                            "id": "gid://sagittarius/FunctionDefinition/12",
                            "identifier": "std::boolean::as_text"
                        },
                        "parameters": {
                            "__typename": "NodeParameterConnection",
                            "nodes": [
                                {
                                    "__typename": "NodeParameter",
                                    "parameterDefinition": {
                                        "__typename": "ParameterDefinition",
                                        "id": "gid://sagittarius/ParameterDefinition/15",
                                        "identifier": "value"
                                    },
                                    "value": {
                                        "__typename": "LiteralValue",
                                        "value": false
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
                        "createdAt": "2026-04-12T13:47:31Z",
                        "updatedAt": "2026-04-12T13:47:31Z",
                        "flowSettingIdentifier": "httpURL",
                        "value": "/test"
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
            "updatedAt": "2026-04-13T00:07:31Z",
            "userAbilities": {
                "__typename": "FlowUserAbilities",
                "deleteFlow": true
            }
        };

        const result = getFlowValidation(flow, FUNCTION_SIGNATURES, DATA_TYPES);

        expect(result.isValid).toBe(false);
        expect(result.diagnostics[0].nodeId).toBe(null)
        expect(result.diagnostics[0].parameterIndex).toBe(null)
    });

    it('13', () => {

        const flow: Flow = {
            startingNodeId: "gid://sagittarius/NodeFunction/1",
            nodes: {
                nodes: [
                    {
                        id: "gid://sagittarius/NodeFunction/1",
                        functionDefinition: {identifier: "std::control::if"},
                        parameters: {
                            nodes: [
                                {
                                    value: {
                                        __typename: "LiteralValue",
                                        value: true
                                    }
                                },
                                {
                                    value: {
                                        __typename: "SubFlowValue",
                                        startingNodeId: "gid://sagittarius/NodeFunction/2"
                                    }
                                }
                            ]
                        },
                    },
                    {
                        id: "gid://sagittarius/NodeFunction/2",
                        functionDefinition: {identifier: "std::number::add"},
                        parameters: {
                            nodes: [
                                {value: {__typename: "LiteralValue", value: 0}},
                                {value: {__typename: "LiteralValue", value: 0}}
                            ]
                        },
                        nextNodeId: "gid://sagittarius/NodeFunction/3",
                    },
                    {
                        id: "gid://sagittarius/NodeFunction/3",
                        functionDefinition: {identifier: "std::control::return"},
                        parameters: {
                            nodes: [
                                {
                                    value: {
                                        __typename: "ReferenceValue",
                                        nodeFunctionId: "gid://sagittarius/NodeFunction/2",
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        };

        const result = getFlowValidation(flow, FUNCTION_SIGNATURES, DATA_TYPES);

        expect(result.isValid).toBe(true);
        result.diagnostics.forEach((error) => {
            expect(error.nodeId).toBeDefined()
            expect(error.parameterIndex).toBeDefined()
        })
    });

    it('fails when a node references an unreachable function definition', () => {

        const flow: Flow = {
            startingNodeId: "gid://sagittarius/NodeFunction/1",
            nodes: {
                nodes: [
                    {
                        id: "gid://sagittarius/NodeFunction/1",
                        functionDefinition: {identifier: "std::number::add"},
                        parameters: {
                            nodes: [
                                {value: {__typename: "LiteralValue", value: 1}},
                                {value: {__typename: "LiteralValue", value: 2}}
                            ]
                        },
                        nextNodeId: "gid://sagittarius/NodeFunction/2"
                    },
                    {
                        id: "gid://sagittarius/NodeFunction/2",
                        functionDefinition: {identifier: "std::imaginary::nonexistent"},
                        parameters: {nodes: []}
                    }
                ]
            }
        };

        const result = getFlowValidation(flow, FUNCTION_SIGNATURES, DATA_TYPES);

        expect(result.isValid).toBe(false);
        expect(result.diagnostics).toEqual([
            expect.objectContaining({
                nodeId: "gid://sagittarius/NodeFunction/2",
                parameterIndex: null,
                message: 'The function definition "std::imaginary::nonexistent" is not reachable.',
                severity: "error",
            })
        ]);
    });

});