import {describe, expect, it} from "vitest";
import {DataType, Flow, FunctionDefinition} from "@code0-tech/sagittarius-graphql-types";
import {getSignatureSchema, ListInput} from "../../src";
import {DATA_TYPES, FUNCTION_SIGNATURES} from "../data";

// Mirrors the `list-test` mock module: a structured entry data type, a function
// that consumes a list of them, and a function that produces exactly one.
const ENTRY: DataType = {
    __typename: "DataType",
    id: "gid://sagittarius/DataType/9400",
    identifier: "LIST_TEST_ENTRY",
    genericKeys: [],
    type: "{ label: string; amount: number; color: COLOR; tags: string[] }",
} as unknown as DataType;

const ENTRY_LIST: FunctionDefinition = {
    id: "gid://sagittarius/FunctionDefinition/9400",
    identifier: "std::test::entry_list",
    signature: "(entries: LIST<LIST_TEST_ENTRY>): NUMBER",
} as FunctionDefinition;

const CREATE_ENTRY: FunctionDefinition = {
    id: "gid://sagittarius/FunctionDefinition/9401",
    identifier: "std::test::create_entry",
    signature: "(label: TEXT, amount: NUMBER): LIST_TEST_ENTRY",
} as FunctionDefinition;

describe("list element producers", () => {
    it("marks the dedicated entry producer exact on the element slot", () => {
        const flow: Flow = {
            id: "gid://sagittarius/Flow/1",
            startingNodeId: "gid://sagittarius/NodeFunction/1",
            signature: "(): void",
            nodes: {
                nodes: [{
                    id: "gid://sagittarius/NodeFunction/1",
                    functionDefinition: {identifier: "std::test::entry_list"},
                    parameters: {nodes: [{value: null}]},
                }],
            },
        };

        const result = getSignatureSchema(
            flow,
            [...DATA_TYPES, ENTRY],
            [...FUNCTION_SIGNATURES, ENTRY_LIST, CREATE_ENTRY],
            "gid://sagittarius/NodeFunction/1",
        );

        const element = (result.parameters[0].schema as ListInput).declaredItems![0];
        expect(element.input).toBe("data");

        const exact = (element.suggestions ?? []).flatMap((value: any, index) =>
            element.suggestionCertainty![index].match === "exact" && value.__typename === "NodeFunction"
                ? [value.functionDefinition?.identifier] : []);

        expect(exact).toEqual(["std::test::create_entry"]);
    });
});
