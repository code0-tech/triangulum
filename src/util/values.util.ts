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
const getLiteralsFromTypeNode = (node: ts.TypeNode): LiteralValue[] => {
  if (ts.isUnionTypeNode(node)) return node.types.flatMap(getLiteralsFromTypeNode)
  if (ts.isLiteralTypeNode(node)) {
    const lit = node.literal
    if (ts.isStringLiteral(lit)) return [{value: lit.text, __typename: "LiteralValue"}]
    if (ts.isNumericLiteral(lit)) return [{value: Number(lit.text)}]
    if (lit.kind === ts.SyntaxKind.TrueKeyword) return [{value: true, __typename: "LiteralValue"}]
    if (lit.kind === ts.SyntaxKind.FalseKeyword) return [{value: false, __typename: "LiteralValue"}]
  }
  return []
}

export const getValues = (type: ts.Type, checker?: ts.TypeChecker): LiteralValue[] => {
  // When a type comes from an alias (e.g. HTTP_AUTH_TYPE), TypeScript simplifies
  // 'Bearer' | string → string, losing the literals. Read them directly from the
  // alias declaration's AST instead, which preserves the original union members.
  if (checker && type.aliasSymbol) {
    const decl = type.aliasSymbol.declarations?.[0]
    if (decl && ts.isTypeAliasDeclaration(decl)) {
      return getLiteralsFromTypeNode(decl.type)
    }
  }

  // Handle union types by recursively extracting values from each constituent type
  if (type.isUnion()) {
    return type.types.flatMap(t => getValues(t, checker));
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
