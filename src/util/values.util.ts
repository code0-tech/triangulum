import ts, { NumberLiteralType, StringLiteralType } from "typescript";
import { LiteralValue } from "@code0-tech/sagittarius-graphql-types";

/**
 * Extracts literal values from a TypeScript type.
 *
 * This function recursively processes TypeScript types and extracts all literal values,
 * including string literals, number literals, and boolean literals. For union types,
 * it flattens and combines all literal values from each constituent type.
 *
 * @param type - The TypeScript type to extract values from
 * @returns An array of LiteralValue objects representing all literal values found in the type
 *
 * @example
 * // For a type like "red" | "blue" | 42
 * const values = getValues(type);
 * // Returns:
 * // [
 * //   { value: "red", __typename: "LiteralValue" },
 * //   { value: "blue", __typename: "LiteralValue" },
 * //   { value: "42" }
 * // ]
 */
export const getValues = (type: ts.Type): LiteralValue[] => {
  // Handle union types by recursively extracting values from each constituent type
  if (type.isUnion()) {
    return type.types.flatMap(getValues);
  }

  // Extract string literal values
  if (type.isStringLiteral()) {
    return [
      {
        value: (type as StringLiteralType).value,
        __typename: "LiteralValue",
      },
    ];
  }

  // Extract number literal values, converting to string representation
  if (type.isNumberLiteral()) {
    return [
      {
        value: (type as NumberLiteralType).value.toString(),
      },
    ];
  }

  // Extract boolean true literal values
  if ((type as any).intrinsicName === "true") {
    return [
      {
        value: true,
        __typename: "LiteralValue",
      },
    ];
  }

  // Extract boolean false literal values
  if ((type as any).intrinsicName === "false") {
    return [
      {
        value: false,
        __typename: "LiteralValue",
      },
    ];
  }

  // Return empty array if no literal values are found
  return [];
};
