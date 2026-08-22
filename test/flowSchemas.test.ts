import {describe, expect, it} from "vitest";
import type {Flow, FunctionDefinition, NodeFunction, NodeParameterValue} from "@code0-tech/sagittarius-graphql-types";
import {getFlowSchemas} from "../src/server";
import type {JsonSchema, SchematizedSubFlowValue} from "../src/server";
import {DATA_TYPES, FUNCTION_SIGNATURES} from "./data";

type NodeId = NonNullable<NodeFunction["id"]>;

const FLOW_ID: Flow["id"] = "gid://sagittarius/Flow/1";
const LIST_NODE_ID: NodeId = "gid://sagittarius/NodeFunction/1";
const BODY_NODE_ID: NodeId = "gid://sagittarius/NodeFunction/2";

// --- Small builders to keep the test flows readable -------------------------

const literal = (value: unknown): NodeParameterValue => ({
    __typename: "LiteralValue",
    value,
});

/** A sub-flow executing a tree of nodes, entered at `startingNodeId`. */
const subFlowStartingAt = (startingNodeId: NodeId): NodeParameterValue => ({
    __typename: "SubFlowValue",
    startingNodeId,
});

/** A sub-flow directly mapping to a function — no starting node involved. */
const subFlowCalling = (functionIdentifier: string): NodeParameterValue => ({
    __typename: "SubFlowValue",
    functionDefinition: {identifier: functionIdentifier},
});

/** A reference to the sub-flow input of `nodeId` at `parameterIndex`. */
const subFlowInputReference = (
    nodeId: NodeId,
    parameterIndex: number,
    path?: string,
): NodeParameterValue => ({
    __typename: "ReferenceValue",
    nodeFunctionId: nodeId,
    parameterIndex,
    inputIndex: 0,
    ...(path ? {referencePath: [{path}]} : {}),
});

const node = (
    id: NodeId,
    functionIdentifier: string,
    parameterValues: NodeParameterValue[],
): NodeFunction => ({
    id,
    functionDefinition: {identifier: functionIdentifier},
    parameters: {nodes: parameterValues.map((value) => ({value}))},
});

const flowWithNodes = (nodes: NodeFunction[], signature = "(): void"): Flow => ({
    id: FLOW_ID,
    startingNodeId: nodes[0]?.id,
    nodes: {nodes},
    signature,
});

/**
 * Convenience accessor for the (runtime-enriched) sub-flow value of a node
 * parameter. The static Flow type does not carry the added schema fields, so the
 * cast recovers them for assertions.
 */
const subFlowValueOf = (
    flow: Flow | undefined,
    nodeId: NodeId,
    parameterIndex: number,
): SchematizedSubFlowValue => {
    const owner = flow?.nodes?.nodes?.find((n) => n?.id === nodeId);
    return owner?.parameters?.nodes?.[parameterIndex]
        ?.value as SchematizedSubFlowValue;
};

// --- Tests -------------------------------------------------------------------

describe("getFlowSchemas", () => {
    it("returns undefined when no flow is given", () => {
        expect(getFlowSchemas(undefined, FUNCTION_SIGNATURES, DATA_TYPES)).toBeUndefined();
    });

    it("adds input/output schemas derived from the flow signature", () => {
        const flow = flowWithNodes([], "(method: HTTP_METHOD): NUMBER");

        const result = getFlowSchemas(flow, FUNCTION_SIGNATURES, DATA_TYPES);

        // inputSchema is an object keyed by parameter name.
        expect(result?.inputSchema.type).toBe("object");
        expect(result?.inputSchema.required).toEqual(["method"]);

        // method → HTTP_METHOD, an enum of string literals. A property may
        // formally be a boolean schema, so narrow it before asserting.
        const method = result?.inputSchema.properties?.method as JsonSchema;
        expect(method.type).toBe("string");
        expect(method.enum).toEqual(["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"]);

        // Return type NUMBER.
        expect(result?.outputSchema).toEqual({type: "number"});
    });

    it("derives schemas from a generic REST adapter flow signature", () => {
        // Taken from the REST trigger scenario in schema.test.ts: the signature
        // carries a free type parameter T in TYPE<T> and REST_ADAPTER_INPUT<T>.
        const flow = flowWithNodes(
            [],
            "<T>(input_schema: TYPE<T>, httpURL: HTTP_URL, httpMethod: HTTP_METHOD): REST_ADAPTER_INPUT<T>",
        );

        const result = getFlowSchemas(flow, FUNCTION_SIGNATURES, DATA_TYPES);

        // A free T yields the open schema {}; concrete parameters resolve fully.
        expect(result?.inputSchema.properties?.input_schema).toEqual({});
        expect(result?.inputSchema.properties?.httpURL).toEqual({type: "string"});
        expect((result?.inputSchema.properties?.httpMethod as JsonSchema).enum)
            .toEqual(["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"]);
        expect(result?.inputSchema.required)
            .toEqual(["input_schema", "httpURL", "httpMethod"]);

        // REST_ADAPTER_INPUT<T> resolves structurally; the T-typed payload
        // stays open while the concrete fields become object schemas.
        expect(result?.outputSchema.type).toBe("object");
        expect(result?.outputSchema.properties?.payload).toEqual({});
        expect(result?.outputSchema.required)
            .toEqual(["payload", "headers", "query_params", "path_params"]);
    });

    it("maps the DATE data type to its underlying number type", () => {
        const flow = flowWithNodes([], "(created: DATE): void");

        const result = getFlowSchemas(flow, FUNCTION_SIGNATURES, DATA_TYPES);

        expect(result?.inputSchema.properties?.created).toEqual({type: "number"});
    });

    it("produces an empty object input and null output for a flow without a signature", () => {
        const flow: Flow = {id: FLOW_ID, nodes: {nodes: []}};

        const result = getFlowSchemas(flow, FUNCTION_SIGNATURES, DATA_TYPES);

        // Defaults to `(): void` → an object with no parameters, void return
        // (JSON Schema `null`).
        expect(result?.inputSchema).toEqual({
            type: "object",
            additionalProperties: false,
        });
        expect(result?.outputSchema).toEqual({type: "null"});
    });

    it("enriches a for_each sub-flow with the resolved item type", () => {
        // for_each over [{test: 1}], the sub-flow body adds 10 to item.test.
        const flow = flowWithNodes([
            node(LIST_NODE_ID, "std::list::for_each", [
                literal([{test: 1}]),
                subFlowStartingAt(BODY_NODE_ID),
            ]),
            node(BODY_NODE_ID, "std::number::add", [
                subFlowInputReference(LIST_NODE_ID, 1, "test"),
                literal(10),
            ]),
        ]);

        const result = getFlowSchemas(flow, FUNCTION_SIGNATURES, DATA_TYPES);
        const consumer = subFlowValueOf(result, LIST_NODE_ID, 1);

        // CONSUMER<T> = (item: T) => void, with T resolved to { test: NUMBER }.
        // inputSchema is keyed by the callback parameter name `item`.
        expect(consumer.inputSchema).toEqual({
            type: "object",
            additionalProperties: false,
            properties: {
                item: {
                    type: "object",
                    additionalProperties: false,
                    properties: {test: {type: "number"}},
                    required: ["test"],
                },
            },
            required: ["item"],
        });

        // The consumer returns void → JSON Schema `null`.
        expect(consumer.outputSchema).toEqual({type: "null"});

        // The original SubFlowValue fields are preserved.
        expect(consumer.__typename).toBe("SubFlowValue");
        expect(consumer.startingNodeId).toBe(BODY_NODE_ID);
    });

    it("resolves an inline reference inside a for_each list literal into the item schema", () => {
        // A source node returns a NUMBER; the for_each list literal is `["${n}"]`
        // where the standalone `${n}` reference preserves that NUMBER type. Schema
        // generation must therefore infer the sub-flow item as a number — proving
        // inline references flow through getFlowSchemas, not just validation.
        const SRC_ID = "gid://sagittarius/NodeFunction/9" as NodeId;
        const SRC_FN: FunctionDefinition = {
            id: "gid://sagittarius/FunctionDefinition/9301",
            identifier: "custom::src::num",
            signature: "(): NUMBER",
        };

        const flow: Flow = {
            id: FLOW_ID,
            startingNodeId: SRC_ID,
            nodes: {
                nodes: [
                    {
                        id: SRC_ID,
                        functionDefinition: {identifier: "custom::src::num"},
                        nextNodeId: LIST_NODE_ID,
                        parameters: {nodes: []},
                    },
                    node(LIST_NODE_ID, "std::list::for_each", [
                        {
                            __typename: "LiteralValue",
                            value: ["${n}"],
                            references: [
                                {
                                    __typename: "InlineReferenceValue",
                                    signature: "n",
                                    value: {__typename: "ReferenceValue", nodeFunctionId: SRC_ID},
                                },
                            ],
                        } as NodeParameterValue,
                        subFlowStartingAt(BODY_NODE_ID),
                    ]),
                    node(BODY_NODE_ID, "std::number::add", [
                        subFlowInputReference(LIST_NODE_ID, 1),
                        literal(10),
                    ]),
                ],
            },
        };

        const result = getFlowSchemas(flow, [...FUNCTION_SIGNATURES, SRC_FN], DATA_TYPES);
        const consumer = subFlowValueOf(result, LIST_NODE_ID, 1);

        // T resolves to NUMBER, so the callback item is a number schema.
        expect((consumer.inputSchema?.properties?.item as JsonSchema)).toEqual({type: "number"});
        expect(consumer.__typename).toBe("SubFlowValue");
    });

    it("enriches a filter predicate sub-flow with a boolean output", () => {
        // filter over [1, 2, 3], the sub-flow body converts each item to a boolean.
        const flow = flowWithNodes([
            node(LIST_NODE_ID, "std::list::filter", [
                literal([1, 2, 3]),
                subFlowStartingAt(BODY_NODE_ID),
            ]),
            node(BODY_NODE_ID, "std::boolean::from_number", [
                subFlowInputReference(LIST_NODE_ID, 1),
            ]),
        ]);

        const result = getFlowSchemas(flow, FUNCTION_SIGNATURES, DATA_TYPES);
        const predicate = subFlowValueOf(result, LIST_NODE_ID, 1);

        // Input is keyed by the callback parameter name `item`, with T resolved
        // to NUMBER.
        expect(predicate.inputSchema).toEqual({
            type: "object",
            additionalProperties: false,
            properties: {item: {type: "number"}},
            required: ["item"],
        });
        // Output is what the sub-flow value actually returns, not the BOOLEAN the
        // filter's PREDICATE slot expects: the body only computes a value without
        // a `std::control::return` node, so the generated lambda returns void.
        expect(predicate.outputSchema).toEqual({type: "null"});
    });

    it("infers the map transform output from the sub-flow's return node", () => {
        // map over [1, 2, 3]; the sub-flow body returns the string "mapped".
        // TRANSFORM<T, R>: T comes from the list, R from the sub-flow's return.
        const flow = flowWithNodes([
            node(LIST_NODE_ID, "std::list::map", [
                literal([1, 2, 3]),
                subFlowStartingAt(BODY_NODE_ID),
            ]),
            node(BODY_NODE_ID, "std::control::return", [literal("mapped")]),
        ]);

        const result = getFlowSchemas(flow, FUNCTION_SIGNATURES, DATA_TYPES);
        const transform = subFlowValueOf(result, LIST_NODE_ID, 1);

        expect(transform.inputSchema).toEqual({
            type: "object",
            additionalProperties: false,
            properties: {item: {type: "number"}},
            required: ["item"],
        });
        // R is inferred from the generated sub-flow source code's return value.
        expect(transform.outputSchema).toEqual({type: "string"});
    });

    it("enriches both runnable branches of an if_else node independently", () => {
        // Taken from the control-flow scenarios in flowValidation.test.ts:
        // if_else carries two RUNNABLE (`() => void`) sub-flows in one node.
        const thenNodeId: NodeId = "gid://sagittarius/NodeFunction/2";
        const elseNodeId: NodeId = "gid://sagittarius/NodeFunction/3";
        const flow = flowWithNodes([
            node(LIST_NODE_ID, "std::control::if_else", [
                literal(true),
                subFlowStartingAt(thenNodeId),
                subFlowStartingAt(elseNodeId),
            ]),
            node(thenNodeId, "std::number::add", [literal(1), literal(2)]),
            node(elseNodeId, "std::number::add", [literal(3), literal(4)]),
        ]);

        const result = getFlowSchemas(flow, FUNCTION_SIGNATURES, DATA_TYPES);

        // A RUNNABLE takes no parameters and returns void.
        for (const parameterIndex of [1, 2]) {
            const branch = subFlowValueOf(result, LIST_NODE_ID, parameterIndex);
            expect(branch.inputSchema).toEqual({
                type: "object",
                additionalProperties: false,
            });
            expect(branch.outputSchema).toEqual({type: "null"});
        }

        // The condition parameter stays untouched.
        const condition = result?.nodes?.nodes?.[0]?.parameters?.nodes?.[0];
        expect((condition?.value as SchematizedSubFlowValue).inputSchema).toBeUndefined();
    });

    it("enriches a sub-flow that directly maps to a function without a starting node", () => {
        // filter over [1, 2, 3] with std::boolean::from_number mapped directly
        // as the predicate — no sub-flow node tree involved.
        const flow = flowWithNodes([
            node(LIST_NODE_ID, "std::list::filter", [
                literal([1, 2, 3]),
                subFlowCalling("std::boolean::from_number"),
            ]),
        ]);

        const result = getFlowSchemas(flow, FUNCTION_SIGNATURES, DATA_TYPES);
        const predicate = subFlowValueOf(result, LIST_NODE_ID, 1);

        // Input carries the resolved item type (T → NUMBER) the sub-flow value
        // receives — same as with a starting node.
        expect(predicate.inputSchema).toEqual({
            type: "object",
            additionalProperties: false,
            properties: {value: {type: "number"}},
            required: ["value"],
        });
        // The directly-mapped function is called without a `std::control::return`,
        // so the generated lambda returns void rather than the expected BOOLEAN.
        expect(predicate.outputSchema).toEqual({type: "boolean"});

        // The original SubFlowValue fields are preserved.
        expect(predicate.functionDefinition?.identifier).toBe("std::boolean::from_number");
        expect(predicate.startingNodeId).toBeUndefined();
    });

    it("accepts any sub-flow value via an accept-all callback parameter", () => {
        // A function definition whose sub-flow parameter accepts *any* sub-flow
        // value: (...args: any[]) => R matches every generated lambda. Defined
        // inline here (not in data.ts). Feed std::math::add as a direct mapping.
        const acceptAll = {
            __typename: "FunctionDefinition" as const,
            identifier: "std::control::execute",
            signature: "(sub_flow: (...args: any[]) => any): void",
        };

        const flow = flowWithNodes([
            node(LIST_NODE_ID, "std::control::execute", [
                subFlowCalling("std::number::add"),
            ]),
        ]);

        const result = getFlowSchemas(
            flow,
            [...FUNCTION_SIGNATURES, acceptAll],
            DATA_TYPES,
        );
        const subFlow = subFlowValueOf(result, LIST_NODE_ID, 0);

        // The direct-mapped function *is* the sub-flow value, so its own signature
        // `(first: NUMBER, second: NUMBER): NUMBER` drives the I/O — regardless of
        // the `void` the accept-all parameter merely expects.
        expect(subFlow.inputSchema).toEqual({
            type: "object",
            additionalProperties: false,
            properties: {
                first: {type: "number"},
                second: {type: "number"},
            },
            required: ["first", "second"],
        });
        expect(subFlow.outputSchema).toEqual({type: "number"});
    });

    it("leaves nodes without sub-flow parameters untouched", () => {
        const flow = flowWithNodes([
            node(LIST_NODE_ID, "std::number::add", [literal(1), literal(2)]),
        ]);

        const result = getFlowSchemas(flow, FUNCTION_SIGNATURES, DATA_TYPES);

        result?.nodes?.nodes?.[0]?.parameters?.nodes?.forEach((param) => {
            expect((param?.value as SchematizedSubFlowValue).inputSchema).toBeUndefined();
        });
    });
});
