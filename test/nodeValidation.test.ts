import {describe, expect, it} from 'vitest';
import {getNodeValidation} from '../src/nodeValidation';

describe('getNodeValidation', () => {
    it('1', () => {
        const result = getNodeValidation({}, {
            functionDefinition: {
                id: "std::list::at" as any
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
        });
        expect(result.isValid).toBe(true);
        expect(result.inferredType).toBeDefined();
        expect(result.errors.filter(e => e.severity === 'error').length).toBe(0);
    })

    it('2', () => {
        const result = getNodeValidation({
            nodes: {
                nodes: [{
                    functionDefinition: {
                        id: "std::list::at" as any
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
                        id: "std::math::add" as any
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
                id: "std::math::add" as any
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
        });


        expect(result.isValid).toBe(true);
        expect(result.inferredType).toBeDefined();
        expect(result.errors.filter(e => e.severity === 'error').length).toBe(0);
    })

    it('3', () => {
        const result = getNodeValidation({}, {
            functionDefinition: {
                id: "std::list::at" as any
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
        });

        expect(result.isValid).toBe(false);
        expect(result.inferredType).toBeDefined();
        expect(result.errors.filter(e => e.severity === 'error').length).toBeGreaterThan(0);
    })

    it('4', () => {
        const result = getNodeValidation({
            nodes: {
                nodes: [{
                    id: "gid://sagittarius/NodeFunction/1",
                    functionDefinition: {
                        id: "std::list::at" as any
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
                }]
            }
        }, {
            functionDefinition: {
                id: "std::math::add" as any
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
        });

        expect(result.isValid).toBe(true);
        expect(result.inferredType).toBeDefined();
        expect(result.errors.filter(e => e.severity === 'error').length).toBe(0);
    })

    it('5', () => {
        const result = getNodeValidation({
            nodes: {
                nodes: [{
                    id: "gid://sagittarius/NodeFunction/1",
                    functionDefinition: {
                        id: "std::list::at" as any
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
                }]
            }
        }, {
            functionDefinition: {
                id: "std::math::add" as any
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
        });

        expect(result.isValid).toBe(true);
        expect(result.inferredType).toBeDefined();
        expect(result.errors.filter(e => e.severity === 'error').length).toBe(0);
    })

    it('6', () => {
        const result = getNodeValidation({
            nodes: {
                nodes: [{
                    id: "gid://sagittarius/NodeFunction/1",
                    functionDefinition: {
                        id: "std::list::at" as any
                    },
                    parameters: {
                        nodes: [{
                            value: {
                                __typename: "ReferenceValue",
                                nodeFunctionId: "gid://sagittarius/NodeFunction/2",
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
                }]
            }
        }, {
            id: "gid://sagittarius/NodeFunction/2",
            functionDefinition: {
                id: "std::control::for_each" as any
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
        });

        expect(result.isValid).toBe(true);
        expect(result.inferredType).toBeDefined();
        expect(result.errors.filter(e => e.severity === 'error').length).toBe(0);
    })

    it('7', () => {
        const result = getNodeValidation({
            nodes: {
                nodes: [{
                    id: "gid://sagittarius/NodeFunction/1",
                    functionDefinition: {
                        id: "std::control::return" as any
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
                id: "std::control::find" as any
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
        });

        expect(result.isValid).toBe(true);
        expect(result.inferredType).toBe("number");
        expect(result.inferredType).toBeDefined();
        expect(result.errors.filter(e => e.severity === 'error').length).toBe(0);
    })

    it('8', () => {
        const result = getNodeValidation({
            nodes: {
                nodes: [{
                    id: "gid://sagittarius/NodeFunction/1",
                    functionDefinition: {
                        id: "std::control::return" as any
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
                id: "std::control::find" as any
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
        });

        expect(result.isValid).toBe(false);
        expect(result.inferredType).toBeDefined();
        expect(result.errors.filter(e => e.severity === 'error').length).toBeGreaterThan(0);
    })

    it('9', () => {
        const result = getNodeValidation({
            nodes: {
                nodes: [{
                    id: "gid://sagittarius/NodeFunction/1",
                    functionDefinition: {
                        id: "std::control::return" as any
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
                id: "std::control::find" as any
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
        });

        expect(result.isValid).toBe(true);
        expect(result.inferredType).toBeDefined();
        expect(result.errors.filter(e => e.severity === 'error').length).toBe(0);
    })

});

