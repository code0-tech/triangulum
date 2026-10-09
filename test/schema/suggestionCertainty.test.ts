import {describe, expect, it} from "vitest";
import {DataType, Flow, FunctionDefinition} from "@code0-tech/sagittarius-graphql-types";
import {getSignatureSchema, getTypeSchema, Schema, SuggestionCertainty} from "../../src";
import {DATA_TYPES, FUNCTION_SIGNATURES} from "../data";

/**
 * `suggestions` and `suggestionCertainty` are an index-aligned pair: every
 * suggestion is described by the certainty at its own index. These tests pin
 * that invariant down across a whole schema tree, and the certainties the four
 * suggestion sources report.
 */
describe("Suggestion certainty", () => {

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

    const certaintyOf = (schema: Schema, predicate: (value: any) => boolean): SuggestionCertainty[] =>
        (schema.suggestions ?? []).flatMap((value, index) =>
            predicate(value) ? [schema.suggestionCertainty![index]] : []);

    const describeCertainty = (certainty: SuggestionCertainty): string =>
        certainty.match === "exact" ? "exact" : `possible:${certainty.reason}`;

    const respondFlow = (): Flow => ({
        id: "gid://sagittarius/Flow/1",
        startingNodeId: "gid://sagittarius/NodeFunction/1",
        signature: "(): void",
        nodes: {
            nodes: [
                {
                    id: "gid://sagittarius/NodeFunction/1",
                    functionDefinition: {identifier: "rest::control::respond"},
                    parameters: {nodes: []},
                },
            ],
        },
    });

    it("pairs every suggestion list with an equally long certainty list", () => {
        const result = getSignatureSchema(
            respondFlow(),
            DATA_TYPES,
            FUNCTION_SIGNATURES,
            "gid://sagittarius/NodeFunction/1",
        );

        const schemas = result.parameters.flatMap((parameter) => allSchemas(parameter.schema));
        expect(schemas.length).toBeGreaterThan(0);

        schemas.forEach((schema) => {
            expect(schema.suggestionCertainty === undefined).toBe(schema.suggestions === undefined);
            expect(schema.suggestionCertainty?.length).toBe(schema.suggestions?.length);
            (schema.suggestionCertainty ?? []).forEach((certainty) => {
                // A reason is carried exactly for a possible match.
                expect(certainty.reason === undefined).toBe(certainty.match === "exact");
            });
        });
    });

    it("keeps the suggested values themselves free of certainty metadata", () => {
        const result = getSignatureSchema(
            respondFlow(),
            DATA_TYPES,
            FUNCTION_SIGNATURES,
            "gid://sagittarius/NodeFunction/1",
        );

        const suggestions = result.parameters
            .flatMap((parameter) => allSchemas(parameter.schema))
            .flatMap((schema) => schema.suggestions ?? []);

        expect(suggestions.length).toBeGreaterThan(0);
        suggestions.forEach((suggestion) => {
            expect(suggestion).not.toHaveProperty("certainty");
            expect(suggestion).not.toHaveProperty("value.__typename");
        });
    });

    it("omits both keys on a schema built without suggestions", () => {
        const schema = getTypeSchema("NUMBER", DATA_TYPES);

        expect(schema).toEqual({input: "number", type: "number"});
    });

    it("marks dedicated producers of a concrete type exact and widened ones possible", () => {
        // Parameter 0 of rest::control::respond is a HTTP_STATUS_CODE (a NUMBER).
        const result = getSignatureSchema(
            respondFlow(),
            DATA_TYPES,
            FUNCTION_SIGNATURES,
            "gid://sagittarius/NodeFunction/1",
        );
        const statusCode = result.parameters[0].schema;

        expect(statusCode.input).toBe("number");

        // std::number::add returns NUMBER: a dedicated producer of this slot.
        const add = certaintyOf(statusCode, (value) =>
            value.__typename === "NodeFunction"
            && value.functionDefinition?.identifier === "std::number::add");
        expect(add.map(describeCertainty)).toEqual(["exact"]);

        // std::control::value returns an unconstrained type parameter, so it is
        // offered everywhere and guarantees nothing about this slot.
        const passThrough = certaintyOf(statusCode, (value) =>
            value.__typename === "NodeFunction"
            && value.functionDefinition?.identifier === "std::control::value");
        expect(passThrough.map(describeCertainty)).toEqual(["possible:unconstrained"]);
    });

    it("offers no exact producer for a slot that accepts anything", () => {
        // Parameter 1 is `headers: OBJECT<{}>` — an open object every value
        // satisfies. Candidates are still offered, but none of them is a producer
        // *of this type*, which is what the certainty says.
        const result = getSignatureSchema(
            respondFlow(),
            DATA_TYPES,
            FUNCTION_SIGNATURES,
            "gid://sagittarius/NodeFunction/1",
        );
        const headers = result.parameters[1].schema;

        expect(headers.input).toBe("data");
        expect(headers.suggestions?.length).toBeGreaterThan(0);
        expect(headers.suggestionCertainty?.every((certainty) =>
            certainty.match === "possible" && certainty.reason === "unconstrained")).toBe(true);
    });

    it("offers no exact producer for a slot typed by an uninstantiated generic object", () => {
        // Parameter 0 of std::object::contains_key is `OBJECT<T>` with T unbound,
        // which resolves to `{[key: string]: any}`: an open index signature every
        // object satisfies. The slot is not concrete, so it has no producers of
        // its own type even though the candidates are assignable to it.
        const containsKeyFlow: Flow = {
            id: "gid://sagittarius/Flow/1",
            startingNodeId: "gid://sagittarius/NodeFunction/1",
            signature: "(): void",
            nodes: {
                nodes: [
                    {
                        id: "gid://sagittarius/NodeFunction/1",
                        functionDefinition: {identifier: "std::object::contains_key"},
                        parameters: {nodes: []},
                    },
                ],
            },
        };

        const result = getSignatureSchema(
            containsKeyFlow,
            DATA_TYPES,
            FUNCTION_SIGNATURES,
            "gid://sagittarius/NodeFunction/1",
        );
        const object = result.parameters[0].schema;

        expect(object.input).toBe("data");
        expect(object.suggestions?.length).toBeGreaterThan(0);
        expect(object.suggestionCertainty?.every((certainty) => certainty.match === "possible")).toBe(true);
    });

    it("marks a return type matched through its constraint as a generic match", () => {
        // A function whose return type is a *bounded* type parameter: the bound
        // fits the slot, but the instantiation may be narrower than the bound.
        const boundedGeneric: FunctionDefinition = {
            id: "gid://sagittarius/FunctionDefinition/9200",
            identifier: "custom::bounded::produce",
            signature: "<T extends NUMBER>(value: T): T",
        } as FunctionDefinition;

        const result = getSignatureSchema(
            respondFlow(),
            DATA_TYPES,
            [...FUNCTION_SIGNATURES, boundedGeneric],
            "gid://sagittarius/NodeFunction/1",
        );

        const bounded = certaintyOf(result.parameters[0].schema, (value) =>
            value.__typename === "NodeFunction"
            && value.functionDefinition?.identifier === "custom::bounded::produce");

        expect(bounded.map(describeCertainty)).toEqual(["possible:generic"]);
    });

    it("marks a producer that may yield nothing as a nullable match", () => {
        // The nullish part of a return type is ignored when matching — such a
        // function is a useful suggestion for a non-null slot — so the certainty
        // is where "may be undefined" is reported.
        const maybeNumber: FunctionDefinition = {
            id: "gid://sagittarius/FunctionDefinition/9300",
            identifier: "custom::maybe::produce",
            signature: "(): NUMBER | undefined",
        } as FunctionDefinition;

        const result = getSignatureSchema(
            respondFlow(),
            DATA_TYPES,
            [...FUNCTION_SIGNATURES, maybeNumber],
            "gid://sagittarius/NodeFunction/1",
        );

        const maybe = certaintyOf(result.parameters[0].schema, (value) =>
            value.__typename === "NodeFunction"
            && value.functionDefinition?.identifier === "custom::maybe::produce");

        expect(maybe.map(describeCertainty)).toEqual(["possible:nullable"]);
    });

    it("marks a reference into a union key as a union-member match", () => {
        // UNION_HOLDER.flexible is `TEXT | { deep: TEXT }`. For a TEXT slot the
        // union is offered because its string branch fits — which branch
        // materializes is a runtime decision, so the match is only possible.
        // Its validation twin is the warning getFlowValidation reports for
        // actually using such a reference.
        const unionHolder: DataType = {
            __typename: "DataType",
            id: "gid://sagittarius/DataType/9200",
            identifier: "UNION_HOLDER",
            genericKeys: [],
            type: "{ flexible: TEXT | { deep: TEXT } }",
        } as unknown as DataType;

        const produce: FunctionDefinition = {
            id: "gid://sagittarius/FunctionDefinition/9201",
            identifier: "custom::union::produce",
            signature: "(): UNION_HOLDER",
        } as FunctionDefinition;

        const flow: Flow = {
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
                        parameters: {nodes: [{value: null}, {value: null}]},
                    },
                ],
            },
        };

        const result = getSignatureSchema(
            flow,
            [...DATA_TYPES, unionHolder],
            [...FUNCTION_SIGNATURES, produce],
            "gid://sagittarius/NodeFunction/2",
        );

        const isFlexible = (value: any, path: string[]) =>
            value.__typename === "ReferenceValue"
            && value.nodeFunctionId === "gid://sagittarius/NodeFunction/1"
            && JSON.stringify((value.referencePath ?? []).map((segment: any) => segment.path)) === JSON.stringify(path);

        const schema = result.parameters[0].schema;

        // The union key itself: only one of its branches is a TEXT.
        expect(certaintyOf(schema, (value) => isFlexible(value, ["flexible"])).map(describeCertainty))
            .toEqual(["possible:union-member"]);

        // The string inside the object branch is a TEXT outright.
        expect(certaintyOf(schema, (value) => isFlexible(value, ["flexible", "deep"])).map(describeCertainty))
            .toEqual(["exact"]);
    });
});
