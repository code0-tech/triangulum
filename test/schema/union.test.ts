import {describe, expect, it} from "vitest";
import {Flow, FunctionDefinition} from "@code0-tech/sagittarius-graphql-types";
import {getSignatureSchema, getTypeSchema, Schema, UnionInput} from "../../src";
import {DATA_TYPES, FUNCTION_SIGNATURES} from "../data";

/**
 * The `union` input: a slot whose declared type is a union of *alternative
 * inputs* (`TEXT | OBJECT<…>`, `BOOLEAN | COLOR`, `HTTP_METHOD | NUMBER`), which
 * enumerates those alternatives in `items` the way a list enumerates what an
 * element may be in `declaredItems`. Such a slot used to fall through to
 * `{input: "generic"}`, leaving nothing to render a choice from.
 *
 * Its counterpart is a union that renders as a *single* input, which must not
 * become a union input: a union of string/number literals is one `select`
 * offering all of them, `boolean` is internally `true | false`, and a nullish
 * union (`TEXT | undefined`) is just its one real member. Those are pinned here
 * too, because the line between the two is exactly what the input hinges on.
 */
describe("Schema — union input", () => {

    const fn = (identifier: string, signature: string): FunctionDefinition =>
        ({
            id: `gid://sagittarius/FunctionDefinition/${identifier}`,
            identifier,
            signature,
        }) as FunctionDefinition;

    const functions = [
        ...FUNCTION_SIGNATURES,
        fn("test::union::scalar", "(p: TEXT | OBJECT<{a: NUMBER}>): void"),
        fn("test::union::text_or_bool", "(p: TEXT | BOOLEAN): void"),
        fn("test::union::methods_or_number", "(p: HTTP_METHOD | NUMBER): void"),
        fn("test::union::optional", "(p?: TEXT | NUMBER): void"),
        fn("test::union::two", "(a: TEXT | NUMBER, b: TEXT | OBJECT<{a: NUMBER}>): void"),
        fn("test::union::generic", "<T>(p: T): void"),
        fn("test::union::holder", "(p: OBJECT<{u: TEXT | OBJECT<{a: NUMBER}>}>): void"),
        fn("test::union::list", "(p: LIST<TEXT | OBJECT<{a: NUMBER}>>): void"),
        fn("test::union::list_of_text_or_bool", "(p: LIST<TEXT | BOOLEAN>): void"),
        fn("test::union::returns", "(): TEXT | BOOLEAN"),
    ];

    /** The declared schema of a type string, with no node and no suggestions. */
    const type = (typeString: string): any => getTypeSchema(typeString, DATA_TYPES);

    /** The parameter schemas of a single node calling `identifier` with `values`. */
    const probe = (identifier: string, ...values: unknown[]): any[] => {
        const flow: Flow = {
            id: "gid://sagittarius/Flow/1",
            startingNodeId: "gid://sagittarius/NodeFunction/1",
            signature: "(): void",
            nodes: {
                nodes: [
                    {
                        id: "gid://sagittarius/NodeFunction/1",
                        functionDefinition: {identifier},
                        parameters: {
                            nodes: values.map((value) => ({
                                value:
                                    value === undefined
                                        ? null
                                        : {__typename: "LiteralValue", value},
                            })),
                        },
                    },
                ],
            },
        } as Flow;
        return getSignatureSchema(
            flow,
            DATA_TYPES,
            functions,
            "gid://sagittarius/NodeFunction/1",
        ).parameters as any[];
    };

    /** The sole parameter's schema of a single node calling `identifier`. */
    const param = (identifier: string, ...values: unknown[]): any =>
        probe(identifier, ...values)[0].schema;

    /** The input kinds a union input's alternatives render as. */
    const kinds = (schema: Schema): (string | undefined)[] =>
        ((schema as UnionInput).items ?? []).map((item) => item.input);

    /** The suggested values a position offers, as a comparable set. */
    const suggestionSet = (schema: any): Set<string> =>
        new Set(((schema?.suggestions ?? []) as unknown[]).map((s) => JSON.stringify(s)));

    /** The literal options a position offers, by their value. */
    const literalOptions = (schema: any): unknown[] =>
        ((schema?.suggestions ?? []) as any[])
            .filter((suggestion) => "value" in suggestion && suggestion.value !== undefined)
            .map((suggestion) => suggestion.value);

    // ─────────────────────────────────────────────────────────────────────────
    // A union of alternative inputs surfaces as the union input, one entry per
    // alternative. Each entry is the very schema that member produces on its own,
    // so a member with a dedicated input keeps it rather than being expanded back
    // into the structure it replaces.
    // ─────────────────────────────────────────────────────────────────────────
    describe("alternatives", () => {

        it("1. renders two wide primitives as a union of both inputs", () => {
            expect(type("TEXT | NUMBER")).toEqual({
                input: "union",
                type: "string | number",
                items: [
                    {input: "text", type: "string"},
                    {input: "number", type: "number"},
                ],
            });
        });

        it("2. renders a text-or-boolean union as a union input", () => {
            expect(type("TEXT | BOOLEAN")).toEqual({
                input: "union",
                type: "string | boolean",
                items: [
                    {input: "text", type: "string"},
                    {input: "boolean", type: "boolean"},
                ],
            });
        });

        it("3. renders a boolean-or-object union as a union input", () => {
            expect(type("BOOLEAN | OBJECT<{a: NUMBER}>")).toEqual({
                input: "union",
                type: "boolean | OBJECT<{ a: number; }>",
                items: [
                    {input: "boolean", type: "boolean"},
                    {
                        input: "data",
                        type: "{ a: number; }",
                        properties: {a: {input: "number", type: "number"}},
                        required: ["a"],
                    },
                ],
            });
        });

        it("4. keeps the object member's full property expansion", () => {
            const [, object] = type("TEXT | OBJECT<{a: NUMBER}>").items;

            expect(object.input).toBe("data");
            expect(object.properties.a).toEqual({input: "number", type: "number"});
            expect(object.required).toEqual(["a"]);
        });

        it("5. keeps a COLOR member as a color input rather than its HSL object", () => {
            expect(kinds(type("COLOR | OBJECT<{a: NUMBER}>"))).toEqual(["color", "data"]);
        });

        it("6. keeps a DATE member as a date input", () => {
            expect(kinds(type("DATE | TEXT"))).toEqual(["text", "date"]);
        });

        it("7. keeps a FILE member as a file input, mimetype included", () => {
            const [, file] = type('FILE<"image/png"> | TEXT').items;

            expect(file.input).toBe("file");
            expect(file.mimetype).toBe("image/png");
        });

        it("8. keeps a TYPE member as a type picker", () => {
            expect(kinds(type("TYPE | TEXT"))).toEqual(["text", "type"]);
        });

        it("9. keeps a callable member as a sub-flow input", () => {
            expect(kinds(type("(() => void) | TEXT"))).toEqual(["text", "sub-flow"]);
        });

        it("10. keeps a list member as its specialized list input", () => {
            const [, list] = type("LIST<TEXT> | TEXT").items;

            expect(list.input).toBe("list-text");
            expect(list.items).toEqual([{input: "text", type: "string"}]);
        });

        it("11. renders two list members as two list inputs", () => {
            expect(kinds(type("LIST<TEXT> | LIST<NUMBER>"))).toEqual([
                "list-text",
                "list-number",
            ]);
        });

        it("12. renders two object members as two data inputs with their own properties", () => {
            const [first, second] = type("OBJECT<{a: NUMBER}> | OBJECT<{b: TEXT}>").items;

            expect(kinds(type("OBJECT<{a: NUMBER}> | OBJECT<{b: TEXT}>"))).toEqual(["data", "data"]);
            expect(Object.keys(first.properties)).toEqual(["a"]);
            expect(Object.keys(second.properties)).toEqual(["b"]);
        });

        it("13. enumerates three alternatives", () => {
            expect(kinds(type("TEXT | NUMBER | BOOLEAN"))).toEqual([
                "text",
                "number",
                "boolean",
            ]);
        });

        it("14. enumerates four alternatives", () => {
            expect(kinds(type("TEXT | NUMBER | OBJECT<{a: NUMBER}> | BOOLEAN"))).toEqual([
                "text",
                "number",
                "boolean",
                "data",
            ]);
        });

        it("15. renders an empty object member as an empty data input", () => {
            const [, object] = type("NUMBER | OBJECT<{}>").items;

            expect(object).toEqual({input: "data", type: "{}", properties: {}, required: []});
        });

        it("16. carries the whole union as the slot's rendered type", () => {
            expect(type("TEXT | OBJECT<{a: NUMBER}>").type).toBe(
                "string | OBJECT<{ a: number; }>",
            );
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Folding: an entry is one *input*, not one type. The members that are the
    // options of a single input collapse into that one entry — all string/number
    // literals into one select, `boolean`'s internal `true | false` into one
    // boolean — so a union never offers the same input twice.
    // ─────────────────────────────────────────────────────────────────────────
    describe("folding", () => {

        it("17. folds boolean's true | false into a single boolean alternative", () => {
            expect(kinds(type("TEXT | BOOLEAN"))).toEqual(["text", "boolean"]);
        });

        it("18. folds an explicitly spelled true | false the same way", () => {
            expect(type("TEXT | true | false")).toEqual(type("TEXT | BOOLEAN"));
        });

        it("19. folds a lone boolean literal into a boolean alternative", () => {
            expect(kinds(type("'a' | true"))).toEqual(["boolean", "select"]);
        });

        it("20. folds a literal union member into one select alternative", () => {
            expect(kinds(type("HTTP_METHOD | NUMBER"))).toEqual(["number", "select"]);
        });

        it("21. names every folded literal in the select's rendered type", () => {
            const [, select] = type("HTTP_METHOD | NUMBER").items;

            expect(select.type).toBe('"GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD"');
        });

        it("22. folds inline literals into one select", () => {
            const [, select] = type("'a' | 'b' | NUMBER").items;

            expect(select).toEqual({input: "select", type: '"a" | "b"'});
        });

        it("23. keeps a single literal member a select of that one option", () => {
            const [select] = type("'a' | OBJECT<{a: NUMBER}>").items;

            expect(select).toEqual({input: "select", type: '"a"'});
        });

        it("24. folds across kinds at once — literals, boolean, object", () => {
            expect(kinds(type("'a' | BOOLEAN | OBJECT<{}>"))).toEqual([
                "boolean",
                "select",
                "data",
            ]);
        });

        it("25. offers every folded literal as an option of the select alternative", () => {
            const [, select] = param("test::union::methods_or_number").items;

            expect(literalOptions(select)).toEqual([
                "GET", "POST", "PUT", "DELETE", "PATCH", "HEAD",
            ]);
        });

        it("26. drops the nullish members — they make the slot optional, they are not alternatives", () => {
            const optional = type("TEXT | NUMBER | undefined");

            expect(kinds(optional)).toEqual(["text", "number"]);
            expect(optional.type).toBe("string | number | undefined");
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // The counterpart: a union that renders as a single input. These are the
    // cases a union input must never swallow — the select and boolean whose
    // members are the *options* of one input, and a nullish union that is just
    // its one real member.
    // ─────────────────────────────────────────────────────────────────────────
    describe("unions that are a single input", () => {

        it("27. keeps a string literal union a select", () => {
            expect(type("'GET' | 'POST'")).toEqual({input: "select", type: '"GET" | "POST"'});
        });

        it("28. keeps a select data type a select", () => {
            expect(type("HTTP_METHOD").input).toBe("select");
        });

        it("29. keeps a number literal union a select", () => {
            expect(type("1 | 2 | 3")).toEqual({input: "select", type: "1 | 2 | 3"});
        });

        it("30. keeps a single literal a select", () => {
            expect(type("'GET'")).toEqual({input: "select", type: '"GET"'});
        });

        it("31. keeps boolean a boolean input", () => {
            expect(type("BOOLEAN")).toEqual({input: "boolean", type: "boolean"});
        });

        it("32. keeps an explicit true | false a boolean input", () => {
            expect(type("true | false")).toEqual({input: "boolean", type: "boolean"});
        });

        it("33. collapses an optional text to its one real member", () => {
            expect(type("TEXT | undefined")).toEqual({
                input: "text",
                type: "string | undefined",
            });
        });

        it("34. collapses a nullable text to its one real member", () => {
            expect(type("TEXT | null")).toEqual({input: "text", type: "string | null"});
        });

        it("35. collapses an optional object to its one real member, properties intact", () => {
            const optional = type("OBJECT<{a: NUMBER}> | undefined");

            expect(optional.input).toBe("data");
            expect(optional.properties.a).toEqual({input: "number", type: "number"});
        });

        it("36. collapses an optional select to its select", () => {
            expect(type("HTTP_METHOD | undefined").input).toBe("select");
        });

        it("37. keeps a list of a literal union a list-select", () => {
            expect(type("LIST<HTTP_METHOD>").input).toBe("list-select");
        });

        it("38. keeps a list of a number literal union a list-select", () => {
            expect(type("LIST<1 | 2 | 3>").input).toBe("list-select");
        });

        it("39. no longer calls a union of wide primitives a select", () => {
            // The members of a select are its options, and a wide `string` member
            // contributes none — `TEXT | BOOLEAN` used to surface as a select with
            // nothing to choose from.
            expect(type("TEXT | BOOLEAN").input).not.toBe("select");
            expect(type("TEXT | NUMBER").input).not.toBe("select");
            expect(type("NUMBER | BOOLEAN").input).not.toBe("select");
            expect(type("HTTP_METHOD | NUMBER").input).not.toBe("select");
        });

        it("40. no longer falls through to a generic input", () => {
            // What this input exists for: each of these was `{input: "generic"}`.
            for (const union of [
                "TEXT | OBJECT<{a: NUMBER}>",
                "BOOLEAN | OBJECT<{a: NUMBER}>",
                "COLOR | OBJECT<{a: NUMBER}>",
                "LIST<TEXT> | TEXT",
            ]) {
                expect(type(union).input).toBe("union");
            }
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // A union input in a parameter slot, where suggestions and entered values
    // come into play.
    // ─────────────────────────────────────────────────────────────────────────
    describe("in a parameter slot", () => {

        it("41. surfaces the union input for an unfilled union parameter", () => {
            expect(kinds(param("test::union::scalar"))).toEqual(["text", "data"]);
        });

        it("42. scopes every alternative's suggestions to the whole slot", () => {
            // An entry describes one option of this one slot, so it offers whatever
            // the slot accepts — not only what its own member does. Same rule a
            // union list element follows.
            const schema = param("test::union::text_or_bool");

            expect(suggestionSet(schema).size).toBeGreaterThan(0);
            for (const item of schema.items) {
                expect(suggestionSet(item)).toEqual(suggestionSet(schema));
            }
        });

        it("43. reports a certainty for every suggestion of every alternative", () => {
            const schema = param("test::union::scalar");

            for (const position of [schema, ...schema.items]) {
                expect(position.suggestionCertainty).toHaveLength(position.suggestions.length);
            }
        });

        it("44. narrows to the object alternative once an object value is entered", () => {
            // Pre-existing behaviour of a value-driven object literal: the member the
            // value picked is the one input of the set that describes it.
            const filled = param("test::union::scalar", {a: 1});

            expect(filled.input).toBe("data");
            expect(filled.properties.a.input).toBe("number");
        });

        it("45. keeps the declared property schema of a half-filled object value", () => {
            const filled = param("test::union::scalar", {a: null});

            expect(filled.input).toBe("data");
            expect(filled.properties.a).toMatchObject({input: "number", type: "number"});
        });

        it("46. leaves the choice standing when a primitive value is entered", () => {
            // Current behaviour, pinned: a primitive value resolves the node side to
            // the declared union itself, so the slot keeps offering its alternatives
            // rather than narrowing the way an entered object literal does.
            expect(kinds(param("test::union::scalar", "y"))).toEqual(["text", "data"]);
            expect(kinds(param("test::union::text_or_bool", true))).toEqual(["text", "boolean"]);
            expect(kinds(param("test::union::methods_or_number", "GET"))).toEqual([
                "number",
                "select",
            ]);
        });

        it("47. surfaces a union input for an optional union parameter", () => {
            const optional = param("test::union::optional");

            expect(kinds(optional)).toEqual(["text", "number"]);
            expect(optional.type).toContain("undefined");
        });

        it("48. resolves two union parameters independently, each unblocked", () => {
            const [a, b] = probe("test::union::two", undefined, undefined);

            expect(kinds(a.schema)).toEqual(["text", "number"]);
            expect(kinds(b.schema)).toEqual(["text", "data"]);
            expect(a.blockedBy).toEqual([]);
            expect(b.blockedBy).toEqual([]);
        });

        it("49. surfaces a union input for a union return type, with no suggestions", () => {
            const flow: Flow = {
                id: "gid://sagittarius/Flow/1",
                startingNodeId: "gid://sagittarius/NodeFunction/1",
                signature: "(): void",
                nodes: {
                    nodes: [
                        {
                            id: "gid://sagittarius/NodeFunction/1",
                            functionDefinition: {identifier: "test::union::returns"},
                            parameters: {nodes: []},
                        },
                    ],
                },
            } as Flow;

            expect(
                getSignatureSchema(flow, DATA_TYPES, functions, "gid://sagittarius/NodeFunction/1")
                    .return,
            ).toEqual({
                input: "union",
                type: "string | boolean",
                items: [
                    {input: "text", type: "string"},
                    {input: "boolean", type: "boolean"},
                ],
            });
        });

        it("50. leaves an unconstrained generic parameter generic", () => {
            // A type parameter with no constraint is not a union of anything: it
            // still accepts everything, and `generic` is the right answer for it.
            expect(param("test::union::generic").input).toBe("generic");
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Nested positions are deliberately unchanged: an object property and a list
    // element already enumerate a union's members themselves — a property as an
    // array of schemas, an element as one `declaredItems` entry per member — and
    // neither switches to the union input.
    // ─────────────────────────────────────────────────────────────────────────
    describe("nested positions (unchanged)", () => {

        it("51. keeps a union-typed property an array of member schemas", () => {
            const property = type("OBJECT<{u: TEXT | OBJECT<{a: NUMBER}>}>").properties.u;

            expect(Array.isArray(property)).toBe(true);
            expect(property.map((member: Schema) => member.input)).toEqual(["text", "data"]);
        });

        it("52. keeps a union list element one item per member", () => {
            const list = param("test::union::list");

            expect(list.input).toBe("list");
            expect(list.declaredItems.map((item: Schema) => item.input)).toEqual([
                "text",
                "data",
            ]);
        });

        it("53. still splits a boolean member of a nested union into true and false", () => {
            // Current behaviour, pinned rather than endorsed: the member split of a
            // list element (and of an object property) does not fold boolean, so its
            // internal `true | false` arrives as two boolean entries. The union
            // input folds them; these positions do not.
            const list = param("test::union::list_of_text_or_bool");

            expect(list.declaredItems.map((item: any) => `${item.input}:${item.type}`)).toEqual([
                "text:string",
                "boolean:false",
                "boolean:true",
            ]);
        });
    });
});
