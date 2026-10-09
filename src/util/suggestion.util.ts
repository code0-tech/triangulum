import ts from "typescript";
import {LiteralValue, NodeFunction, ReferenceValue, SubFlowValue} from "@code0-tech/sagittarius-graphql-types";

/**
 * A value a slot can be filled with: a literal option of the slot's own type, a
 * reference to something already in scope, a function node whose result is fed
 * into the slot, or a function bound as a sub-flow.
 */
export type SuggestionValue = NodeFunction | ReferenceValue | LiteralValue | SubFlowValue;

/**
 * How certain it is that a suggestion actually produces the slot's type.
 *
 * - `exact`: the candidate's own type is assignable to the slot's type. Picking
 *   it always yields a value the slot accepts.
 * - `possible`: the match was only reached by weakening one of the two sides —
 *   the candidate *can* produce a fitting value, but is not guaranteed to. See
 *   {@link SuggestionMatchReason} for what was weakened.
 *
 * Both kinds are offered: a `possible` candidate is frequently the one the user
 * wants (a generic `std::object::get`, a reference into an optional field). The
 * distinction exists so a consumer can tell "this slot has dedicated producers"
 * from "everything happens to fit here", and because a `possible` pick is the
 * case that may need a cast to type-check.
 */
export type SuggestionMatch = "exact" | "possible";

/**
 * Why a suggestion matched only possibly.
 *
 * - `unconstrained`: one of the two sides constrains nothing (`any`, `unknown`,
 *   `{}`) — the candidate fits every slot, or the slot is fit by every candidate.
 *   Either way the match says nothing about this pairing.
 * - `generic`: the candidate's type is a type parameter and the match was made
 *   against its constraint. A concrete instantiation may be narrower.
 * - `union-member`: the candidate is a union and only some of its members fit.
 *   Which member materializes is a runtime decision.
 * - `nullable`: the candidate may be `null`/`undefined` where the slot is not.
 *
 * Listed weakest first: a candidate weakened on several axes reports the first
 * of these that applies (see {@link weakestCertainty}).
 */
export type SuggestionMatchReason = "unconstrained" | "generic" | "union-member" | "nullable";

const REASONS_WEAKEST_FIRST: SuggestionMatchReason[] =
    ["unconstrained", "generic", "union-member", "nullable"];

/**
 * The certainty of a single suggestion. `reason` is present exactly when
 * `match` is `possible`.
 */
export interface SuggestionCertainty {
    match: SuggestionMatch;
    reason?: SuggestionMatchReason;
}

/**
 * A suggestion together with its certainty — the form suggestions travel in
 * while a schema is being built.
 *
 * On the finished schema the two halves are split into the index-aligned
 * `suggestions` / `suggestionCertainty` pair (see {@link Input}) so the
 * suggestion values stay plain GraphQL values a consumer can use as-is. Every
 * step in between passes candidates around instead of the two arrays, so the
 * alignment cannot drift.
 */
export interface SuggestionCandidate {
    value: SuggestionValue;
    certainty: SuggestionCertainty;
}

/** The certainty of a candidate that is guaranteed to fit its slot. */
export const EXACT_MATCH: SuggestionCertainty = {match: "exact"};

/** The certainty of a candidate that fits only under the given condition. */
export const possibleMatch = (reason: SuggestionMatchReason): SuggestionCertainty => ({
    match: "possible",
    reason,
});

/** Pairs each value with {@link EXACT_MATCH}, for sources that cannot be weakened. */
export const exactCandidates = (values: SuggestionValue[]): SuggestionCandidate[] =>
    values.map((value) => ({value, certainty: EXACT_MATCH}));

/**
 * Picks the stronger of two certainties for the same value — `exact` wins, and
 * among two `possible` ones the first is kept. Used when the same suggestion is
 * collected twice against differently scoped types (see the merge in
 * getSignatureSchema): the slot accepts it for the better of the two reasons.
 */
export const strongerCertainty = (
    a: SuggestionCertainty,
    b: SuggestionCertainty,
): SuggestionCertainty => (a.match === "exact" || b.match !== "exact" ? a : b);

/**
 * Picks the weakest of the given certainties: a candidate weakened on more than
 * one axis (e.g. a generic return that also turns out to be `any`) is only as
 * strong as its weakest link. `exact` is the result only when nothing was
 * weakened at all.
 */
export const weakestCertainty = (...certainties: SuggestionCertainty[]): SuggestionCertainty => {
    const weakest = REASONS_WEAKEST_FIRST.find((reason) =>
        certainties.some((certainty) => certainty.reason === reason));

    return weakest ? possibleMatch(weakest) : EXACT_MATCH;
};

/**
 * True for a type that constrains nothing, so an assignability test against it
 * is vacuous: `any` and `unknown`, the empty object type — `{}`, which every
 * non-nullish value satisfies and which is what a generic `OBJECT<T>` or an
 * uninstantiated payload bound resolves to — and an object whose only structure
 * is an index signature that says nothing about its values either. That last
 * case is what an `OBJECT<T>` instantiated without an argument resolves to:
 * `{[key: string]: any}`, a slot every object fits. A signature with a real
 * value type (`Record<string, NUMBER>`) does constrain, and keeps its slot
 * concrete.
 *
 * It matters on both sides of a match. A candidate of this type fits every slot,
 * and a *slot* of this type is fitted by every candidate — the second case is
 * the one that would otherwise report a hundred exact "producers" for a slot
 * that simply accepts anything.
 *
 * A callable, an array and anything with properties is excluded: those
 * constrain their values. An index signature is inspected only `depth` levels
 * deep (one, from the outside) because an index type may refer back to its own
 * container (`type Json = {[key: string]: Json}`).
 */
export const isUnconstrainedType = (type: ts.Type | undefined, depth: number = 1): boolean => {
    // A missing index signature constrains nothing about values behind it either.
    if (type === undefined) return true;
    if ((type.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)) !== 0) return true;
    if ((type.flags & ts.TypeFlags.Object) === 0) return false;

    return type.getProperties().length === 0
        && type.getCallSignatures().length === 0
        && type.getConstructSignatures().length === 0
        && (depth === 0
            ? type.getNumberIndexType() === undefined && type.getStringIndexType() === undefined
            : isUnconstrainedType(type.getNumberIndexType(), depth - 1)
            && isUnconstrainedType(type.getStringIndexType(), depth - 1));
};

/**
 * Decides whether a candidate type fits an expected (slot) type, and how
 * certainly — the shared rule behind every assignability-based suggestion
 * source.
 *
 * Returns `null` when the candidate does not fit at all. Otherwise the match is
 * `exact`, or `possible` with the reason the fit is not guaranteed:
 *
 * - either side constrains nothing (`any`, `unknown`, `{}`) → `unconstrained`.
 *   For the candidate that means it fits everywhere; for the slot that it is
 *   fitted by everything. Neither tells the consumer that this candidate is a
 *   producer *of this type*, which is the whole point of the distinction. This
 *   only *weakens* the verdict — whether the candidate fits at all is still
 *   decided by assignability, so an open candidate is not waved through into a
 *   slot that would reject it;
 * - the candidate is a union and only some members fit → `union-member`. A
 *   union is only assignable as a whole when *every* member is, so the partial
 *   case is exactly the one strict assignability would reject while the slot can
 *   still be served at runtime;
 * - the candidate may be nullish where the slot is not → `nullable`. The nullish
 *   part is deliberately ignored for matching (a `string | null` producer is a
 *   useful suggestion for a `string` slot), which is what makes the distinction
 *   worth reporting.
 *
 * A purely nullish candidate strips down to `never`, which is assignable to
 * anything, and is therefore rejected explicitly.
 */
export const typeMatchCertainty = (
    type: ts.Type,
    checker: ts.TypeChecker,
    expectedType: ts.Type,
): SuggestionCertainty | null => {
    const nonNullable = checker.getNonNullableType(type);

    if ((nonNullable.flags & ts.TypeFlags.Never) !== 0) return null;

    // A non-union candidate is its own single member, which makes the partial
    // match below impossible for it and the assignability test the same one.
    const members = nonNullable.isUnion()
        ? nonNullable.types.map((member) => checker.getNonNullableType(member))
        : [nonNullable];
    const matching = members.filter((member) =>
        (member.flags & ts.TypeFlags.Never) === 0
        && checker.isTypeAssignableTo(member, expectedType));

    if (matching.length === 0) return null;

    return weakestCertainty(
        isUnconstrainedType(nonNullable) || isUnconstrainedType(expectedType)
            ? possibleMatch("unconstrained")
            : EXACT_MATCH,
        nonNullable !== type && !checker.isTypeAssignableTo(type, expectedType)
            ? possibleMatch("nullable")
            : EXACT_MATCH,
        matching.length < members.length ? possibleMatch("union-member") : EXACT_MATCH,
    );
};

/**
 * Reads a schema's suggestions back as candidates. A schema that carries
 * suggestions without certainties (produced before the pair existed, or hand
 * written) is read as fully exact rather than rejected.
 */
export const suggestionCandidates = (schema: {
    suggestions?: SuggestionValue[];
    suggestionCertainty?: SuggestionCertainty[];
}): SuggestionCandidate[] =>
    (schema.suggestions ?? []).map((value, index) => ({
        value,
        certainty: schema.suggestionCertainty?.[index] ?? EXACT_MATCH,
    }));

/**
 * Splits candidates into the schema's index-aligned pair of keys, both keys
 * always present — the convention of a freshly collected schema, which carries
 * the keys even when nothing matched (an empty array marks "this is an input
 * slot and these are all its candidates", which normalizeNodeSchema then
 * collapses). Use {@link suggestionFields} everywhere else.
 */
export const suggestionPair = (
    candidates: SuggestionCandidate[],
): {suggestions: SuggestionValue[]; suggestionCertainty: SuggestionCertainty[]} => ({
    suggestions: candidates.map((candidate) => candidate.value),
    suggestionCertainty: candidates.map((candidate) => candidate.certainty),
});

/**
 * Splits candidates back into the schema's index-aligned pair of keys. Both keys
 * are omitted for an empty set, matching the convention that a schema without
 * suggestions carries neither key.
 */
export const suggestionFields = (
    candidates: SuggestionCandidate[] | undefined,
): {suggestions?: SuggestionValue[]; suggestionCertainty?: SuggestionCertainty[]} =>
    candidates && candidates.length > 0 ? suggestionPair(candidates) : {};
