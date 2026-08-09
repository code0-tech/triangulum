// Server-only entry point: getFlowSchemas depends on ts-json-schema-generator,
// which imports `fs` and therefore must never be pulled into browser bundles.
// Published as the "@code0-tech/triangulum/server" subpath export.
export * from './extraction/getFlowSchemas';
export type {JsonSchema} from './util/jsonSchema.util';
