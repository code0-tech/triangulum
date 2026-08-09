import {
    createFormatter,
    createParser,
    DEFAULT_CONFIG,
    SchemaGenerator,
} from "ts-json-schema-generator"
import type {CompletedConfig, Schema} from "ts-json-schema-generator"
import type {DataType} from "@code0-tech/sagittarius-graphql-types"
import {createCompilerHost, getSharedTypeDeclarations} from "../utils"

/** A generated JSON Schema, as produced by {@link generateJsonSchemas}. */
export type JsonSchema = Schema

/**
 * Configuration for {@link https://github.com/vega/ts-json-schema-generator ts-json-schema-generator}.
 *
 * `expose: "none"` + `topRef: false` inline every referenced type so each schema
 * is self-contained (no `$ref`/`definitions` indirection); `skipTypeCheck`
 * avoids failing on the minimal virtual lib; JSDoc is irrelevant here.
 */
const CONFIG: CompletedConfig = {
    ...DEFAULT_CONFIG,
    expose: "none",
    topRef: false,
    jsDoc: "none",
    skipTypeCheck: true,
}

/**
 * Generates JSON schemas for a batch of named TypeScript type expressions.
 *
 * The type strings (e.g. `"{ item: { test: number } }"` or `"NUMBER"`) are
 * resolved through the same shared data-type declarations the rest of the
 * library uses, then handed to `ts-json-schema-generator` for the actual JSON
 * Schema generation — no schema shape is hand-built here.
 *
 * @param typeExpressions - Map of alias name to TypeScript type expression
 * @param dataTypes - Data type definitions used to resolve named types/generics
 * @returns Map of the same alias names to their generated JSON schema; an alias
 *          that fails to generate maps to the open schema `{}`
 */
export const generateJsonSchemas = (
    typeExpressions: Record<string, string>,
    dataTypes?: DataType[],
): Record<string, JsonSchema> => {
    const aliasNames = Object.keys(typeExpressions)
    if (aliasNames.length === 0) return {}

    const generator = createGenerator(buildSourceCode(typeExpressions, dataTypes))

    const schemas: Record<string, JsonSchema> = {}
    for (const name of aliasNames) {
        try {
            schemas[name] = stripEnvelope(generator.createSchema(name))
        } catch {
            // A type that cannot be generated (e.g. a still-unresolved type
            // parameter) degrades to the open schema rather than failing the flow.
            schemas[name] = {}
        }
    }
    return schemas
}

/**
 * Builds the virtual module handed to the generator: the shared data-type
 * declarations followed by one exported type alias per requested expression.
 */
const buildSourceCode = (
    typeExpressions: Record<string, string>,
    dataTypes?: DataType[],
): string => {
    const aliases = Object.entries(typeExpressions)
        .map(([name, expression]) => `export type ${name} = ${expression};`)
        .join("\n")
    return `${getSharedTypeDeclarations(dataTypes)}\n${aliases}`
}

/**
 * The `ts.Program` type the generator expects. It bundles its own TypeScript,
 * so its `Program` is nominally distinct from ours even though both are
 * structurally identical at runtime — casting through this alias bridges the two.
 */
type GeneratorProgram = Parameters<typeof createParser>[0]

/** Compiles the source in a virtual environment and wires up the generator. */
const createGenerator = (sourceCode: string): SchemaGenerator => {
    const program = createCompilerHost("index.ts", sourceCode)
        .languageService.getProgram()! as unknown as GeneratorProgram

    return new SchemaGenerator(
        program,
        createParser(program, CONFIG),
        createFormatter(CONFIG),
        CONFIG,
    )
}

/**
 * Removes the generator's document envelope (`$schema`, empty `definitions`) so
 * the returned value is just the schema for the type itself. The JSON round-trip
 * additionally drops `undefined`-valued keys the generator leaves behind (e.g.
 * `additionalProperties: undefined`) and guarantees a plain JSON value.
 */
const stripEnvelope = (schema: Schema): JsonSchema => {
    const {$schema, definitions, ...rest} = schema
    const withoutEnvelope =
        definitions && Object.keys(definitions).length > 0
            ? {...rest, definitions}
            : rest
    return JSON.parse(JSON.stringify(withoutEnvelope))
}
