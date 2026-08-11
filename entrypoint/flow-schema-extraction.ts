import {readSingleValidation} from "./readSingle";
import {mapToFlowValidation} from "./mapper";
import {getFlowSchemas} from "@code0-tech/triangulum/server";
import type {JsonSchema, SchematizedSubFlowValue} from "@code0-tech/triangulum/server";
import type {Scalars} from "@code0-tech/sagittarius-graphql-types";

const data = await readSingleValidation(console);
const validationInput = mapToFlowValidation(data);

const result = getFlowSchemas(validationInput.flow, validationInput.functions, validationInput.dataTypes)

if (result) {
    type MappedResult = {
        flow: {
            inputSchema: JsonSchema,
            outputSchema: JsonSchema,
        },
        subflowParameters: {
            id: Scalars['NodeParameterID']['output'],
            inputSchema: JsonSchema,
            outputSchema: JsonSchema,
        }[],
    }

    const mappedResult: MappedResult = {
        flow: {
            inputSchema: result.inputSchema,
            outputSchema: result.outputSchema,
        },
        subflowParameters: [],
    }

    result.nodes?.nodes?.forEach(node =>
        node?.parameters?.nodes?.forEach(parameter => {
            const value = parameter?.value;
            if (value?.__typename === 'SubFlowValue') {
                const schemaValue = value as SchematizedSubFlowValue;
                mappedResult.subflowParameters.push({
                    id: parameter?.id!,
                    inputSchema: schemaValue.inputSchema,
                    outputSchema: schemaValue.outputSchema,
                })
            }
        }))

    console.info(JSON.stringify(mappedResult));
} else {
    process.exitCode = 2;
}
