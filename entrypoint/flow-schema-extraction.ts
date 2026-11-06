import {readSingleValidation} from "./readSingle";
import {mapToFlowValidation} from "./mapper";
import {getFlowSchemas} from "@code0-tech/triangulum/server";
import type {JsonSchema, SchematizedSubFlowValue} from "@code0-tech/triangulum/server";
import type {InlineReferenceValue, NodeParameter, Scalars} from "@code0-tech/sagittarius-graphql-types";

const data = await readSingleValidation(console);
const validationInput = mapToFlowValidation(data);

const result = getFlowSchemas(validationInput.flow, validationInput.functions, validationInput.dataTypes)

if (result) {
    type SchematizedSubFlowParameter = {
        id: Scalars['NodeParameterID']['output'],
        inputSchema: JsonSchema,
        outputSchema: JsonSchema,
    }

    /**
     * A sub-flow that does not fill a parameter itself but sits inline in a
     * literal's `references`, addressed via `${signature}`. It is identified by
     * the id of the inline reference holding it.
     */
    type SchematizedSubFlowReference = {
        id: Scalars['InlineReferenceValueID']['output'],
        inputSchema: JsonSchema,
        outputSchema: JsonSchema,
    }

    type MappedResult = {
        flow: {
            inputSchema: JsonSchema,
            outputSchema: JsonSchema,
        },
        subflowParameters: SchematizedSubFlowParameter[],
        subflowReferences: SchematizedSubFlowReference[],
    }

    const mappedResult: MappedResult = {
        flow: {
            inputSchema: result.inputSchema,
            outputSchema: result.outputSchema,
        },
        subflowParameters: [],
        subflowReferences: [],
    }

    const collectInlineReferences = (
        references: (InlineReferenceValue | null | undefined)[] | null | undefined,
    ): void => {
        references?.forEach(reference => {
            const value = reference?.value;
            if (!value) return;

            if (value.__typename === 'SubFlowValue') {
                // `database_id` is optional in the proto. Without it the sub-flow
                // cannot be addressed, and emitting a null id would make the
                // consumer match the wrong rows, so it is left out entirely.
                if (!reference?.id) return;

                const schemaValue = value as SchematizedSubFlowValue;
                mappedResult.subflowReferences.push({
                    id: reference.id,
                    inputSchema: schemaValue.inputSchema,
                    outputSchema: schemaValue.outputSchema,
                })
            } else if (value.__typename === 'LiteralValue') {
                collectInlineReferences(value.references)
            }
        })
    }

    const collectParameter = (parameter: NodeParameter | null | undefined): void => {
        const value = parameter?.value;
        if (!value) return;

        if (value.__typename === 'SubFlowValue') {
            const schemaValue = value as SchematizedSubFlowValue;
            mappedResult.subflowParameters.push({
                id: parameter?.id!,
                inputSchema: schemaValue.inputSchema,
                outputSchema: schemaValue.outputSchema,
            })
        } else if (value.__typename === 'LiteralValue') {
            collectInlineReferences(value.references)
        }
    }

    result.nodes?.nodes?.forEach(node =>
        node?.parameters?.nodes?.forEach(collectParameter))

    console.info(JSON.stringify(mappedResult));
} else {
    process.exitCode = 2;
}
