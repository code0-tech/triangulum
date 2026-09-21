import {describe, expect, it} from "vitest";
import {Flow, NodeParameter} from "@code0-tech/sagittarius-graphql-types";
import {generateFlowSourceCode} from "../src/utils";
import {getFlowValidation} from "../src/validation/getFlowValidation";
import {getSignatureSchema} from "../src/schema/getSignatureSchema";
// @ts-ignore
import {DATA_TYPES, FUNCTION_SIGNATURES} from "./data";

/**
 * A parameter or flow setting may carry a `cast` — the type its value is meant to
 * have. The generated source has to apply it, because it is what binds the type
 * parameters of the surrounding call and therefore drives validation, the node's
 * return type and the generated schemas.
 */
describe("cast handling in the generated flow source", () => {

    /** `std::list::first` is `<T>(list: LIST<T>): T` — its return is the cast's element type. */
    const firstOf = (parameter: NodeParameter, nextNodeId?: string): Flow => ({
        id: "gid://sagittarius/Flow/1",
        startingNodeId: "gid://sagittarius/NodeFunction/1",
        nodes: {
            nodes: [
                {
                    id: "gid://sagittarius/NodeFunction/1",
                    functionDefinition: {identifier: "std::list::first"},
                    parameters: {nodes: [parameter]},
                    nextNodeId,
                },
                ...(nextNodeId ? [{
                    id: "gid://sagittarius/NodeFunction/2",
                    functionDefinition: {identifier: "std::number::add"},
                    parameters: {
                        nodes: [
                            {
                                value: {
                                    __typename: "ReferenceValue",
                                    nodeFunctionId: "gid://sagittarius/NodeFunction/1",
                                },
                            },
                            {value: {__typename: "LiteralValue", value: 1}},
                        ],
                    },
                }] : []),
            ],
        },
    } as Flow);

    it("asserts a literal parameter value to its cast", () => {
        const source = generateFlowSourceCode(
            firstOf({value: {__typename: "LiteralValue", value: []}, cast: "LIST<TEXT>"}),
            FUNCTION_SIGNATURES,
            DATA_TYPES,
        );

        expect(source).toContain("([]) as unknown as LIST<TEXT>");
    });

    it("asserts a reference parameter value to its cast", () => {
        const flow = firstOf(
            {value: {__typename: "LiteralValue", value: []}},
            "gid://sagittarius/NodeFunction/2",
        );
        flow.nodes!.nodes![1]!.parameters!.nodes![0]!.cast = "NUMBER";

        const source = generateFlowSourceCode(flow, FUNCTION_SIGNATURES, DATA_TYPES);

        expect(source).toContain("as unknown as NUMBER");
        expect(source).toMatch(/\(\(node_gid___sagittarius_NodeFunction_1\)!?\) as unknown as NUMBER/);
    });

    it("binds the call's type parameter from the cast", () => {
        // `[]` alone tells `<T>(list: LIST<T>)` nothing, so the node's return type
        // would stay unconstrained; cast to LIST<TEXT> it is a TEXT, which the
        // NUMBER parameter of the following node rejects.
        const cast = getFlowValidation(
            firstOf(
                {value: {__typename: "LiteralValue", value: []}, cast: "LIST<TEXT>"},
                "gid://sagittarius/NodeFunction/2",
            ),
            FUNCTION_SIGNATURES,
            DATA_TYPES,
        );

        expect(cast.isValid).toBe(false);
        expect(cast.diagnostics.some(d =>
            d.nodeId === "gid://sagittarius/NodeFunction/2" && d.parameterIndex === 0)).toBe(true);

        const uncast = getFlowValidation(
            firstOf(
                {value: {__typename: "LiteralValue", value: []}},
                "gid://sagittarius/NodeFunction/2",
            ),
            FUNCTION_SIGNATURES,
            DATA_TYPES,
        );

        expect(uncast.isValid).toBe(true);
    });

    it("holds even where the value and the cast do not overlap", () => {
        // A cast is a deliberate reinterpretation, so stating that a number list
        // is a TEXT list is not a conversion error — it simply takes effect.
        const result = getFlowValidation(
            firstOf(
                {value: {__typename: "LiteralValue", value: [1, 2, 3]}, cast: "LIST<TEXT>"},
                "gid://sagittarius/NodeFunction/2",
            ),
            FUNCTION_SIGNATURES,
            DATA_TYPES,
        );

        // The only complaint is downstream: the TEXT the cast produced does not
        // fit the NUMBER parameter of the following node.
        expect(result.diagnostics).toEqual([
            expect.objectContaining({
                nodeId: "gid://sagittarius/NodeFunction/2",
                parameterIndex: 0,
                severity: "error",
            }),
        ]);
    });

    it("drops a cast that is not a safe type expression", () => {
        const injected = generateFlowSourceCode(
            firstOf({
                value: {__typename: "LiteralValue", value: []},
                cast: "TEXT; const injected = 1",
            }),
            FUNCTION_SIGNATURES,
            DATA_TYPES,
        );
        expect(injected).not.toContain("injected");
        expect(injected).toContain("*/ []");

        const unbalanced = generateFlowSourceCode(
            firstOf({value: {__typename: "LiteralValue", value: []}, cast: "LIST<TEXT"}),
            FUNCTION_SIGNATURES,
            DATA_TYPES,
        );
        expect(unbalanced).not.toContain(" as ");

        // Dropping the cast leaves a flow that still compiles as if uncast.
        expect(getFlowValidation(
            firstOf({
                value: {__typename: "LiteralValue", value: []},
                cast: "TEXT; const injected = 1",
            }),
            FUNCTION_SIGNATURES,
            DATA_TYPES,
        ).isValid).toBe(true);
    });

    it("leaves a parameter without a value uncast during validation", () => {
        const source = generateFlowSourceCode(
            firstOf({value: null, cast: "LIST<TEXT>"}),
            FUNCTION_SIGNATURES,
            DATA_TYPES,
            false,
            false,
        );

        expect(source).toContain("*/ undefined");
        expect(source).not.toContain("(undefined) as");
    });

    it("asserts an unfilled parameter to its cast during inference", () => {
        const source = generateFlowSourceCode(
            firstOf({value: null, cast: "LIST<TEXT>"}),
            FUNCTION_SIGNATURES,
            DATA_TYPES,
            true,
        );

        expect(source).toContain("({}) as unknown as LIST<TEXT>");
    });

    it("asserts a flow setting value to its cast", () => {
        // The REST trigger is `<T extends TYPE>(input_schema: T, ...)`: whatever
        // the `input_schema` setting resolves to is what T — and with it the
        // trigger's payload — binds to.
        const restTrigger = (cast?: string): Flow => ({
            id: "gid://sagittarius/Flow/1",
            startingNodeId: "gid://sagittarius/NodeFunction/1",
            signature:
                "<T extends TYPE>(input_schema: T, httpURL: HTTP_URL, httpMethod: HTTP_METHOD): REST_ADAPTER_INPUT<T>",
            settings: {
                nodes: [
                    {value: {name: "text"}, cast},
                    {value: "/users"},
                    {value: "GET"},
                ],
            },
            nodes: {nodes: []},
        } as Flow);

        const cast = "{ name: TEXT, age: NUMBER }";
        expect(generateFlowSourceCode(restTrigger(cast), FUNCTION_SIGNATURES, DATA_TYPES))
            .toContain(`as unknown as ${cast}`);

        // Uncast, T is the shape of the setting value itself. The payload is a
        // return, so it renders that shape as data — never as the `T extends
        // TYPE` picker the parameter side uses.
        const uncastPayload = (getSignatureSchema(restTrigger(), DATA_TYPES, FUNCTION_SIGNATURES)
            .return as { properties: Record<string, any> }).properties.payload;
        expect(uncastPayload.input).toBe("data");
        expect(uncastPayload.type).toBe("{ name: string; }");

        // Cast, T is the cast type — the payload gains the declared `age`.
        const castPayload = (getSignatureSchema(restTrigger(cast), DATA_TYPES, FUNCTION_SIGNATURES)
            .return as { properties: Record<string, any> }).properties.payload;
        expect(castPayload.input).toBe("data");
        expect(castPayload.properties.age.input).toBe("number");
        expect(castPayload.type).toBe("{ name: string; age: number; }");
    });
});
