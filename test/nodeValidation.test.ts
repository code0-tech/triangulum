import {describe, expect, it} from 'vitest';
import {getNodeValidation} from '../src/validation/getNodeValidation';
import {FUNCTION_SIGNATURES, DATA_TYPES} from "./data";

describe('getNodeValidation', () => {
    it('1', () => {
        const result = getNodeValidation({}, {
            functionDefinition: {
                identifier: "std::list::at" as any
            },
            parameters: {
                nodes: [{
                    value: {
                        __typename: "LiteralValue",
                        value: ["a", "b", "c"]
                    }
                }, {
                    value: {
                        __typename: "LiteralValue",
                        value: 1
                    }
                }]
            }
        }, FUNCTION_SIGNATURES, DATA_TYPES);
        expect(result.isValid).toBe(true);
        expect(result.returnType).toBeDefined();
        expect(result.errors.filter(e => e.severity === 'error').length).toBe(0);
    })

    it('2', () => {
        const result = getNodeValidation({
            nodes: {
                nodes: [{
                    functionDefinition: {
                        identifier: "std::list::at" as any
                    },
                    parameters: {
                        nodes: [{
                            value: {
                                __typename: "LiteralValue",
                                value: ["a", "b", "c"]
                            }
                        }, {
                            value: {
                                __typename: "LiteralValue",
                                value: 1
                            }
                        }]
                    }
                }, {
                    functionDefinition: {
                        identifier: "std::math::add" as any
                    },
                    parameters: {
                        nodes: [{
                            value: {
                                __typename: "LiteralValue",
                                value: 1
                            }
                        }, {
                            value: {
                                __typename: "LiteralValue",
                                value: 1
                            }
                        }]
                    }
                }]
            }
        }, {
            functionDefinition: {
                identifier: "std::math::add" as any
            },
            parameters: {
                nodes: [{
                    value: {
                        __typename: "LiteralValue",
                        value: 1
                    }
                }, {
                    value: {
                        __typename: "LiteralValue",
                        value: 1
                    }
                }]
            }
        }, FUNCTION_SIGNATURES, DATA_TYPES);


        expect(result.isValid).toBe(true);
        expect(result.returnType).toBeDefined();
        expect(result.errors.filter(e => e.severity === 'error').length).toBe(0);
    })

    it('3', () => {
        const result = getNodeValidation({}, {
            functionDefinition: {
                identifier: "std::list::at" as any
            },
            parameters: {
                nodes: [{
                    value: {
                        __typename: "LiteralValue",
                        value: ["a", "b", "c"]
                    }
                }, {
                    value: {
                        __typename: "LiteralValue",
                        value: "1"
                    }
                }]
            }
        }, FUNCTION_SIGNATURES, DATA_TYPES);

        expect(result.isValid).toBe(false);
        expect(result.returnType).toBeDefined();
        expect(result.errors.filter(e => e.severity === 'error').length).toBeGreaterThan(0);
    })

    it('4', () => {
        const result = getNodeValidation({
            nodes: {
                nodes: [{
                    nextNodeId: "gid://sagittarius/NodeFunction/2",
                    id: "gid://sagittarius/NodeFunction/1",
                    functionDefinition: {
                        identifier: "std::list::at" as any
                    },
                    parameters: {
                        nodes: [{
                            value: {
                                __typename: "LiteralValue",
                                value: [1, 2, 3]
                            }
                        }, {
                            value: {
                                __typename: "LiteralValue",
                                value: 1
                            }
                        }]
                    }
                }, {
                    id: "gid://sagittarius/NodeFunction/2",
                    functionDefinition: {
                        identifier: "std::math::add" as any
                    },
                    parameters: {
                        nodes: [{
                            value: {
                                __typename: "ReferenceValue",
                                nodeFunctionId: "gid://sagittarius/NodeFunction/1"
                            }
                        }, {
                            value: {
                                __typename: "LiteralValue",
                                value: 1
                            }
                        }]
                    }
                }]
            }
        }, {
            id: "gid://sagittarius/NodeFunction/2",
            functionDefinition: {
                identifier: "std::math::add" as any
            },
            parameters: {
                nodes: [{
                    value: {
                        __typename: "ReferenceValue",
                        nodeFunctionId: "gid://sagittarius/NodeFunction/1"
                    }
                }, {
                    value: {
                        __typename: "LiteralValue",
                        value: 1
                    }
                }]
            }
        }, FUNCTION_SIGNATURES, DATA_TYPES);

        expect(result.isValid).toBe(true);
        expect(result.returnType).toBeDefined();
        expect(result.errors.filter(e => e.severity === 'error').length).toBe(0);
    })

    it('5', () => {
        const result = getNodeValidation({
            nodes: {
                nodes: [{
                    nextNodeId: "gid://sagittarius/NodeFunction/2",
                    id: "gid://sagittarius/NodeFunction/1",
                    functionDefinition: {
                        identifier: "std::list::at" as any
                    },
                    parameters: {
                        nodes: [{
                            value: {
                                __typename: "LiteralValue",
                                value: [{test: 1}]
                            }
                        }, {
                            value: {
                                __typename: "LiteralValue",
                                value: 1
                            }
                        }]
                    }
                }, {
                    id: "gid://sagittarius/NodeFunction/2",
                    functionDefinition: {
                        identifier: "std::math::add" as any
                    },
                    parameters: {
                        nodes: [{
                            value: {
                                __typename: "ReferenceValue",
                                nodeFunctionId: "gid://sagittarius/NodeFunction/1",
                                referencePath: [{
                                    path: "test",
                                }]
                            }
                        }, {
                            value: {
                                __typename: "LiteralValue",
                                value: 1
                            }
                        }]
                    }
                }]
            }
        }, {
            id: "gid://sagittarius/NodeFunction/2",
            functionDefinition: {
                identifier: "std::math::add" as any
            },
            parameters: {
                nodes: [{
                    value: {
                        __typename: "ReferenceValue",
                        nodeFunctionId: "gid://sagittarius/NodeFunction/1",
                        referencePath: [{
                            path: "test",
                        }]
                    }
                }, {
                    value: {
                        __typename: "LiteralValue",
                        value: 1
                    }
                }]
            }
        }, FUNCTION_SIGNATURES, DATA_TYPES);

        expect(result.isValid).toBe(true);
        expect(result.returnType).toBeDefined();
        expect(result.errors.filter(e => e.severity === 'error').length).toBe(0);
    })

    it('6', () => {
        const result = getNodeValidation({
            nodes: {
                nodes: [{
                    id: "gid://sagittarius/NodeFunction/1",
                    functionDefinition: {
                        identifier: "std::list::at" as any
                    },
                    parameters: {
                        nodes: [{
                            value: {
                                __typename: "ReferenceValue",
                                nodeFunctionId: "gid://sagittarius/NodeFunction/10",
                                parameterIndex: 1,
                                inputIndex: 0
                            }
                        }, {
                            value: {
                                __typename: "LiteralValue",
                                value: 1
                            }
                        }]
                    }
                }, {
                    id: "gid://sagittarius/NodeFunction/2",
                    functionDefinition: {
                        identifier: "std::control::for_each" as any
                    },
                    parameters: {
                        nodes: [{
                            value: {
                                __typename: "LiteralValue",
                                value: [[1], [1], [1]]
                            }
                        }, {
                            value: {
                                __typename: "NodeFunctionIdWrapper",
                                id: "gid://sagittarius/NodeFunction/1"
                            }
                        }]
                    }
                }]
            }
        }, {
            id: "gid://sagittarius/NodeFunction/2",
            functionDefinition: {
                identifier: "std::control::for_each" as any
            },
            parameters: {
                nodes: [{
                    value: {
                        __typename: "LiteralValue",
                        value: [[1], [1], [1]]
                    }
                }, {
                    value: {
                        __typename: "NodeFunctionIdWrapper",
                        id: "gid://sagittarius/NodeFunction/1"
                    }
                }]
            }
        }, FUNCTION_SIGNATURES, DATA_TYPES);

        expect(result.isValid).toBe(true);
        expect(result.returnType).toBeDefined();
        expect(result.errors.filter(e => e.severity === 'error').length).toBe(0);
    })

    it('7', () => {
        const result = getNodeValidation({
            nodes: {
                nodes: [{
                    id: "gid://sagittarius/NodeFunction/1",
                    functionDefinition: {
                        identifier: "std::control::return" as any
                    },
                    parameters: {
                        nodes: [{
                            value: {
                                __typename: "LiteralValue",
                                value: true
                            }
                        }]
                    }
                }]
            }
        }, {
            id: "gid://sagittarius/NodeFunction/2",
            functionDefinition: {
                identifier: "std::control::find" as any
            },
            parameters: {
                nodes: [{
                    value: {
                        __typename: "LiteralValue",
                        value: [1,2,3]
                    }
                }, {
                    value: {
                        __typename: "NodeFunctionIdWrapper",
                        id: "gid://sagittarius/NodeFunction/1"
                    }
                }]
            }
        }, FUNCTION_SIGNATURES, DATA_TYPES);

        expect(result.isValid).toBe(true);
        expect(result.returnType).toBe("number");
        expect(result.returnType).toBeDefined();
        expect(result.errors.filter(e => e.severity === 'error').length).toBe(0);
    })

    it('8', () => {
        const result = getNodeValidation({
            nodes: {
                nodes: [{
                    id: "gid://sagittarius/NodeFunction/1",
                    functionDefinition: {
                        identifier: "std::control::return" as any
                    },
                    parameters: {
                        nodes: [{
                            value: {
                                __typename: "LiteralValue",
                                value: "test"
                            }
                        }]
                    }
                }]
            }
        }, {
            id: "gid://sagittarius/NodeFunction/2",
            functionDefinition: {
                identifier: "std::control::find" as any
            },
            parameters: {
                nodes: [{
                    value: {
                        __typename: "LiteralValue",
                        value: [[1], [1], [1]]
                    }
                }, {
                    value: {
                        __typename: "NodeFunctionIdWrapper",
                        id: "gid://sagittarius/NodeFunction/1"
                    }
                }]
            }
        }, FUNCTION_SIGNATURES, DATA_TYPES);

        expect(result.isValid).toBe(false);
        expect(result.returnType).toBeDefined();
        expect(result.errors.filter(e => e.severity === 'error').length).toBeGreaterThan(0);
    })

    it('9', () => {
        const result = getNodeValidation({
            nodes: {
                nodes: [{
                    id: "gid://sagittarius/NodeFunction/1",
                    functionDefinition: {
                        identifier: "std::control::return" as any
                    },
                    parameters: {
                        nodes: [{
                            value: {
                                __typename: "LiteralValue",
                                value: true
                            }
                        }]
                    }
                }]
            }
        }, {
            id: "gid://sagittarius/NodeFunction/2",
            functionDefinition: {
                identifier: "std::control::find" as any
            },
            parameters: {
                nodes: [{
                    value: {
                        __typename: "LiteralValue",
                        value: [[1], [1], [1]]
                    }
                }, {
                    value: {
                        __typename: "NodeFunctionIdWrapper",
                        id: "gid://sagittarius/NodeFunction/1"
                    }
                }]
            }
        }, FUNCTION_SIGNATURES, DATA_TYPES);

        expect(result.isValid).toBe(true);
        expect(result.returnType).toBeDefined();
        expect(result.errors.filter(e => e.severity === 'error').length).toBe(0);
    })

    it('10', () => {
        const result = getNodeValidation({
            nodes: {
                nodes: [{
                    id: "gid://sagittarius/NodeFunction/2",
                    nextNodeId: "gid://sagittarius/NodeFunction/3",
                    functionDefinition: {
                        identifier: "std::math::add"
                    },
                    parameters: {
                        nodes: [{
                            value: {
                                __typename: "LiteralValue",
                                value: 1
                            }
                        }, {
                            value: {
                                __typename: "LiteralValue",
                                value: 1
                            }
                        }]
                    }
                }, {
                    id: "gid://sagittarius/NodeFunction/3",
                    functionDefinition: {
                        identifier: "std::control::return"
                    },
                    parameters: {
                        nodes: [{
                            value: {
                                __typename: "LiteralValue",
                                value: true
                            }
                        }]
                    }
                }]
            }
        }, {
            id: "gid://sagittarius/NodeFunction/1",
            functionDefinition: {
                identifier: "std::control::find"
            },
            parameters: {
                nodes: [{
                    value: {
                        __typename: "LiteralValue",
                        value: [[1], [1], [1]]
                    }
                }, {
                    value: {
                        __typename: "NodeFunctionIdWrapper",
                        id: "gid://sagittarius/NodeFunction/2"
                    }
                }]
            }
        }, FUNCTION_SIGNATURES, DATA_TYPES);

        expect(result.isValid).toBe(true);
        expect(result.returnType).toBeDefined();
        expect(result.errors.filter(e => e.severity === 'error').length).toBe(0);
    })

    it('11', () => {
        const result = getNodeValidation({
            nodes: {
                nodes: [{
                    id: "gid://sagittarius/NodeFunction/1",
                    functionDefinition: {
                        identifier: "std::list::at" as any
                    },
                    parameters: {
                        nodes: [{
                            value: {
                                __typename: "ReferenceValue",
                                nodeFunctionId: "gid://sagittarius/NodeFunction/10",
                                parameterIndex: 1,
                                inputIndex: 0
                            }
                        }, {
                            value: {
                                __typename: "LiteralValue",
                                value: 1
                            }
                        }]
                    }
                }, {
                    id: "gid://sagittarius/NodeFunction/2",
                    functionDefinition: {
                        identifier: "std::control::for_each" as any
                    },
                    parameters: {
                        nodes: [{
                            value: {
                                __typename: "LiteralValue",
                                value: [[1], [1], [1]]
                            }
                        }, {
                            value: {
                                __typename: "NodeFunctionIdWrapper",
                                id: "gid://sagittarius/NodeFunction/1"
                            }
                        }]
                    }
                }]
            }
        }, {
            id: "gid://sagittarius/NodeFunction/1",
            functionDefinition: {
                identifier: "std::list::at" as any
            },
            parameters: {
                nodes: [{
                    value: {
                        __typename: "ReferenceValue",
                        nodeFunctionId: "gid://sagittarius/NodeFunction/1",
                        parameterIndex: 1,
                        inputIndex: 0
                    }
                }, {
                    value: {
                        __typename: "LiteralValue",
                        value: 1
                    }
                }]
            }
        }, FUNCTION_SIGNATURES, DATA_TYPES);

        expect(result.isValid).toBe(true);
        expect(result.returnType).toBeDefined();
        expect(result.errors.filter(e => e.severity === 'error').length).toBe(0);
    })

});

