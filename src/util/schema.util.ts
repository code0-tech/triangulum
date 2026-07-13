import ts, {FunctionDeclaration} from "typescript";
import {getValues} from "./values.util";
import {getReferences, isRecursiveType} from "./references.util";
import {getNodes} from "./nodes.util";
import {
    FunctionDefinition,
    LiteralValue,
    NodeFunction,
    ReferenceValue,
    SubFlowValue,
} from "@code0-tech/sagittarius-graphql-types";
import {getSubFlows} from "./subflows.util";


/**
 * Base interface for all input types.
 * Provides common properties for suggestions and input metadata.
 */
export interface Input {
    /** The type of input (string representation) */
    input?: string;
    /** Array of suggested values (functions, references, or literals) */
    suggestions?: (NodeFunction | ReferenceValue | LiteralValue | SubFlowValue)[];
}

/**
 * Represents a generic input type with no specific structure.
 * Used as a fallback when the type cannot be determined.
 */
export interface GenericInput extends Input {
    input?: "generic";
}

/**
 * Represents a sub-flow input type (callable/function type).
 * Used for types that have call signatures.
 */
export interface SubFlowInput extends Input {
    input?: "sub-flow";
}

/**
 * Represents primitive input types: boolean, number, text, or select.
 * Extends the base Input interface to include suggestions.
 */
export interface PrimitiveInput extends Input {
    input?: "boolean" | "number" | "text" | "select";
}

/**
 * Represents a data object input type with structured properties.
 * Includes property definitions and required field tracking.
 */
export interface DataInput extends Input {
    input?: "data";
    /** Record mapping property names to their schemas */
    properties?: Record<string, Schema | Schema[]>;
    /** Array of required property names */
    required?: string[];
}

/**
 * Represents a list/array input type with item schemas.
 * Supports homogeneous or heterogeneous arrays.
 */
export interface ListInput extends Input {
    input?: "list";
    /** Schema or array of schemas for list items */
    items?: Schema[];
}

/**
 * Represents a complex type input with properties and required fields.
 * Similar to DataInput but used for type definitions.
 */
export interface TypeInput extends Input {
    input?: "type";
    /** Record mapping property names to their schemas */
    properties?: Record<string, Schema | Schema[]>;
    /** Array of required property names */
    required?: string[];
}

/**
 * Union type representing all possible schema input types.
 * Discriminated union based on the 'input' field.
 */
export type Schema =
    | PrimitiveInput
    | DataInput
    | ListInput
    | TypeInput
    | SubFlowInput
    | GenericInput;


/**
 * Maximum object nesting depth for schema generation through recursive data
 * types. Same policy as reference path extraction: the visited set keeps each
 * individual branch finite, but a cluster of mutually recursive types still
 * allows combinatorially many simple paths, so those are additionally
 * depth-capped. Non-recursive nesting is expanded exhaustively.
 */
const MAX_SCHEMA_DEPTH = 7;

/**
 * Generates a schema definition for a given TypeScript type.
 *
 * This function analyzes a TypeScript type and produces a structured schema
 * that describes how the type should be presented and validated. It handles:
 * - Primitive types (boolean, number, string)
 * - Union types of primitives
 * - Array/Tuple types
 * - Complex object types with properties
 * - Sub-flow types (callables)
 *
 * For each type, the function also collects suggestions from:
 * - Literal values from the type definition
 * - Variable references available in scope
 * - Function node suggestions based on parameter type
 *
 * @param checker - TypeScript type checker for type analysis
 * @param node - The variable declaration node being analyzed
 * @param parameterType - The type to generate a schema for
 * @param functionDeclarations - Array of function declaration nodes
 * @param functions - Array of function definitions for matching
 * @param suggestions
 * @returns A Schema object describing how to handle the parameter type
 */
export const getSchema = (
    checker: ts.TypeChecker,
    node: ts.VariableDeclaration | undefined,
    parameterType: ts.Type,
    functionDeclarations: FunctionDeclaration[],
    functions: FunctionDefinition[],
    suggestions: boolean = true,
    suggestionType?: ts.Type,
    visited: Set<ts.Type> = new Set(),
    recursionCache: Map<ts.Type, boolean> = new Map(),
): Schema => {

    if ((parameterType.flags & ts.TypeFlags.TypeParameter) !== 0) {
        const decl = parameterType.symbol?.declarations?.[0]
        if (decl && ts.isTypeParameterDeclaration(decl) && decl.constraint) {
            // getTypeFromTypeNode statt getBaseConstraintOfType → aliasSymbol bleibt erhalten
            const constraintType = checker.getTypeFromTypeNode(decl.constraint)
            return getSchema(checker, node, constraintType, functionDeclarations, functions, suggestions, suggestionType, visited, recursionCache)
        }
    }

    // Suggestions are filtered by what the surrounding function accepts, not by
    // the narrower type a current value happens to narrow the node-side to.
    // Example: `<T>(value: T)` with a current boolean literal must still surface
    // every reference in scope, because the function takes anything.
    const typeForSuggestions = suggestionType ?? parameterType;

    // Collect all available suggestions for this parameter
    const combinedSuggestions = suggestions ? {
        suggestions: [
            ...getValues(typeForSuggestions, checker),
            ...(node ? getReferences(
                checker,
                node,
                typeForSuggestions,
                checker.getSymbolsInScope(node, ts.SymbolFlags.Variable)
            ) : []),
            ...getNodes(
                checker,
                functionDeclarations,
                functions,
                typeForSuggestions
            ),
            ...getSubFlows(
                checker,
                functionDeclarations,
                functions,
                typeForSuggestions
            ),
        ],
    } : {};

    // Strip undefined and null from unions (e.g. string | undefined | null → string).
    // Suggestions are collected above from the original type (preserving aliasSymbol literals),
    // the base schema is determined from the stripped type, then both are merged.
    if (parameterType.isUnion()) {
        const nonNullish = parameterType.types.filter(
            (t) => (t.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)) === 0
        )
        if (nonNullish.length === 1) {
            const baseSchema = getSchema(checker, node, nonNullish[0], functionDeclarations, functions, false, undefined, visited, recursionCache)
            return {...baseSchema, ...combinedSuggestions}
        }
    }

    // Boolean is internally represented by TypeScript as the union `true | false`,
    // so it must be detected before the primitive-literal-union check below; otherwise
    // `boolean` (and `true | false`) would incorrectly surface as a select.
    if (isBoolean(parameterType)) {
        return {input: "boolean", ...combinedSuggestions};
    }

    // Check primitive literal union first (e.g., "a" | "b" | "c") or a single
    // string/number literal (e.g., "GET"). A bare literal has only one allowed
    // value, so it should still surface as a select rather than a free-form text/number input.
    if (isPrimitiveLiteralUnion(parameterType) || isStringOrNumberLiteral(parameterType)) {
        return {input: "select", ...combinedSuggestions};
    }
    if (isNumber(parameterType)) {
        return {input: "number", ...combinedSuggestions};
    }
    if (isString(parameterType)) {
        return {input: "text", ...combinedSuggestions};
    }

    // Check if type has call signatures (is callable/sub-flow)
    if (isSubFlow(parameterType)) {
        return {input: "sub-flow", ...combinedSuggestions};
    }

    // Handle array and tuple types
    if (isArrayType(checker, parameterType)) {
        const itemTypes = checker.getTypeArguments(
            parameterType as ts.TypeReference
        );

        const itemSchemas = itemTypes.flatMap(itemType => {
            const itemTypes = itemType.isUnion() ? itemType.types : [itemType];
            return itemTypes.map((itemType) =>
                getSchema(checker, node, itemType, functionDeclarations, functions, suggestions, undefined, visited, recursionCache)
            )
        })


        return {
            input: "list",
            items: itemSchemas,
            ...combinedSuggestions,
        };
    }

    // Handle complex object types with properties
    if ((parameterType.flags & ts.TypeFlags.Object) !== 0) {
        // Recursive data types (e.g. Order.deliveries[].order) are cut off via
        // the visited set — the checker caches type identities, so a cycle
        // revisits the same ts.Type object. The set only tracks the current
        // branch (backtracked below) so the same type may still be expanded on
        // sibling paths. The depth cap only applies to types that are part of a
        // reference cycle (checked last, it's the expensive test); purely nested
        // non-recursive objects are expanded to arbitrary depth.
        if (
            visited.has(parameterType) ||
            (visited.size >= MAX_SCHEMA_DEPTH &&
                isRecursiveType(parameterType, checker, recursionCache))
        ) {
            return {input: "data", ...combinedSuggestions};
        }
        visited.add(parameterType);

        const properties: Record<string, Schema | Schema[]> = {};
        const required: string[] = [];

        // Iterate through all properties of the object type
        for (const property of checker.getPropertiesOfType(parameterType)) {
            const declaration =
                property.valueDeclaration ?? property.declarations?.[0];

            if (!declaration) continue;

            const propertyType = checker.getTypeOfSymbolAtLocation(
                property,
                declaration
            );

            // Determine if the property is optional
            const isOptional =
                (property.flags & ts.SymbolFlags.Optional) !== 0 ||
                (propertyType.isUnion() &&
                    propertyType.types.some(
                        (t) => (t.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)) !== 0
                    ));

            // Filter out undefined and null types from union types
            const propertyTypes = propertyType.isUnion()
                ? propertyType.types.filter(
                    (t) => (t.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)) === 0
                )
                : [propertyType];

            // Recursively generate schemas for property types
            const propertySchemas = propertyTypes.map((type) =>
                getSchema(checker, node, type, functionDeclarations, functions, suggestions, undefined, visited, recursionCache)
            );

            properties[property.name] =
                propertySchemas.length === 1 ? propertySchemas[0] : propertySchemas;

            // Track required properties
            if (!isOptional) {
                required.push(property.name);
            }
        }

        visited.delete(parameterType);

        return {
            input: "data",
            properties,
            required,
            ...combinedSuggestions,
        };
    }

    // Fallback for unknown or generic types — still surface any collected
    // suggestions (e.g. references in scope) so the UI is never silently empty.
    return {
        input: "generic",
        ...combinedSuggestions,
    };
};

/**
 * Merges a function-declared parameter schema with the schema derived from the
 * concrete node value. The function schema is treated as the source of truth for
 * the structural shape (input kind, properties, items); the node schema only
 * contributes additional suggestions and, when the function schema is generic,
 * a fallback shape.
 *
 * Rules:
 * - If the function schema is generic, follow the node schema — but never as a
 *   select. A single literal value (e.g. "Test") narrowing a generic T must not
 *   collapse the input into a select with one option; it should remain free-form
 *   text/number/boolean matching the literal kind.
 * - Otherwise use the function schema's input kind and merge suggestions from both.
 *   Recurse into `properties` (for data) and `items` (for list) so nested generics
 *   inside concrete containers are handled the same way.
 *
 * Suggestions are concatenated and de-duplicated by structural equality.
 *
 * @param functionSchema - The schema derived from the declared function parameter type
 * @param nodeSchema - The schema derived from the node's concrete (narrowed) parameter type
 * @returns A single merged schema
 */
export const mergeSchemas = (
    functionSchema: Schema | undefined,
    nodeSchema: Schema,
    valueProvided: boolean = false,
): Schema => {
    if (!functionSchema) {
        return liftGenericIfValued(demoteSelect(nodeSchema), valueProvided);
    }

    if (functionSchema.input === "generic") {
        return liftGenericIfValued(demoteSelect(nodeSchema), valueProvided);
    }

    const suggestions = mergeSuggestions(
        functionSchema.suggestions,
        nodeSchema.suggestions,
    );

    if (functionSchema.input === "data") {
        const fProps = functionSchema.properties ?? {};
        const nProps =
            nodeSchema.input === "data" ? (nodeSchema.properties ?? {}) : {};
        const properties: Record<string, Schema | Schema[]> = {};
        const keys = new Set([...Object.keys(fProps), ...Object.keys(nProps)]);
        for (const key of keys) {
            const f = fProps[key];
            const n = nProps[key];
            properties[key] = mergeProperty(f, n);
        }
        return {
            ...functionSchema,
            properties,
            ...(suggestions ? {suggestions} : {}),
        };
    }

    if (functionSchema.input === "list") {
        const fItems = functionSchema.items ?? [];
        const nItems =
            nodeSchema.input === "list" ? (nodeSchema.items ?? []) : [];
        const items =
            fItems.length === nItems.length && fItems.length > 0
                ? fItems.map((f, i) => mergeSchemas(f, nItems[i]))
                : fItems;
        return {
            ...functionSchema,
            items,
            ...(suggestions ? {suggestions} : {}),
        };
    }

    return {
        ...functionSchema,
        ...(suggestions ? {suggestions} : {}),
    };
};

const mergeProperty = (
    f: Schema | Schema[] | undefined,
    n: Schema | Schema[] | undefined,
): Schema | Schema[] => {
    if (f && !Array.isArray(f) && n && !Array.isArray(n)) {
        return mergeSchemas(f, n);
    }
    return (f ?? n)!;
};

const mergeSuggestions = (
    a: Input["suggestions"],
    b: Input["suggestions"],
): Input["suggestions"] | undefined => {
    const all = [...(a ?? []), ...(b ?? [])];
    if (all.length === 0) return undefined;
    const seen = new Set<string>();
    const result: NonNullable<Input["suggestions"]> = [];
    for (const item of all) {
        const key = JSON.stringify(item);
        if (seen.has(key)) continue;
        seen.add(key);
        result.push(item);
    }
    return result;
};

// Generic means "we extracted nothing structural from either side". That is the
// right answer for an empty parameter slot, but if the user has provided a value
// then the merge already had the node-side schema to draw from — if both sides
// still came out generic (e.g. the value resolved to `any`/`unknown`), the most
// useful open shape is `data`. Primitive values never reach this branch: their
// node schema is text / number / boolean / select-then-demoted, so the merge
// produces a concrete kind before this lift runs.
const liftGenericIfValued = (schema: Schema, valueProvided: boolean): Schema => {
    if (!valueProvided || schema.input !== "generic") return schema;
    return {
        input: "data",
        properties: {},
        required: [],
        ...(schema.suggestions ? {suggestions: schema.suggestions} : {}),
    };
};

const demoteSelect = (schema: Schema): Schema => {
    if (schema.input !== "select") return schema;
    const suggestions = schema.suggestions ?? [];
    const literalKinds = new Set<string>();
    for (const s of suggestions) {
        const value = (s as LiteralValue).value;
        const kind = typeof value;
        if (kind === "string" || kind === "number" || kind === "boolean") {
            literalKinds.add(kind);
        }
    }
    const target: PrimitiveInput["input"] =
        literalKinds.size === 1
            ? (
                  {
                      string: "text",
                      number: "number",
                      boolean: "boolean",
                  } as const
              )[[...literalKinds][0] as "string" | "number" | "boolean"]
            : "text";
    return {
        input: target,
        ...(suggestions.length > 0 ? {suggestions} : {}),
    };
};

/**
 * Checks if a type is a boolean type (either boolean or boolean literal).
 *
 * This function checks for both the general boolean type and specific boolean
 * literal types (true, false).
 *
 * @param type - The type to check
 * @returns True if the type is a boolean or boolean literal, false otherwise
 */
function isBoolean(type: ts.Type): boolean {
    if (
        (type.flags & ts.TypeFlags.Boolean) !== 0 ||
        (type.flags & ts.TypeFlags.BooleanLiteral) !== 0
    ) {
        return true;
    }
    // A union whose only non-nullish members are boolean literals (e.g. `true | false`,
    // or `boolean | undefined` after TS expands boolean to its constituents) is still a boolean.
    if (type.isUnion()) {
        const nonNullish = type.types.filter(
            (t) => (t.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)) === 0
        );
        return (
            nonNullish.length > 0 &&
            nonNullish.every(
                (t) =>
                    (t.flags & ts.TypeFlags.Boolean) !== 0 ||
                    (t.flags & ts.TypeFlags.BooleanLiteral) !== 0
            )
        );
    }
    return false;
}

/**
 * Checks if a type is a number type (either number or number literal).
 *
 * This function checks for both the general number type and specific numeric
 * literal types (42, 3.14, etc.).
 *
 * @param type - The type to check
 * @returns True if the type is a number or number literal, false otherwise
 */
function isNumber(type: ts.Type): boolean {
    return (
        (type.flags & ts.TypeFlags.Number) !== 0 ||
        (type.flags & ts.TypeFlags.NumberLiteral) !== 0
    );
}

/**
 * Checks if a type is a string type (either string or string literal).
 *
 * This function checks for both the general string type and specific string
 * literal types ("hello", "world", etc.).
 *
 * @param type - The type to check
 * @returns True if the type is a string or string literal, false otherwise
 */
function isString(type: ts.Type): boolean {
    return (
        (type.flags & ts.TypeFlags.String) !== 0 ||
        (type.flags & ts.TypeFlags.StringLiteral) !== 0
    );
}

/**
 * Checks if a type is any primitive type (string, number, or boolean).
 *
 * @param type - The type to check
 * @returns True if the type is a string, number, or boolean, false otherwise
 */
function isPrimitive(type: ts.Type): boolean {
    return isString(type) || isNumber(type) || isBoolean(type);
}

/**
 * Checks if a type is a single string or number literal (e.g. "GET" or 42).
 * Boolean literals are excluded so that types like `true` continue to render as a boolean input.
 */
function isStringOrNumberLiteral(type: ts.Type): boolean {
    return (
        (type.flags & ts.TypeFlags.StringLiteral) !== 0 ||
        (type.flags & ts.TypeFlags.NumberLiteral) !== 0
    );
}

/**
 * Checks if a type is a union of primitive types only.
 *
 * This function is used to identify union types that can be represented as
 * a select input with predefined options (e.g., "a" | "b" | "c" or 1 | 2 | 3).
 *
 * @param type - The type to check
 * @returns True if the type is a union where all members are primitives, false otherwise
 */
function isPrimitiveLiteralUnion(type: ts.Type): boolean {
    if (!type.isUnion()) return false;
    const nonNullish = type.types.filter(
        (t) => (t.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)) === 0
    );
    return nonNullish.length > 0 && nonNullish.every(isPrimitive);
}

/**
 * Checks if a type is an array or tuple type.
 *
 * @param checker - TypeScript type checker for type analysis
 * @param type - The type to check
 * @returns True if the type is an array or tuple, false otherwise
 */
function isArrayType(checker: ts.TypeChecker, type: ts.Type): boolean {
    return checker.isArrayType(type) || checker.isTupleType(type);
}

/**
 * Checks if a type is a callable type (has call signatures).
 *
 * A type with call signatures can be invoked like a function. This is used
 * to identify sub-flow types that represent workflow steps.
 *
 * @param type - The type to check
 * @returns True if the type has call signatures, false otherwise
 */
export function isSubFlow(type: ts.Type): boolean {
    return type.getCallSignatures().length > 0;
}