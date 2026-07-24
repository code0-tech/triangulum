import {describe, expect, it} from "vitest";
import {DataType, Flow, FunctionDefinition} from "@code0-tech/sagittarius-graphql-types";
import {getSignatureSchema} from "../../src";
import {DATA_TYPES, FUNCTION_SIGNATURES} from "../data";

// A single two-parameter node calling `identifier`, probed at that node. Returns
// the input kind and blockedBy list for each of the two parameters.
const probeTwoParam = (
    identifier: string,
    extraDataTypes: DataType[],
    extraFunctions: FunctionDefinition[],
    v0: any,
    v1: any,
) => {
    const flow: Flow = {
        id: "gid://sagittarius/Flow/1",
        startingNodeId: "gid://sagittarius/NodeFunction/1",
        signature: "(): void",
        nodes: {
            nodes: [
                {
                    id: "gid://sagittarius/NodeFunction/1",
                    functionDefinition: {identifier},
                    parameters: {nodes: [{value: v0}, {value: v1}]},
                },
            ],
        },
    };
    return getSignatureSchema(
        flow,
        [...DATA_TYPES, ...extraDataTypes],
        [...FUNCTION_SIGNATURES, ...extraFunctions],
        "gid://sagittarius/NodeFunction/1",
    ).parameters.map((p) => ({input: p.schema.input, blockedBy: p.blockedBy}));
};

const lit = (value: any) => ({__typename: "LiteralValue", value});

describe("Schema — circular / conditional parameter dependencies", () => {

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario A: distinct generics, each used in exactly ONE parameter.
    //   <L, R>(left: CIRC_LEFT<R>, right: CIRC_RIGHT<L>)
    // The two parameters mutually depend on each other, but because no single
    // generic is shared across both parameters, the shared-generic detector never
    // records a dependency. Neither is ever blocked.
    // ─────────────────────────────────────────────────────────────────────────
    describe("distinct generics, one per parameter (dependency invisible)", () => {
        const dataTypes: DataType[] = [
            {identifier: "CIRC_LEFT", genericKeys: ["T"], type: "T extends 'json' ? OBJECT<{}> : string"},
            {identifier: "CIRC_RIGHT", genericKeys: ["T"], type: "T extends string ? 'json' : 'text'"},
        ];
        const fn: FunctionDefinition = {
            id: "gid://sagittarius/FunctionDefinition/9100",
            identifier: "custom::test::circular_distinct",
            signature: "<L, R>(left: CIRC_LEFT<R>, right: CIRC_RIGHT<L>): void",
        };
        const probe = (v0: any, v1: any) =>
            probeTwoParam("custom::test::circular_distinct", dataTypes, [fn], v0, v1);

        it("never blocks either parameter, for any combination of values", () => {
            for (const [l, r] of [
                [null, null],
                [lit({}), null],
                [null, lit("json")],
                [lit({}), lit("json")],
            ] as const) {
                const [left, right] = probe(l, r);
                expect(left.blockedBy).toEqual([]);
                expect(right.blockedBy).toEqual([]);
            }
        });

        it("resolves each conditional to its unbound-generic (false) branch → both text", () => {
            // CIRC_LEFT<R>  → R extends 'json' ? OBJECT<{}> : string → string → "text"
            // CIRC_RIGHT<L> → L extends string ? 'json' : 'text'     → 'text'  → "text"
            for (const [l, r] of [
                [null, null],
                [lit({}), lit("json")],
            ] as const) {
                const [left, right] = probe(l, r);
                expect(left.input).toBe("text");
                expect(right.input).toBe("text");
            }
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario B: both generics shared across both parameters, conditional falls
    // back to a CONCRETE type.
    //   <L, R>(left: CIRC_LEFT<L, R>, right: CIRC_RIGHT<L, R>)
    // A dependency IS detected (right depends on left), but the second check drops
    // it because `right`'s conditional always lands on a concrete branch — so it
    // never looks unresolved. Nothing is blocked.
    // ─────────────────────────────────────────────────────────────────────────
    describe("shared generics, conditional with concrete fallback (never blocked)", () => {
        const dataTypes: DataType[] = [
            {identifier: "CIRC_LEFT", genericKeys: ["L", "R"], type: "L extends 'json' ? OBJECT<{}> : R extends string ? string : number"},
            {identifier: "CIRC_RIGHT", genericKeys: ["L", "R"], type: "R extends 'json' ? OBJECT<{}> : L extends string ? string : number"},
        ];
        const fn: FunctionDefinition = {
            id: "gid://sagittarius/FunctionDefinition/9101",
            identifier: "custom::test::circular_concrete",
            signature: "<L, R>(left: CIRC_LEFT<L, R>, right: CIRC_RIGHT<L, R>): void",
        };
        const probe = (v0: any, v1: any) =>
            probeTwoParam("custom::test::circular_concrete", dataTypes, [fn], v0, v1);

        it("never blocks either parameter, because the dependent always has a concrete type", () => {
            for (const [l, r] of [
                [null, null],
                [lit({}), null],
                [null, lit({})],
                [lit({}), lit({})],
            ] as const) {
                const [left, right] = probe(l, r);
                expect(left.blockedBy).toEqual([]);
                expect(right.blockedBy).toEqual([]);
                // The unbound conditionals collapse to their innermost `number` branch.
                expect(left.input).toBe("number");
                expect(right.input).toBe("number");
            }
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario C: both generics shared across both parameters, conditional falls
    // back to a BARE generic (so nothing resolves until the other side binds it).
    //   <L, R>(left: CIRC_LEFT<L, R>, right: CIRC_RIGHT<L, R>)
    // Now the dependency both (1) is detected and (2) survives the concrete-type
    // check, so `right` is genuinely blocked by `left`.
    // ─────────────────────────────────────────────────────────────────────────
    describe("shared generics, bare-generic fallback (right blocked by left)", () => {
        const dataTypes: DataType[] = [
            {identifier: "CIRC_LEFT", genericKeys: ["L", "R"], type: "L extends 'json' ? OBJECT<{}> : R"},
            {identifier: "CIRC_RIGHT", genericKeys: ["L", "R"], type: "R extends 'json' ? OBJECT<{}> : L"},
        ];
        const fn: FunctionDefinition = {
            id: "gid://sagittarius/FunctionDefinition/9102",
            identifier: "custom::test::circular_bare",
            signature: "<L, R>(left: CIRC_LEFT<L, R>, right: CIRC_RIGHT<L, R>): void",
        };
        const probe = (v0: any, v1: any) =>
            probeTwoParam("custom::test::circular_bare", dataTypes, [fn], v0, v1);

        it("blocks right by left while nothing is set; left (index 0) is never blocked", () => {
            const [left, right] = probe(null, null);
            // left is the FIRST user of the shared generics → treated as the source,
            // never blocked.
            expect(left.blockedBy).toEqual([]);
            expect(left.input).toBe("generic");
            // right depends on left. Both L and R produce the same dependency, so the
            // index appears twice (the mechanism does not de-duplicate).
            expect(right.blockedBy).toEqual([0, 0]);
            expect(right.input).toBe("generic");
        });

        it("unblocks right once left is provided", () => {
            const [left, right] = probe(lit("json"), null);
            expect(left.blockedBy).toEqual([]);
            expect(right.blockedBy).toEqual([]);
        });

        it("never blocks left, whichever side is set", () => {
            for (const [l, r] of [
                [null, null],
                [lit("json"), null],
                [null, lit("json")],
                [lit("json"), lit("json")],
            ] as const) {
                expect(probe(l, r)[0].blockedBy).toEqual([]);
            }
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Scenario D: asymmetric — the dependent's generic sits only in the CHECK
    // position of its own conditional, so it can never be inferred from the
    // dependent's own value.
    //   CIRC_LEFT<L,R>  = L extends 'json' ? OBJECT<{}> : R          (R inferable here)
    //   CIRC_RIGHT<L,R> = R extends 'json' ? OBJECT<{}> : undefined  (R only in check pos.)
    // `right` can only be unblocked by `left` (which binds R); filling `right`'s
    // own value does NOT unblock it.
    // ─────────────────────────────────────────────────────────────────────────
    describe("check-position generic (right unblockable only by left)", () => {
        const dataTypes: DataType[] = [
            {identifier: "CIRC_LEFT", genericKeys: ["L", "R"], type: "L extends 'json' ? OBJECT<{}> : R"},
            {identifier: "CIRC_RIGHT", genericKeys: ["L", "R"], type: "R extends 'json' ? OBJECT<{}> : undefined"},
        ];
        const fn: FunctionDefinition = {
            id: "gid://sagittarius/FunctionDefinition/9103",
            identifier: "custom::test::circular_check",
            signature: "<L, R>(left: CIRC_LEFT<L, R>, right: CIRC_RIGHT<L, R>): void",
        };
        const probe = (v0: any, v1: any) =>
            probeTwoParam("custom::test::circular_check", dataTypes, [fn], v0, v1);

        it("blocks right while left is empty", () => {
            const [left, right] = probe(null, null);
            expect(left.blockedBy).toEqual([]);
            expect(right.blockedBy).toEqual([0, 0]);
        });

        it("does NOT unblock right when only right's own value is set", () => {
            // right's generic R is only in the check position of its conditional, so
            // TypeScript cannot infer R from right's value → right stays blocked on
            // left. The input shows "data" merely because a value was supplied (the
            // schema falls back to an open object for the UI), even though the block
            // remains.
            const [left, right] = probe(null, lit("json"));
            expect(left.blockedBy).toEqual([]);
            expect(right.blockedBy).toEqual([0, 0]);
            expect(right.input).toBe("data");
        });

        it("unblocks right when left is set (the only thing that binds R)", () => {
            const [leftOnly] = [probe(lit("json"), null)];
            expect(leftOnly[1].blockedBy).toEqual([]);

            const bothSet = probe(lit("json"), lit("json"));
            expect(bothSet[1].blockedBy).toEqual([]);
        });

        it("never blocks left", () => {
            for (const [l, r] of [
                [null, null],
                [lit("json"), null],
                [null, lit("json")],
                [lit("json"), lit("json")],
            ] as const) {
                expect(probe(l, r)[0].blockedBy).toEqual([]);
            }
        });
    });
});
