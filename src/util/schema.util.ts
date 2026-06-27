import ts, {FunctionDeclaration} from "typescript";
import {getValues} from "./values.util";
import {getReferences} from "./references.util";
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
    suggestions: boolean = true
): Schema => {

    if ((parameterType.flags & ts.TypeFlags.TypeParameter) !== 0) {
        const decl = parameterType.symbol?.declarations?.[0]
        if (decl && ts.isTypeParameterDeclaration(decl) && decl.constraint) {
            // getTypeFromTypeNode statt getBaseConstraintOfType → aliasSymbol bleibt erhalten
            const constraintType = checker.getTypeFromTypeNode(decl.constraint)
            return getSchema(checker, node, constraintType, functionDeclarations, functions, suggestions)
        }
    }

    // Collect all available suggestions for this parameter
    const combinedSuggestions = suggestions ? {
        suggestions: [
            ...getValues(parameterType, checker),
            ...(node ? getReferences(
                checker,
                node,
                parameterType,
                checker.getSymbolsInScope(node, ts.SymbolFlags.Variable)
            ) : []),
            ...getNodes(
                checker,
                functionDeclarations,
                functions,
                parameterType
            ),
            ...getSubFlows(
                checker,
                functionDeclarations,
                functions,
                parameterType
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
            const baseSchema = getSchema(checker, node, nonNullish[0], functionDeclarations, functions, false)
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
                getSchema(checker, node, itemType, functionDeclarations, functions, suggestions)
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
                getSchema(checker, node, type, functionDeclarations, functions, suggestions)
            );

            properties[property.name] =
                propertySchemas.length === 1 ? propertySchemas[0] : propertySchemas;

            // Track required properties
            if (!isOptional) {
                required.push(property.name);
            }
        }

        return {
            input: "data",
            properties,
            required,
            ...combinedSuggestions,
        };
    }

    // Fallback for unknown or generic types
    return {
        input: "generic",
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