import { readValueValidation } from "./readSingle";
import { mapToValueValidation } from "./mapper";
import { getValueValidation } from "@code0-tech/triangulum";

const data = await readValueValidation(console);
const validationInput = mapToValueValidation(data);

const result = getValueValidation(validationInput.type, validationInput.value, validationInput.dataTypes)

console.info(JSON.stringify(result));
