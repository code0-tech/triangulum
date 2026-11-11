import {describe, expect, it} from "vitest";
import {Flow, NodeFunction, SubFlowValue} from "@code0-tech/sagittarius-graphql-types";
import {getSignatureSchema, Schema} from "../../src";
import {DATA_TYPES, FUNCTION_SIGNATURES} from "../data";

/**
 * The flow's own trigger is emitted into the generated source as a function
 * declaration (`declare function flow(...)`) so the flow's settings and its
 * produced payload can be type-checked. It is not a *function* the user can
 * place: it has no FunctionDefinition behind it, it cannot be called from a
 * node, and it cannot be bound as a sub-flow — it is what starts the flow.
 *
 * It therefore must never show up among a parameter's suggestions, in either
 * shape: neither as a NodeFunction (calling the trigger) nor as a SubFlowValue
 * (binding the trigger as a callback). The trigger's *value* is reachable, but
 * as a ReferenceValue onto the flow — which is a different suggestion source.
 */
describe("Flow trigger suggestions", () => {

    // Every schema in a tree: the node itself plus its items, declared items and
    // (possibly union-valued) properties.
    const allSchemas = (schema: Schema | Schema[] | undefined): Schema[] => {
        if (!schema) return [];
        if (Array.isArray(schema)) return schema.flatMap(allSchemas);

        return [
            schema,
            ...((schema as any).items ?? []).flatMap(allSchemas),
            ...((schema as any).declaredItems ?? []).flatMap(allSchemas),
            ...Object.values((schema as any).properties ?? {}).flatMap((property) =>
                allSchemas(property as Schema | Schema[])),
        ];
    };

    const suggestionsOf = (flow: Flow, nodeId: string) => {
        const result = getSignatureSchema(flow, DATA_TYPES, FUNCTION_SIGNATURES, nodeId as NodeFunction['id']);
        const schemas = result.parameters.flatMap((parameter) => allSchemas(parameter.schema));
        expect(schemas.length).toBeGreaterThan(0);

        return schemas.flatMap((schema) => schema.suggestions ?? []);
    };

    const flowWith = (signature: string, identifier: string): Flow => ({
        id: "gid://sagittarius/Flow/1",
        startingNodeId: "gid://sagittarius/NodeFunction/1",
        signature,
        nodes: {
            nodes: [
                {
                    id: "gid://sagittarius/NodeFunction/1",
                    functionDefinition: {identifier},
                    parameters: {nodes: []},
                },
            ],
        },
    });

    // A suggestion that carries no function identifier is the trigger: every real
    // node function and sub-flow binding is looked up in the function definitions
    // and carries the identifier it was found under.
    const withoutIdentifier = (suggestions: ReturnType<typeof suggestionsOf>, typename: string) =>
        suggestions.filter((suggestion) =>
            suggestion.__typename === typename
            && !(suggestion as NodeFunction | SubFlowValue).functionDefinition?.identifier);

    it("never offers the trigger as a node function for a concrete slot", () => {
        // The trigger produces a NUMBER, and parameter 0 of rest::control::respond
        // is a HTTP_STATUS_CODE (a NUMBER) — so it would match on type alone.
        const suggestions = suggestionsOf(
            flowWith("(): NUMBER", "rest::control::respond"),
            "gid://sagittarius/NodeFunction/1",
        );

        expect(withoutIdentifier(suggestions, "NodeFunction")).toEqual([]);
    });

    it("never offers the trigger as a node function for a generic slot", () => {
        // std::control::value takes a `T`, which widens to `any` for suggestions:
        // the slot every candidate fits.
        const suggestions = suggestionsOf(
            flowWith("(): NUMBER", "std::control::value"),
            "gid://sagittarius/NodeFunction/1",
        );

        expect(withoutIdentifier(suggestions, "NodeFunction")).toEqual([]);
    });

    it("never offers the trigger as a sub-flow binding", () => {
        // The trigger is a `() => void`, which is exactly the RUNNABLE parameter 1
        // of std::control::if expects.
        const suggestions = suggestionsOf(
            flowWith("(): void", "std::control::if"),
            "gid://sagittarius/NodeFunction/1",
        );

        expect(withoutIdentifier(suggestions, "SubFlowValue")).toEqual([]);
    });

    it("still offers the real node functions of a slot the trigger would match", () => {
        const suggestions = suggestionsOf(
            flowWith("(): NUMBER", "rest::control::respond"),
            "gid://sagittarius/NodeFunction/1",
        );

        const identifiers = suggestions.flatMap((suggestion) =>
            suggestion.__typename === "NodeFunction"
                ? [(suggestion as NodeFunction).functionDefinition?.identifier]
                : []);

        expect(identifiers).toContain("std::number::add");
    });
});
