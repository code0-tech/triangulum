import {readSingleValidation} from "./readSingle";
import {mapToFlowValidation} from "./mapper";
import {getFlowValidation} from "@code0-tech/triangulum";

const data = await readSingleValidation(console);
const validationInput = mapToFlowValidation(data);

const result = getFlowValidation(validationInput.flow, validationInput.functions, validationInput.dataTypes)

console.info(JSON.stringify(result));
