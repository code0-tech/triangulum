import {
    DefinitionDataType,
    RuntimeFunctionDefinition,
    ValidationFlow
} from "@code0-tech/tucana/shared";

export type SingleValidationInputData = {
    flow?: ValidationFlow,
    functions: RuntimeFunctionDefinition[],
    dataTypes: DefinitionDataType[]
};

export async function readSingleValidation(input: AsyncIterable<string>) {
    const data: SingleValidationInputData = {
        functions: [],
        dataTypes: []
    };

    let parsingState = 0;

    for await (const line of input) {
        if(line === '') {
            parsingState++;
            continue;
        }

        const message = Uint8Array.fromBase64(line);
        if(parsingState === 0) {
            data.flow = ValidationFlow.fromBinary(message);
        } else if(parsingState === 1) {
            data.functions.push(RuntimeFunctionDefinition.fromBinary(message));
        } else if(parsingState === 2) {
            data.dataTypes.push(DefinitionDataType.fromBinary(message));
        }
    }

    return data;
}

