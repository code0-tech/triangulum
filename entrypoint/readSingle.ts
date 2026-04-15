import { LiteralValue } from "@code0-tech/sagittarius-graphql-types";
import {
	DefinitionDataType,
	FunctionDefinition,
	ValidationFlow
} from "@code0-tech/tucana/shared";

export type SingleValidationInputData = {
	flow?: ValidationFlow,
	functions: FunctionDefinition[],
	dataTypes: DefinitionDataType[]
};

export type ValueValidationInputData = {
	type: string,
	value?: LiteralValue,
	dataTypes: DefinitionDataType[]
}

export async function readSingleValidation(input: AsyncIterable<string>) {
	const data: SingleValidationInputData = {
		functions: [],
		dataTypes: []
	};

	let parsingState = 0;

	for await (const line of input) {
		if (line === '') {
			parsingState++;
			continue;
		}

		const message = Uint8Array.fromBase64(line);
		if (parsingState === 0) {
			data.flow = ValidationFlow.fromBinary(message);
		} else if (parsingState === 1) {
			data.functions.push(FunctionDefinition.fromBinary(message));
		} else if (parsingState === 2) {
			data.dataTypes.push(DefinitionDataType.fromBinary(message));
		}
	}

	return data;
}

export async function readValueValidation(input: AsyncIterable<string>) {
	const data: ValueValidationInputData = {
		dataTypes: [],
		type: ""
	};

	let parsingState = 0;

	for await (const line of input) {
		if (line === '') {
			parsingState++;
			continue;
		}

		const message = Uint8Array.fromBase64(line);
		if (parsingState === 0) {
			let index = line.indexOf("{")
			data.type = line.substring(index)
		} else if (parsingState === 1) {
			let json = JSON.parse(line)
			let literalValue: LiteralValue = {
				__typename: 'LiteralValue',
				value: json,
			}
			data.value = literalValue
		} else if (parsingState === 2) {
			data.dataTypes.push(DefinitionDataType.fromBinary(message));
		}
	}

	return data;
}

