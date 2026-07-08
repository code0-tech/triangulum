import ts from "typescript";
import {ReferencePath, ReferenceValue} from "@code0-tech/sagittarius-graphql-types";

/**
 * Extracts reference values from a collection of TypeScript symbols.
 *
 * This function processes symbols with specific prefixes (node_, p_, flow_) and creates
 * corresponding ReferenceValue objects. It filters out invalid symbols and symbols that
 * are declared after the current node position.
 *
 * @param checker - TypeScript TypeChecker instance for type information resolution
 * @param node - The VariableDeclaration context in which symbols are analyzed
 * @param paramType - The expected parameter type for property matching during extraction
 * @param symbols - The array of symbols to process and analyze
 * @returns An array of ReferenceValue objects representing extracted references with their paths
 *
 * @example
 * // Extracts all references from symbols prefixed with node_, p_, or flow_
 * const references = getReferences(checker, variableDecl, expectedType, [symbol1, symbol2]);
 */
export const getReferences = (
  checker: ts.TypeChecker,
  node: ts.VariableDeclaration,
  paramType: ts.Type,
  symbols: ts.Symbol[]
): ReferenceValue[] => {
  return symbols.flatMap((symbol) => {
    const name = symbol.getName();

    // Filter symbols by required prefix
    if (!isValidSymbolPrefix(name)) {
      return [];
    }

    // Validate symbol declaration exists and is declared before current node
    const symbolDeclaration = symbol.getDeclarations()?.[0];
    if (!symbolDeclaration || symbolDeclaration.getEnd() >= node.getEnd()!) {
      return [];
    }

    const symbolType = checker.getTypeOfSymbolAtLocation(symbol, node);

    // Process symbol based on its prefix
    if (name.startsWith("node_")) {
      return processNodeSymbol(name, symbolType, checker, paramType);
    } else if (name.startsWith("p_")) {
      return processParameterSymbol(name, symbolType, checker, paramType);
    } else if (name.startsWith("flow_")) {
      return processFlowSymbol(symbolType, checker, paramType);
    }

    return [];
  });
};

/**
 * Checks if a symbol name has a valid prefix for reference extraction.
 *
 * Valid prefixes are: node_, p_, flow_
 *
 * @param name - The symbol name to validate
 * @returns True if the name starts with a valid prefix, false otherwise
 */
const isValidSymbolPrefix = (name: string): boolean => {
  return name.startsWith("node_") || name.startsWith("p_") || name.startsWith("flow_");
};

/**
 * Processes a node symbol and creates corresponding reference values.
 *
 * Node symbols represent references to node functions. The function extracts the node ID
 * from the symbol name by reversing the name encoding, then extracts all matching object
 * properties from the symbol type.
 *
 * @param name - The symbol name starting with "node_"
 * @param symbolType - The TypeScript type of the symbol
 * @param checker - TypeScript TypeChecker for type operations
 * @param paramType - The expected parameter type for property matching
 * @returns Array of ReferenceValue objects for this node symbol
 */
const processNodeSymbol = (
  name: string,
  symbolType: ts.Type,
  checker: ts.TypeChecker,
  paramType: ts.Type
): ReferenceValue[] => {
  // Skip void types
  if ((symbolType.flags & ts.TypeFlags.Void) !== 0) {
    return [];
  }

  // Decode the node function ID from the symbol name
  const nodeFunctionId = decodeIdentifier(name.replace("node_", ""));

  // Extract all properties that match the expected parameter type
  const propertyPaths = extractObjectProperties(symbolType, checker, paramType);

  return propertyPaths.flatMap(({ path }) => {
    const referenceValue: ReferenceValue = {
      __typename: "ReferenceValue",
      nodeFunctionId: nodeFunctionId as any,
    };

    if (path.length > 0) {
      referenceValue.referencePath = path;
    }

    return referenceValue;
  });
};

/**
 * Processes a parameter symbol and creates corresponding reference values.
 *
 * Parameter symbols represent references to function parameters. They contain encoded
 * information about the node function ID, parameter index, and input index. If the symbol
 * type is a tuple, each tuple element is processed separately.
 *
 * @param name - The symbol name starting with "p_"
 * @param symbolType - The TypeScript type of the symbol
 * @param checker - TypeScript TypeChecker for type operations
 * @param paramType - The expected parameter type for property matching
 * @returns Array of ReferenceValue objects for this parameter symbol
 */
const processParameterSymbol = (
  name: string,
  symbolType: ts.Type,
  checker: ts.TypeChecker,
  paramType: ts.Type
): ReferenceValue[] => {
  // Decode parameter information from symbol name
  const { nodeFunctionId, paramIndexFromName } = decodeParameterName(name);

  // If the symbol type is not a tuple, return empty array
  if (!checker.isTupleType(symbolType)) {
    return [];
  }

  const typeReference = symbolType as ts.TypeReference;
  const typeArguments = checker.getTypeArguments(typeReference);

  return typeArguments.flatMap((tupleElementType, tupleIndex) => {
    const propertyPaths = extractObjectProperties(tupleElementType, checker, paramType);

    return propertyPaths.flatMap(({ path }) => {
      const referenceValue: ReferenceValue = {
        __typename: "ReferenceValue",
        nodeFunctionId: nodeFunctionId as any,
        parameterIndex: isNaN(paramIndexFromName) ? 0 : paramIndexFromName,
        inputIndex: tupleIndex,
        inputTypeIdentifier: (typeReference.target as any).labeledElementDeclarations?.[
          tupleIndex
        ].name.getText(),
      };

      if (path.length > 0) {
        referenceValue.referencePath = path;
      }

      return referenceValue;
    });
  });
};

/**
 * Processes a flow symbol and creates corresponding reference values.
 *
 * Flow symbols represent references within data flows. They do not have an associated
 * node function ID (it is null) and extract properties that match the expected type.
 *
 * @param symbolType - The TypeScript type of the symbol
 * @param checker - TypeScript TypeChecker for type operations
 * @param paramType - The expected parameter type for property matching
 * @returns Array of ReferenceValue objects for this flow symbol
 */
const processFlowSymbol = (
  symbolType: ts.Type,
  checker: ts.TypeChecker,
  paramType: ts.Type
): ReferenceValue[] => {
  const propertyPaths = extractObjectProperties(symbolType, checker, paramType);

  return propertyPaths.flatMap(({ path }) => {
    const referenceValue: ReferenceValue = {
      __typename: "ReferenceValue",
      nodeFunctionId: null,
    };

    if (path.length > 0) {
      referenceValue.referencePath = path;
    }

    return referenceValue;
  });
};

/**
 * Decodes an encoded identifier string back to its original form.
 *
 * The encoding scheme is:
 * - ___ → ://
 * - __ → /
 * - _ → /
 *
 * @param encoded - The encoded identifier string
 * @returns The decoded identifier
 */
const decodeIdentifier = (encoded: string): string => {
  return encoded.replace(/___/g, "://").replace(/__/g, "/").replace(/_/g, "/");
};

/**
 * Decodes parameter name to extract node function ID and parameter index.
 *
 * The parameter name format is: p_<rawId>_<paramIndex>
 * The rawId is then decoded using decodeIdentifier.
 *
 * @param name - The parameter symbol name
 * @returns Object containing decoded nodeFunctionId and paramIndexFromName
 */
const decodeParameterName = (name: string): { nodeFunctionId: string; paramIndexFromName: number } => {
  const idPart = name.replace("p_", "");
  const lastUnderscoreIndex = idPart.lastIndexOf("_");
  const rawId = idPart.substring(0, lastUnderscoreIndex);
  const paramIndexFromName = parseInt(idPart.substring(lastUnderscoreIndex + 1), 10);

  const nodeFunctionId = decodeIdentifier(rawId);

  return { nodeFunctionId, paramIndexFromName };
};

/**
 * Recursively extracts object properties from a type that match an expected type.
 *
 * This function performs a depth-first traversal of an object's property tree. It collects
 * all paths (property chains) where the type at that path is assignable to the expected type.
 * For example, if type is {a: {b: string}} and expectedType is string, it returns the path [a, b].
 *
 * The recursion continues into nested object properties, building up the path as it traverses.
 * Primitive types (string, number, boolean, etc.) are treated as leaf nodes.
 *
 * @param type - The type to extract properties from
 * @param checker - TypeScript TypeChecker for type comparison operations
 * @param expectedType - The target type to match when extracting properties
 * @param currentPath - The current property path being built during recursion (default: empty array)
 * @returns An array of objects containing the property path and the type at that path
 *
 * @example
 * // For type {user: {name: string, age: number}} with expectedType = string
 * // Returns: [{path: [{path: 'user'}, {path: 'name'}], type: stringType}]
 */
const extractObjectProperties = (
  type: ts.Type,
  checker: ts.TypeChecker,
  expectedType: ts.Type,
  currentPath: ReferencePath[] = []
): Array<{ path: ReferencePath[]; type: ts.Type }> => {
  const results: Array<{ path: ReferencePath[]; type: ts.Type }> = [];

  // Check if the current type matches the expected type. The nullish part of a
  // candidate is ignored: a reference typed `string | null` (or an optional
  // property `text?: string | null`) is still a valid suggestion for a plain
  // `string` parameter — strict assignability would reject it under strictNullChecks.
  // A purely nullish candidate strips down to `never` (assignable to anything),
  // so it must be excluded explicitly.
  const nonNullableType = checker.getNonNullableType(type);
  if (
    (nonNullableType.flags & ts.TypeFlags.Never) === 0 &&
    checker.isTypeAssignableTo(nonNullableType, expectedType)
  ) {
    results.push({ path: currentPath, type });
  }

  // Recursively traverse into object properties
  if (isRealObjectType(type)) {
    const properties = type.getProperties();
    if (properties && properties.length > 0) {
      properties.forEach((property) => {
        const propType = checker.getTypeOfSymbolAtLocation(property, property.valueDeclaration!);
        const propName = property.getName();
        const newPath = [...currentPath, { path: propName }];

        // Recurse into nested properties
        results.push(...extractObjectProperties(propType, checker, expectedType, newPath));
      });
    }
  }

  return results;
};

/**
 * Determines whether a type is a real object type or a primitive.
 *
 * This function checks if a type is NOT one of the primitive types (string, number, boolean,
 * undefined, null, bigint, symbol). Any type that is not a primitive is considered a real object type.
 *
 * @param type - The type to check
 * @returns True if the type is a real object type, false if it's a primitive type
 *
 * @example
 * isRealObjectType(stringType) // false
 * isRealObjectType(objectType) // true
 * isRealObjectType(numberType) // false
 */
const isRealObjectType = (type: ts.Type): boolean => {
  const primitiveFlags =
    ts.TypeFlags.String |
    ts.TypeFlags.Number |
    ts.TypeFlags.Boolean |
    ts.TypeFlags.Undefined |
    ts.TypeFlags.Null |
    ts.TypeFlags.BigInt |
    ts.TypeFlags.ESSymbol;

  return (type.flags & primitiveFlags) === 0;
};
