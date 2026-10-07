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
 * Maps a data type identifier to a dedicated input kind.
 *
 * These are semantic data types whose underlying (structural) type does not by
 * itself convey the custom input they need — e.g. DATE is a number underneath
 * but should render a date picker. The mapping is keyed on the identifier alone:
 * the resulting schema carries only the input kind (plus the usual type and
 * suggestions), nothing derived from the structure.
 *
 * Adding a new mapping is a one-line change here. The rest of the pipeline reads
 * from this registry: the declaration layer brands each identifier so its alias
 * name survives type resolution (see {@link getSharedTypeDeclarations}), the
 * schema layer surfaces the mapped input, and the value/inference layers treat
 * it as its underlying type.
 */
export const CUSTOM_INPUT_IDENTIFIERS = {
    DATE: "date",
    TYPE: "type",
} as const satisfies Record<string, string>;

/** A data type identifier that maps to a custom input. */
export type CustomInputIdentifier = keyof typeof CUSTOM_INPUT_IDENTIFIERS;

/** Returns true if the given identifier maps to a custom input. */
export const isCustomInputIdentifier = (
    identifier: string | null | undefined,
): identifier is CustomInputIdentifier =>
    identifier != null && identifier in CUSTOM_INPUT_IDENTIFIERS;

/** The set of input kinds produced by {@link CUSTOM_INPUT_IDENTIFIERS} (e.g. "date", "type"). */
const CUSTOM_INPUT_KINDS: ReadonlySet<string> = new Set(
    Object.values(CUSTOM_INPUT_IDENTIFIERS),
);

/**
 * Returns true if the given input kind is one produced by a custom-input data
 * type (e.g. "date", "type"). Used by {@link mergeSchemas} to let a supplied
 * value narrow the rendered `type` of such an input while the input kind itself
 * is kept.
 *
 * Note this covers the registry-driven kinds only, so it is not the test for
 * "is this input dedicated rather than structural" — COLOR is detected by shape
 * (see isColorType) and never appears here. Code that must not expand a
 * dedicated input back into the shape it was built from checks for the
 * structural kinds it does expand ("data", "generic") instead.
 */
export const isCustomInputKind = (
    input: string | undefined,
): boolean => input != null && CUSTOM_INPUT_KINDS.has(input);

/**
 * Base interface for all input types.
 * Provides common properties for suggestions and input metadata.
 */
export interface Input {
    /** The type of input (string representation) */
    input?: string;
    /**
     * The underlying TypeScript type rendered as a string
     * (e.g. "NUMBER", "LIST<TEXT>", "string | undefined"), as produced by the
     * type checker for the type this schema node was generated from.
     */
    type?: string;
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
 * Represents a date input type.
 * Emitted for the DATE data type so the UI can render a dedicated date picker
 * instead of the plain number input its underlying type would otherwise produce.
 */
export interface DateInput extends Input {
    input?: "date";
}

/**
 * Represents a color input type.
 * Emitted for the COLOR data type so the UI can render a dedicated color picker
 * instead of expanding the `{ hue, saturation, lightness, alpha? }` object its
 * underlying type would otherwise produce. Like {@link DateInput}, it carries no
 * additional properties.
 */
export interface ColorInput extends Input {
    input?: "color";
}

/**
 * Represents a file input type.
 * Emitted for the FILE data type so the UI can render a dedicated file picker
 * instead of expanding the `{ contentType, valueType, value }` object its
 * underlying type would otherwise produce.
 */
export interface FileInput extends Input {
    input?: "file";
    /**
     * The MIME type the file is constrained to, derived from the FILE data
     * type's `contentType` generic (e.g. `FILE<"image/png">` → "image/png").
     * Falls back to the wildcard "*\/*" when the FILE is unconstrained
     * (`contentType` is a plain string) or the constraint is not a valid MIME
     * type. Always present.
     */
    mimetype?: string;
}

/**
 * Represents a list of file inputs.
 * Emitted for any array/list of the FILE data type (e.g. `LIST<FILE>`,
 * `FILE[]`) so the UI can render a dedicated multi-file picker instead of the
 * generic list input its underlying type would otherwise produce. Shares the
 * {@link FileInput} `mimetype` property.
 */
export interface ListFileInput extends Input {
    input?: "list-file";
    /** See {@link FileInput.mimetype}. */
    mimetype?: string;
}

/**
 * Represents a list of select inputs.
 * Emitted for any array/list whose element is a select type (a primitive
 * literal union or a single string/number literal — e.g. `LIST<HTTP_METHOD>`,
 * `('GET' | 'POST')[]`) so the UI can render a dedicated multi-select instead
 * of the generic list input its underlying type would otherwise produce.
 */
export interface ListSelectInput extends Omit<ListInput, 'input'> {
    input?: "list-select";
}

/**
 * Represents a list of boolean inputs.
 * Emitted for any array/list of plain booleans (e.g. `LIST<BOOLEAN>`,
 * `boolean[]`) so the UI can render a dedicated multi-boolean input instead of
 * the generic list of individual boolean inputs its underlying type would
 * otherwise produce. Carries the per-item schemas in `items`, like a generic
 * {@link ListInput}.
 */
export interface ListBooleanInput extends Omit<ListInput, 'input'> {
    input?: "list-boolean";
}

/**
 * Represents a list of number inputs.
 * Emitted for any array/list of plain numbers (e.g. `LIST<NUMBER>`, `number[]`)
 * so the UI can render a dedicated multi-number input instead of the generic
 * list of individual number inputs its underlying type would otherwise produce.
 * Carries the per-item schemas in `items`, like a generic {@link ListInput}.
 */
export interface ListNumberInput extends Omit<ListInput, 'input'> {
    input?: "list-number";
}

/**
 * Represents a list of text inputs.
 * Emitted for any array/list of plain strings (e.g. `LIST<TEXT>`, `string[]`)
 * so the UI can render a dedicated multi-text input instead of the generic list
 * of individual text inputs its underlying type would otherwise produce. Carries
 * the per-item schemas in `items`, like a generic {@link ListInput}.
 */
export interface ListTextInput extends Omit<ListInput, 'input'> {
    input?: "list-text";
}

/**
 * Represents a list of sub-flow inputs.
 * Emitted for any array/list whose element is a callable/sub-flow type (e.g.
 * `LIST<FLOW>`, `(() => void)[]`) so the UI can render a dedicated multi-sub-flow
 * input instead of the generic list of individual sub-flow inputs its underlying
 * type would otherwise produce. Carries the per-item schemas in `items`, like a
 * generic {@link ListInput}.
 */
export interface ListSubFlowInput extends Omit<ListInput, 'input'> {
    input?: "list-sub-flow";
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
    /**
     * Schema or array of schemas for list items.
     *
     * In a parameter schema this is *value-driven*: once an array value is
     * entered it holds exactly one entry per entered element, so it says what the
     * list currently contains — not what an element may be. Use
     * {@link ListInput.declaredItems} for the latter.
     *
     * An entered entry only ever *refines* one of the `declaredItems`: it is that
     * option's input kind, properties and suggestions, with the concrete value's
     * `type` and per-element cardinality filled in. A union element type is
     * resolved to the member the entered element picked, so the COLOR entries of a
     * `LIST<COLOR | OBJECT<…>>` stay color inputs and its object entries keep the
     * declared object's property schemas.
     */
    items?: Schema[];
    /**
     * The item schemas the *declared* element type produces — what `items` holds
     * while no value is entered, and therefore the answer to "what may an element
     * of this list be": its input kind, and the suggestions an element slot offers.
     * A union element contributes one entry per member (e.g. all six methods of a
     * `LIST<HTTP_METHOD>`), so the entries enumerate the element's options rather
     * than the list's contents.
     *
     * Always present alongside `items` on an input slot's schema — an entered
     * value can empty `items` (`[]`) or reduce it to the elements that happen to be
     * there, and neither tells the UI what to render for a new element or which
     * candidates the element slot accepts. An unconstrained element slot (a generic
     * `LIST<T>`, or a list in a slot the declared type does not describe) yields a
     * single generic entry carrying the "accepts anything" suggestion set.
     *
     * Omitted on schemas that describe a *produced* value rather than an input slot
     * (a signature's return type, {@link getTypeSchema}); there `items` is already
     * the declared expansion.
     */
    declaredItems?: Schema[];
}

/**
 * Represents a type input.
 * Emitted for the TYPE data type so the UI can render a dedicated type picker
 * instead of the plain input its underlying type (`any`) would otherwise
 * produce. Like {@link DateInput}, it carries no additional properties.
 */
export interface TypeInput extends Input {
    input?: "type";
}

/**
 * Union type representing all possible schema input types.
 * Discriminated union based on the 'input' field.
 */
export type Schema =
    | PrimitiveInput
    | DateInput
    | ColorInput
    | FileInput
    | ListFileInput
    | ListSelectInput
    | ListBooleanInput
    | ListNumberInput
    | ListTextInput
    | ListSubFlowInput
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
    // The type this schema node is declared as, tracked alongside the concrete
    // `parameterType` when they differ because of generic instantiation. Only the
    // declared type still carries a type parameter's constraint (e.g. a REST
    // trigger's `<T extends TYPE>` payload), which the instantiated type has lost.
    declaredType?: ts.Type,
): Schema => {

    if ((parameterType.flags & ts.TypeFlags.TypeParameter) !== 0) {
        const decl = parameterType.symbol?.declarations?.[0]
        if (decl && ts.isTypeParameterDeclaration(decl) && decl.constraint) {
            // getTypeFromTypeNode statt getBaseConstraintOfType → aliasSymbol bleibt erhalten
            const constraintType = checker.getTypeFromTypeNode(decl.constraint)
            return getSchema(checker, node, constraintType, functionDeclarations, functions, suggestions, suggestionType, visited, recursionCache)
        }
    }

    // The raw TypeScript type as a string, carried on every schema node so the
    // consumer knows the concrete type each input was derived from. Custom-input
    // data types are branded so their alias survives detection (see
    // getSharedTypeDeclarations): primitive-based ones (e.g. DATE) as
    // `<primitive> & {}`, from which we stringify the unbranded base member so the
    // rendered type stays clean ("number", not "number & {}"); the `any`-based TYPE
    // as the empty object `{}`, rendered as the neutral "object". Every other type
    // drops its top-level alias so the concrete structure is rendered rather than
    // the wrapping alias name.
    const isCustom = isCustomInputIdentifier(parameterType.aliasSymbol?.getName());
    const type = isCustom && parameterType.isIntersection()
        ? checker.typeToString(
              parameterType.types.find(
                  (t) => (t.flags & ts.TypeFlags.Object) === 0
              ) ?? parameterType
          )
        : isCustom
            ? "object"
            : checker.typeToString({...parameterType, aliasSymbol: undefined});

    // Suggestions are filtered by what the surrounding function accepts, not by
    // the narrower type a current value happens to narrow the node-side to.
    // Example: `<T>(value: T)` with a current boolean literal must still surface
    // every reference in scope, because the function takes anything.
    const typeForSuggestions = suggestionType ?? parameterType;

    // Sub-flow bindings are the one exception to that scope: they are matched
    // against the slot's *callable* type, and a wider scope is not necessarily
    // callable where this position is. A union element scopes every one of its
    // options to the whole union (see the item expansion below), and a union
    // loses its call signatures as soon as one member is not callable — matching
    // the bindings against it would drop every one of them from an option that
    // is itself a sub-flow. They are therefore scoped to this schema node's own
    // (member) type whenever the wider scope has no call signatures to match.
    // The other three sources filter by assignability, where the wider scope is
    // a superset and needs no such fallback.
    const typeForSubFlows = isSubFlow(typeForSuggestions) ? typeForSuggestions : parameterType;

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
                typeForSubFlows
            ),
        ],
    } : {};

    // A slot whose *declared* type is a type parameter constrained by a
    // custom-input data type (e.g. a REST trigger's `<T extends TYPE>` payload,
    // instantiated to a concrete argument) surfaces that custom input. The
    // instantiated `type` string is kept so the concrete shape the value bound to
    // stays visible (e.g. `{input: "type", type: "number"}`).
    if (declaredType) {
        const constraintInput = getCustomInputFromConstraint(checker, declaredType);
        if (constraintInput) {
            return {input: constraintInput, type, ...combinedSuggestions};
        }
    }

    // Strip undefined and null from unions (e.g. string | undefined | null → string).
    // Suggestions are collected above from the original type (preserving aliasSymbol literals),
    // the base schema is determined from the stripped type, then both are merged.
    // The recursion keeps the caller's `suggestions` flag so nested members of the
    // stripped type still get their own suggestions (e.g. an optional object
    // `OBJ | undefined` must expose the same per-property suggestions as a required
    // `OBJ`). Only this union node's own top-level suggestions are replaced by
    // `combinedSuggestions`, which was scoped by the original (nullable) type.
    if (parameterType.isUnion()) {
        const nonNullish = parameterType.types.filter(
            (t) => (t.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)) === 0
        )
        if (nonNullish.length === 1) {
            const baseSchema = getSchema(checker, node, nonNullish[0], functionDeclarations, functions, suggestions, undefined, visited, recursionCache)
            return {...baseSchema, type, ...combinedSuggestions}
        }
    }

    // Custom-input data types (e.g. DATE) would otherwise resolve to the input
    // of their underlying type (a number, for DATE). They are branded (see
    // getSharedTypeDeclarations) so their alias name survives; detect it here and
    // surface the mapped input instead. Checked before the primitive checks since
    // the underlying type is often a primitive.
    const customInput = getCustomInput(parameterType);
    if (customInput) {
        return {input: customInput, type, ...combinedSuggestions};
    }

    // The FILE data type is structurally an object ({ contentType, valueType,
    // value }), but the UI should render a dedicated file picker rather than
    // expanding those internals. Detected here so it short-circuits the object
    // handling below. The mimetype is carried through from FILE's contentType
    // generic (e.g. FILE<"image/png">).
    if (isFileType(checker, parameterType)) {
        const mimetype = getFileMimetype(checker, parameterType);
        return {input: "file", type, mimetype, ...combinedSuggestions};
    }

    // The COLOR data type is structurally an object ({ hue, saturation,
    // lightness, alpha? }), but the UI should render a dedicated color picker
    // rather than expanding those internals. Detected here so it short-circuits
    // the object handling below. Like DATE, it carries no additional properties.
    if (isColorType(checker, parameterType)) {
        return {input: "color", type, ...combinedSuggestions};
    }

    // Boolean is internally represented by TypeScript as the union `true | false`,
    // so it must be detected before the primitive-literal-union check below; otherwise
    // `boolean` (and `true | false`) would incorrectly surface as a select.
    if (isBoolean(parameterType)) {
        return {input: "boolean", type, ...combinedSuggestions};
    }

    // Check primitive literal union first (e.g., "a" | "b" | "c") or a single
    // string/number literal (e.g., "GET"). A bare literal has only one allowed
    // value, so it should still surface as a select rather than a free-form text/number input.
    // (Boolean has already been handled above; see isSelectType.)
    if (isSelectType(parameterType)) {
        return {input: "select", type, ...combinedSuggestions};
    }
    if (isNumber(parameterType)) {
        return {input: "number", type, ...combinedSuggestions};
    }
    if (isString(parameterType)) {
        return {input: "text", type, ...combinedSuggestions};
    }

    // Check if type has call signatures (is callable/sub-flow)
    if (isSubFlow(parameterType)) {
        return {input: "sub-flow", type, ...combinedSuggestions};
    }

    // Handle array and tuple types
    if (isArrayType(checker, parameterType)) {
        const itemTypes = checker.getTypeArguments(
            parameterType as ts.TypeReference
        );

        // A list of FILEs (LIST<FILE>, FILE[], ...) surfaces a dedicated
        // multi-file input instead of a generic list of file objects, carrying
        // the same mimetype as its element FILE would. It carries no `items`, and
        // hence no `declaredItems` either.
        if (itemTypes.length === 1 && isFileType(checker, itemTypes[0])) {
            const mimetype = getFileMimetype(checker, itemTypes[0]);
            return {input: "list-file", type, mimetype, ...combinedSuggestions};
        }

        // Per-item schemas, computed the same way for a generic list and a
        // list-select (whose `items` mirror a normal list's). A union element is
        // split into one schema per member; a single element yields one schema.
        //
        // A split member describes one *option* of the element slot, not a slot of
        // its own, so its suggestions stay scoped to the whole element type: every
        // item of a LIST<HTTP_METHOD> offers all six methods, not just the one its
        // `type` names. That is also what the value-driven path produces once
        // elements are entered (see buildValueDrivenItem), so an item's suggestions
        // no longer depend on whether the list carries a value.
        const itemSchemas = itemTypes.flatMap(itemType => {
            const memberTypes = itemType.isUnion() ? itemType.types : [itemType];
            const elementSuggestionType = memberTypes.length > 1 ? itemType : undefined;
            return memberTypes.map((memberType) =>
                getSchema(checker, node, memberType, functionDeclarations, functions, suggestions, elementSuggestionType, visited, recursionCache)
            )
        })

        // The declared element expansion, kept next to `items` so it survives a
        // value overwriting them (see ListInput.declaredItems). Only an input slot
        // carries it: a suggestion-less schema describes a produced value, where
        // `items` is the declared expansion already.
        const declaredItems = suggestions ? {declaredItems: itemSchemas} : {};

        // A list of a select type (LIST<HTTP_METHOD>, ('GET' | 'POST')[], ...)
        // surfaces a dedicated multi-select. Its `items` are the element schemas,
        // exactly like a generic list — only the input kind differs so the UI can
        // render a combined multi-select. Checked before the plain-primitive
        // cases below because a single literal (e.g. LIST<1>) is a select, not a
        // plain number.
        if (itemTypes.length === 1 && isSelectType(itemTypes[0])) {
            return {input: "list-select", type, items: itemSchemas, ...declaredItems, ...combinedSuggestions};
        }

        // A homogeneous list of a plain primitive surfaces a dedicated
        // multi-<primitive> input. Its `items` are the element schemas, exactly
        // like a generic list — only the input kind differs so the UI can render
        // a combined multi-<primitive> input. Ordering mirrors the top-level
        // primitive checks: boolean first, then number, then string — select
        // literals have already been handled above. Custom-input elements
        // (DATE → date, COLOR → color, FILE → file) are structurally
        // intersection/object types that fail these checks, so they keep the
        // per-item schema of the generic list below.
        if (itemTypes.length === 1) {
            const element = itemTypes[0];
            if (isBoolean(element)) return {input: "list-boolean", type, items: itemSchemas, ...declaredItems, ...combinedSuggestions};
            if (isNumber(element)) return {input: "list-number", type, items: itemSchemas, ...declaredItems, ...combinedSuggestions};
            if (isString(element)) return {input: "list-text", type, items: itemSchemas, ...declaredItems, ...combinedSuggestions};
            // A homogeneous list of a callable/sub-flow element surfaces a
            // dedicated multi-sub-flow input. Checked after the primitives (none
            // of which are callable) and before the generic list fallback.
            if (isSubFlow(element)) return {input: "list-sub-flow", type, items: itemSchemas, ...declaredItems, ...combinedSuggestions};
        }

        return {
            input: "list",
            type,
            items: itemSchemas,
            ...declaredItems,
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
            return {input: "data", type, ...combinedSuggestions};
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

            // A nullish member never describes an input of its own, so it is stripped
            // first. What remains may still be a union: a heterogeneous one (e.g.
            // `TEXT | OBJECT<…>`) yields one schema per member, while a union that
            // renders as a *single* input — a literal-union select, or boolean's
            // `true | false` — is kept whole. Splitting those would turn one select
            // into one input per option, each carrying only its own literal as a
            // suggestion, and the property would stop matching both the single input
            // the same type produces as a parameter and the one the value-driven path
            // builds once a value is entered.
            const nonNullishPropertyType = checker.getNonNullableType(propertyType);
            const propertyTypes =
                nonNullishPropertyType.isUnion() &&
                !isSelectType(nonNullishPropertyType) &&
                !isBoolean(nonNullishPropertyType)
                    ? nonNullishPropertyType.types
                    : [nonNullishPropertyType];

            // The matching property on the declared type (when tracked), so a
            // property whose declared type is a custom-input-constrained type
            // parameter is recognised even after generic instantiation erased the
            // constraint from the concrete `propertyType` (see getSchema's
            // `declaredType` handling).
            const declaredPropertyType = declaredType
                ? getDeclaredPropertyType(checker, declaredType, property.name)
                : undefined;

            // Recursively generate schemas for property types
            const propertySchemas = propertyTypes.map((type) =>
                getSchema(checker, node, type, functionDeclarations, functions, suggestions, undefined, visited, recursionCache, declaredPropertyType)
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
            type,
            properties,
            required,
            ...combinedSuggestions,
        };
    }

    // Fallback for unknown or generic types — still surface any collected
    // suggestions (e.g. references in scope) so the UI is never silently empty.
    return {
        input: "generic",
        type,
        ...combinedSuggestions,
    };
};

/**
 * Merges a function-declared parameter schema with the schema derived from the
 * concrete node value. The function schema is treated as the source of truth for
 * the structural shape (input kind, properties, items) *and* for the suggestions
 * of every nested position; the node schema contributes the parameter root's
 * suggestion scope, the value-driven shape of positions the declared type leaves
 * open, and — when the function schema is generic — a fallback shape.
 *
 * Rules:
 * - If the function schema is generic, follow the node schema — but never as a
 *   select. A single literal value (e.g. "Test") narrowing a generic T must not
 *   collapse the input into a select with one option; it should remain free-form
 *   text/number/boolean matching the literal kind.
 * - Otherwise use the function schema's input kind. Recurse into `properties` (for
 *   data) and `items` (for list) so nested generics inside concrete containers are
 *   handled the same way.
 * - Suggestions come from the declared side at every nested position (see the
 *   comment on `suggestions` below) and are de-duplicated by structural equality.
 *
 * Both schemas are expected to carry suggestions (built with the flag enabled);
 * the node side is additionally passed through {@link normalizeNodeSchema} first.
 *
 * @param functionSchema - The schema derived from the declared function parameter type
 * @param nodeSchema - The schema derived from the node's concrete (narrowed) parameter type
 * @returns A single merged schema
 */
// Every list input kind whose schema carries per-element `items` — the generic
// list and all specialized list-* variants that mirror it. mergeSchemas recurses
// into these so element-level suggestions are preserved. list-file is excluded:
// it carries a `mimetype`, not `items`.
const LIST_INPUTS = new Set<string>([
    "list",
    "list-select",
    "list-boolean",
    "list-number",
    "list-text",
    "list-sub-flow",
]);

// The specialized list-* input kinds. These express a UI intention (render a
// dedicated multi-<primitive>/multi-select/… control) that is only meaningful
// when the *declared* function parameter type asks for it. A concrete node value
// must never surface one of these — it should only contribute the concrete
// element types. list-file is included even though it carries no `items`.
const SPECIALIZED_LIST_INPUTS = new Set<string>([
    "list-select",
    "list-boolean",
    "list-number",
    "list-text",
    "list-sub-flow",
    "list-file",
]);

/**
 * Normalizes a node-side schema so it only contributes concrete resolved types
 * to {@link mergeSchemas}, recursing through `items` and `properties`. It:
 *
 * - Rewrites every specialized list-* input back to the plain `list` kind. The
 *   specialized variants are a declared-type (function-side) concern, so a
 *   concrete value must never surface one; the resolved element types (via
 *   `items`) are kept, and the `list-file` `mimetype` is dropped because a plain
 *   list has no such field.
 * - Drops an empty `suggestions` array. Node schemas are built with suggestions
 *   enabled and therefore always carry the key — even when empty — whereas the
 *   rest of the pipeline omits it entirely when there are none.
 *
 * The function-side schema still drives the final input kind in
 * {@link mergeSchemas}.
 */
export const normalizeNodeSchema = (schema: Schema): Schema => {
    let result: Schema = schema;

    const items = (schema as ListInput).items;
    if (items) {
        result = {...result, items: items.map(normalizeNodeSchema)} as Schema;
    }

    const declared = (schema as ListInput).declaredItems;
    if (declared) {
        result = {...result, declaredItems: declared.map(normalizeNodeSchema)} as Schema;
    }

    const properties = (schema as DataInput).properties;
    if (properties) {
        const mapped: Record<string, Schema | Schema[]> = {};
        for (const [key, value] of Object.entries(properties)) {
            mapped[key] = Array.isArray(value)
                ? value.map(normalizeNodeSchema)
                : normalizeNodeSchema(value);
        }
        result = {...result, properties: mapped} as Schema;
    }

    if (SPECIALIZED_LIST_INPUTS.has(result.input as string)) {
        const {mimetype, ...rest} = result as ListInput & {mimetype?: string};
        result = {...rest, input: "list"};
    }

    if (result.suggestions && result.suggestions.length === 0) {
        const {suggestions, ...rest} = result;
        result = rest;
    }

    return result;
};

/**
 * Strips `undefined` and `null` from a union type so the *declared* shape can be
 * inspected. An optional parameter (or property) resolves to
 * `<declared> | undefined`, and a union carries none of its members' type flags —
 * so a test like "is this an object" or `checker.isArrayType` answers `false` for
 * every optional slot unless the nullish part is removed first. A union that has
 * more than one real member left is returned unchanged: there is no single
 * declared shape to speak of then.
 */
export const nonNullishType = (type: ts.Type): ts.Type => {
    if (!type.isUnion()) return type;
    const nonNullish = type.types.filter(
        (t) => (t.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)) === 0,
    );
    return nonNullish.length === 1 ? nonNullish[0] : type;
};

/**
 * Sets a schema's `suggestions` to the given set, dropping the key entirely when
 * the set is empty or missing. Suggestion-carrying schemas are built with the
 * key always present (an empty array when nothing matched), whereas the rest of
 * the pipeline omits it — so every schema that is spread into a result passes
 * through here instead of relying on the spread.
 */
export const withSuggestions = <T extends Schema>(
    schema: T,
    suggestions: Input["suggestions"] | undefined,
): T => {
    if (suggestions && suggestions.length > 0) return {...schema, suggestions};
    if (schema.suggestions === undefined) return schema;
    const {suggestions: _dropped, ...rest} = schema;
    return rest as T;
};

/**
 * A declared (function-side) schema kept as the answer for its position, because
 * the node side has no counterpart to merge into it — e.g. a property the entered
 * value does not carry, or a union-typed position whose members no longer line up.
 *
 * The declared schema already carries the suggestions of every level it
 * describes; only a fully generic slot inside it is rewritten to the constant
 * `any` set, which is what the merge itself would have produced for such a slot
 * (see {@link genericNodeSchema}). Empty suggestion arrays are dropped so the
 * result follows the same convention as every other schema.
 */
export const declaredSchema = (
    schema: Schema,
    anySuggestions: Input["suggestions"] = undefined,
): Schema => {
    let result: Schema = schema;

    const items = (result as ListInput).items;
    if (items) {
        result = {
            ...result,
            items: items.map((s) => declaredSchema(s, anySuggestions)),
        } as Schema;
    }

    const declared = (result as ListInput).declaredItems;
    if (declared) {
        result = {
            ...result,
            declaredItems: declared.map((s) => declaredSchema(s, anySuggestions)),
        } as Schema;
    }

    const properties = (result as DataInput).properties;
    if (properties) {
        const mapped: Record<string, Schema | Schema[]> = {};
        for (const [key, value] of Object.entries(properties)) {
            mapped[key] = Array.isArray(value)
                ? value.map((s) => declaredSchema(s, anySuggestions))
                : declaredSchema(value, anySuggestions);
        }
        result = {...result, properties: mapped} as Schema;
    }

    return result.input === "generic"
        ? withSuggestions(result, anySuggestions)
        : withSuggestions(result, result.suggestions);
};

/**
 * Treats a node-side schema as sitting in a fully generic ("accepts anything")
 * slot: the declared type constrains nothing here, so the value keeps its shape
 * while a select narrowed from a single literal is demoted to its free-form
 * primitive. Recurses through `items` and `properties` so the whole subtree is
 * treated uniformly.
 *
 * Suggestions: nested positions were built value-scoped (the recursion inside
 * {@link getSchema} drops the suggestion scope), so they are replaced with the
 * constant `any` set. The `overrideRoot` flag controls this for the top node
 * only: at a nested position it is `true` (the node's own suggestions are the
 * value-narrowed subset and must be replaced); at a parameter root it is `false`
 * (the node's suggestions were already scoped by `suggestionType`/the
 * type-parameter constraint — e.g. `keyof T` — so they are kept). Descendants are
 * always overridden regardless.
 */
/**
 * The declared element expansion of a list slot: the function-side `items`, each
 * kept as the declared answer for its position (see {@link declaredSchema}). An
 * element the declared type leaves unconstrained — a generic `LIST<T>`, or a list
 * in a slot with no declared type at all — yields a single generic entry carrying
 * the "accepts anything" set, which is what such an element slot accepts.
 *
 * This is what {@link ListInput.declaredItems} carries, and it never depends on the
 * entered value.
 */
export const declaredItemsOf = (
    functionItems: Schema[] | undefined,
    anySuggestions: Input["suggestions"] = undefined,
): Schema[] =>
    functionItems && functionItems.length > 0
        ? functionItems.map((item) => declaredSchema(item, anySuggestions))
        : [withSuggestions({input: "generic"} as Schema, anySuggestions)];

export const genericNodeSchema = (
    schema: Schema,
    anySuggestions: Input["suggestions"] = undefined,
    overrideRoot: boolean = true,
): Schema => {
    let result = demoteSelect(schema);

    const items = (result as ListInput).items;
    if (items) {
        result = {
            ...result,
            items: items.map((s) => genericNodeSchema(s, anySuggestions)),
        } as Schema;
    }

    const declared = (result as ListInput).declaredItems;
    if (declared) {
        result = {
            ...result,
            declaredItems: declared.map((s) => genericNodeSchema(s, anySuggestions)),
        } as Schema;
    }

    const properties = (result as DataInput).properties;
    if (properties) {
        const mapped: Record<string, Schema | Schema[]> = {};
        for (const [key, value] of Object.entries(properties)) {
            mapped[key] = Array.isArray(value)
                ? value.map((s) => genericNodeSchema(s, anySuggestions))
                : genericNodeSchema(value, anySuggestions);
        }
        result = {...result, properties: mapped} as Schema;
    }

    if (overrideRoot) {
        if (anySuggestions && anySuggestions.length > 0) {
            result = {...result, suggestions: anySuggestions};
        } else if (result.suggestions) {
            const {suggestions, ...rest} = result;
            result = rest;
        }
    }

    return result;
};

export const mergeSchemas = (
    functionSchema: Schema | undefined,
    nodeSchema: Schema,
    valueProvided: boolean = false,
    anySuggestions: Input["suggestions"] = undefined,
    topLevel: boolean = true,
): Schema => {
    // A function-less or fully generic slot constrains nothing here: the value
    // drives the shape, and nested levels take the constant `any` set (see
    // genericNodeSchema), never the value-narrowed subset. The root's own
    // suggestions are kept only at the parameter top level, where they were
    // already scoped by the type-parameter constraint (e.g. `keyof T` for a
    // `key: K` slot); a nested generic hit is value-scoped and gets overridden.
    if (!functionSchema || functionSchema.input === "generic") {
        return liftGenericIfValued(
            genericNodeSchema(nodeSchema, anySuggestions, !topLevel),
            valueProvided,
        );
    }

    // Suggestions answer "what may be put into this slot", and only the *declared*
    // type decides that — never the value that happens to sit there.
    //
    // At the parameter root the node side is the authority: its suggestions were
    // collected against the widened function parameter type (see
    // `widenForSuggestions`), so a `T` slot still offers everything in scope after
    // the current value narrowed `T` to, say, a boolean.
    //
    // At every nested position — a property of a `data`, an element of a `list` —
    // the node side was collected against the concrete, value-narrowed type
    // instead: a `TEXT` property holding "GET" would offer only the literal "GET"
    // rather than everything that can produce a text. The function side carries the
    // declared property/element type's own scope there, so it is the authority and
    // the node side only fills in for positions the declared type does not
    // describe. That keeps a nested slot's suggestions identical whether or not a
    // value has been entered.
    const suggestions = dedupeSuggestions(
        topLevel
            ? nodeSchema.suggestions
            : (functionSchema.suggestions ?? nodeSchema.suggestions),
    );

    if (functionSchema.input === "data") {
        const fProps = functionSchema.properties ?? {};
        const nProps =
            nodeSchema.input === "data" ? (nodeSchema.properties ?? {}) : {};
        const properties: Record<string, Schema | Schema[]> = {};
        const keys = new Set([...Object.keys(fProps), ...Object.keys(nProps)]);
        for (const key of keys) {
            properties[key] = mergeProperty(fProps[key], nProps[key], anySuggestions);
        }
        return withSuggestions({...functionSchema, properties}, suggestions);
    }

    // The generic list and every specialized list-* variant (list-select,
    // list-boolean/number/text, list-sub-flow) carry their element schemas in
    // `items`. Merge those pairwise so element-level suggestions — e.g. the
    // per-literal values on a list-select or the sub-flow function suggestions on
    // a LIST<CONSUMER<T>> element — survive the merge. Suggestions must never be
    // lost, whatever the list kind. The node-side schema is always the plain
    // `list` kind (specialized variants are stripped via normalizeNodeSchema
    // before merging), so it is matched by kind family — any list input
    // contributes its items — rather than requiring an exact kind match with the
    // function schema.
    if (LIST_INPUTS.has(functionSchema.input as string)) {
        const fItems = (functionSchema as ListInput).items ?? [];
        const nItems =
            LIST_INPUTS.has(nodeSchema.input as string)
                ? ((nodeSchema as ListInput).items ?? [])
                : [];
        // A generic function element (LIST<T> → a single `{input: "generic"}`
        // item) carries no structure, so the node's concrete element schemas win
        // outright. Their cardinality may differ from the function's single
        // placeholder — e.g. LIST<boolean> expands its element to `true | false`,
        // yielding two item schemas — which is why a strict pairwise merge cannot
        // be used here. When the function element is itself concrete (e.g.
        // LIST<HTTP_METHOD> → one select per literal), the counts line up and the
        // items are merged pairwise so element-level suggestions survive.
        const fAllGeneric =
            fItems.length > 0 && fItems.every((it) => it.input === "generic");
        // A generic function element leaves each item unconstrained, so the
        // node's concrete items keep their shape but take the `any` suggestion
        // set. A concrete function element merges pairwise so its own scope wins.
        const items =
            fAllGeneric && nItems.length > 0
                ? nItems.map((n) => genericNodeSchema(n, anySuggestions))
                : fItems.length === nItems.length && fItems.length > 0
                    ? fItems.map((f, i) => mergeSchemas(f, nItems[i], false, anySuggestions, false))
                    // No node-side items to pair with (the value narrowed the list
                    // to something else, or expanded a union element to a different
                    // cardinality): the declared items stand on their own, carrying
                    // the suggestions of the element type they describe.
                    : declaredItemsOf(fItems, anySuggestions);
        return withSuggestions(
            {
                ...functionSchema,
                items,
                declaredItems: declaredItemsOf(fItems, anySuggestions),
            },
            suggestions,
        );
    }

    // A custom-input data type (e.g. TYPE) keeps its dedicated input, but a
    // supplied primitive value narrows the rendered `type` from the declared
    // bound (TYPE's wide "object") to the value's concrete base type — so `42`
    // against a `<T extends TYPE>` (or plain `TYPE`) slot renders
    // {input:"type", type:"number"}, mirroring the instantiated return payload.
    // Without a value the node side falls back to the function type, so the bound
    // is preserved. Concrete-bound custom inputs (DATE = number) are unaffected:
    // their node-side type already equals the bound.
    if (isCustomInputKind(functionSchema.input as string | undefined)) {
        return withSuggestions(
            {
                ...functionSchema,
                ...(nodeSchema.type !== undefined ? {type: nodeSchema.type} : {}),
            },
            suggestions,
        );
    }

    return withSuggestions({...functionSchema}, suggestions);
};

const mergeProperty = (
    f: Schema | Schema[] | undefined,
    n: Schema | Schema[] | undefined,
    anySuggestions: Input["suggestions"] = undefined,
): Schema | Schema[] => {
    // Present only on the node side → the declared type does not constrain this
    // property, so it lives in a generic slot: keep the shape, use `any`
    // suggestions.
    if (f === undefined && n !== undefined) {
        return Array.isArray(n)
            ? n.map((s) => genericNodeSchema(s, anySuggestions))
            : genericNodeSchema(n, anySuggestions);
    }
    if (f && !Array.isArray(f) && n && !Array.isArray(n)) {
        return mergeSchemas(f, n, false, anySuggestions, false);
    }
    // A union-typed property carries one schema per member on both sides; merge
    // them pairwise while the members still line up.
    if (Array.isArray(f) && Array.isArray(n) && f.length === n.length) {
        return f.map((member, index) =>
            mergeSchemas(member, n[index], false, anySuggestions, false),
        );
    }
    // Nothing on the node side to merge with, or the members no longer line up
    // (e.g. the value narrowed a union property to one of its members): the
    // declared schema stands on its own.
    return Array.isArray(f)
        ? f.map((member) => declaredSchema(member, anySuggestions))
        : declaredSchema(f!, anySuggestions);
};

/**
 * The suggestion set of a merged position: de-duplicated by structural equality,
 * and `undefined` when nothing is left so the key is omitted rather than emitted
 * empty.
 */
const dedupeSuggestions = (
    suggestions: Input["suggestions"],
): Input["suggestions"] | undefined => {
    if (!suggestions || suggestions.length === 0) return undefined;
    const seen = new Set<string>();
    const result: NonNullable<Input["suggestions"]> = [];
    for (const item of suggestions) {
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
        ...(schema.type ? {type: schema.type} : {}),
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
        ...(schema.type ? {type: schema.type} : {}),
        ...(suggestions.length > 0 ? {suggestions} : {}),
    };
};

/**
 * Returns the custom input kind for a type, or undefined if it maps to none.
 *
 * Custom-input data types are branded (e.g. `number & {}`) so their alias name
 * survives type resolution — TypeScript otherwise discards the name of bare
 * primitive aliases. The preserved alias name is looked up in
 * {@link CUSTOM_INPUT_IDENTIFIERS}.
 *
 * @param type - The type to check
 * @returns The mapped input kind (e.g. "date"), or undefined
 */
function getCustomInput(
    type: ts.Type,
): (typeof CUSTOM_INPUT_IDENTIFIERS)[CustomInputIdentifier] | undefined {
    const name = type.aliasSymbol?.getName();
    return isCustomInputIdentifier(name) ? CUSTOM_INPUT_IDENTIFIERS[name] : undefined;
}

/**
 * Returns the custom input kind implied by a *declared* type when that type is a
 * type parameter constrained by a custom-input data type — or undefined
 * otherwise.
 *
 * Example: a REST trigger `<T extends TYPE>(...): REST_ADAPTER_INPUT<T>`. Once
 * the call is resolved (e.g. `REST_ADAPTER_INPUT<number>`), the `payload`
 * property's type is the concrete argument (`number`) and has lost the TYPE
 * alias, so {@link getCustomInput} can no longer recover it. The signature's
 * *declared* return type, however, still carries the type parameter `T` whose
 * constraint is TYPE — so the custom input is recovered from there while the
 * concrete instantiated type is still rendered as the schema's `type` (see the
 * `declaredType` threading in {@link getSchema}).
 */
function getCustomInputFromConstraint(
    checker: ts.TypeChecker,
    type: ts.Type,
): (typeof CUSTOM_INPUT_IDENTIFIERS)[CustomInputIdentifier] | undefined {
    if ((type.flags & ts.TypeFlags.TypeParameter) === 0) return undefined;

    const typeParamDecl = type.symbol?.declarations?.[0];
    if (
        !typeParamDecl ||
        !ts.isTypeParameterDeclaration(typeParamDecl) ||
        !typeParamDecl.constraint
    ) {
        return undefined;
    }

    // getTypeFromTypeNode (not getBaseConstraintOfType) so the constraint's
    // alias name survives — the same reason the type-parameter branch of
    // getSchema resolves constraints this way.
    return getCustomInput(checker.getTypeFromTypeNode(typeParamDecl.constraint));
}

/**
 * Resolves the type of a named property on the declared type, or undefined when
 * it has no such property. Used to walk the declared type in step with the
 * concrete type so a custom-input-constrained type parameter (see
 * {@link getCustomInputFromConstraint}) can still be recovered from the
 * declaration after instantiation.
 */
function getDeclaredPropertyType(
    checker: ts.TypeChecker,
    declaredType: ts.Type,
    propertyName: string,
): ts.Type | undefined {
    const symbol = checker.getPropertyOfType(declaredType, propertyName);
    const declaration = symbol?.valueDeclaration ?? symbol?.declarations?.[0];
    return declaration
        ? checker.getTypeOfSymbolAtLocation(symbol!, declaration)
        : undefined;
}

/**
 * Checks whether a type is the FILE data type.
 *
 * A type only counts as FILE when it is *both* named `FILE` and shaped like FILE
 * (`{ contentType: M; fileName: string; valueType: 'base64'; value: string }`) —
 * the name alone could be an unrelated alias, and the shape alone could be a
 * coincidental object literal. The `valueType: 'base64'` literal is the
 * distinguishing part of the structure.
 *
 * @param checker - The type checker
 * @param type - The type to check
 * @returns True if the type is the FILE data type
 */
function isFileType(checker: ts.TypeChecker, type: ts.Type): boolean {
    if (type.aliasSymbol?.getName() !== "FILE") return false;

    if ((type.flags & ts.TypeFlags.Object) === 0) return false;

    const properties = checker.getPropertiesOfType(type);
    if (properties.length !== 4) return false;

    const byName = new Map(properties.map((p) => [p.name, p]));
    const valueType = byName.get("valueType");
    if (
        !byName.has("contentType") ||
        !byName.has("fileName") ||
        !byName.has("value") ||
        !valueType
    )
        return false;

    const declaration = valueType.valueDeclaration ?? valueType.declarations?.[0];
    if (!declaration) return false;
    const valueTypeType = checker.getTypeOfSymbolAtLocation(valueType, declaration);
    return valueTypeType.isStringLiteral() && valueTypeType.value === "base64";
}

/**
 * Checks whether a type is the COLOR data type.
 *
 * A type only counts as COLOR when it is *both* named `COLOR` and shaped like
 * COLOR (`{ hue: number; saturation: number; lightness: number; alpha?: number }`) —
 * the name alone could be an unrelated alias, and the shape alone could be a
 * coincidental object literal. The three numeric channel properties
 * (`hue`, `saturation`, `lightness`) are the distinguishing part of the
 * structure; `alpha` is optional.
 *
 * @param checker - The type checker
 * @param type - The type to check
 * @returns True if the type is the COLOR data type
 */
function isColorType(checker: ts.TypeChecker, type: ts.Type): boolean {
    if (type.aliasSymbol?.getName() !== "COLOR") return false;

    if ((type.flags & ts.TypeFlags.Object) === 0) return false;

    const byName = new Map(
        checker.getPropertiesOfType(type).map((p) => [p.name, p])
    );

    return ["hue", "saturation", "lightness"].every((name) => {
        const property = byName.get(name);
        if (!property) return false;
        const declaration = property.valueDeclaration ?? property.declarations?.[0];
        if (!declaration) return false;
        return isNumber(checker.getTypeOfSymbolAtLocation(property, declaration));
    });
}


/**
 * Extracts the MIME type a FILE is constrained to from its `contentType`
 * generic. Returns the literal value when it is a valid MIME type
 * (e.g. `FILE<"image/png">` → "image/png"), otherwise falls back to the
 * wildcard — covering an unconstrained FILE whose
 * `contentType` is a plain string (`FILE<TEXT>`) as well as a literal that is
 * not a well-formed MIME type.
 *
 * @param checker - The type checker
 * @param type - The FILE type to read the mimetype from
 * @returns The MIME type, always a non-empty string
 */
function getFileMimetype(checker: ts.TypeChecker, type: ts.Type): string {

    const DEFAULT_MIMETYPE = "*/*";
    const MIMETYPE_PATTERN =
        /^(\*|[a-zA-Z0-9][a-zA-Z0-9!#$&^_.+-]*)\/(\*|[a-zA-Z0-9][a-zA-Z0-9!#$&^_.+-]*)$/;

    const contentType = checker
        .getPropertiesOfType(type)
        .find((p) => p.name === "contentType");
    if (!contentType) return DEFAULT_MIMETYPE;

    const declaration = contentType.valueDeclaration ?? contentType.declarations?.[0];
    if (!declaration) return DEFAULT_MIMETYPE;

    const contentTypeType = checker.getTypeOfSymbolAtLocation(contentType, declaration);
    if (contentTypeType.isStringLiteral() && MIMETYPE_PATTERN.test(contentTypeType.value)) {
        return contentTypeType.value;
    }
    return DEFAULT_MIMETYPE;
}
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
 * Checks whether a type surfaces as a select input.
 *
 * A select is a primitive literal union (e.g. `"a" | "b" | "c"`) or a single
 * string/number literal (e.g. `"GET"`). Boolean is excluded so that `true` /
 * `boolean` continue to render as a boolean input — mirroring the ordering in
 * {@link getSchema}, where the boolean check runs first. Used both for the
 * plain select input and to detect a {@link ListSelectInput} element.
 *
 * @param type - The type to check
 * @returns True if the type surfaces as a select
 */
function isSelectType(type: ts.Type): boolean {
    if (isBoolean(type)) return false;
    return isPrimitiveLiteralUnion(type) || isStringOrNumberLiteral(type);
}

/**
 * Checks whether a union's members are the *options of one input* rather than
 * alternative inputs: a string/number literal union (`'GET' | 'POST' | …`, which
 * renders as a single select offering all of them) or `boolean` (internally the
 * union `true | false`, which renders as a single boolean input).
 *
 * The distinction decides whether an entered value may narrow a union-typed slot
 * to the single member it picked. For an options union it must not: narrowing
 * `HTTP_METHOD` to the entered "GET" would hide the five other options of the
 * very select the user is filling. For a union of alternative inputs
 * (`COLOR | OBJECT<…>`, `TEXT | NUMBER`) it must: the member the value picked is
 * the one input of the set that describes it, and it is also the entry the slot's
 * {@link ListInput.declaredItems} already offers for it.
 *
 * @param type - The type to check
 * @returns True if the type is a union whose members are options of one input
 */
export function isOptionsUnion(type: ts.Type): boolean {
    if (!type.isUnion()) return false;
    // `boolean` is `true | false` internally, so it is a union whose two members
    // are the options of the one boolean input.
    if (isBoolean(type)) return true;
    const nonNullish = type.types.filter(
        (t) => (t.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)) === 0
    );
    return nonNullish.length > 0 && nonNullish.every(isStringOrNumberLiteral);
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