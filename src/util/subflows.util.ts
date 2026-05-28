import ts from "typescript";
import {FunctionDefinition, SubFlowValue, SubFlowValueSetting} from "@code0-tech/sagittarius-graphql-types";
import {isSubFlow} from "./schema.util";

export const getSubFlows = (
    checker: ts.TypeChecker,
    functionDeclarations: ts.FunctionDeclaration[],
    functions: FunctionDefinition[],
    paramType: ts.Type
): SubFlowValue[] => {

    if (!isSubFlow(paramType)) {
        return [];
    }

    return functionDeclarations.flatMap((func) => {
        const subFlow = createSubFlowIfCompatible(checker, func, functions, paramType);
        return subFlow ? [subFlow] : [];
    });

}

const createSubFlowIfCompatible = (
    checker: ts.TypeChecker,
    func: ts.FunctionDeclaration,
    functions: FunctionDefinition[],
    paramType: ts.Type
): SubFlowValue | null => {

    // 2. Hole den Typ der Funktion (nicht nur den Return Type!)
    const functionType = checker.getTypeAtLocation(func);

    // 3. Prüfe ob functionType zu paramType assignierbar ist
    //    paramType ist z.B. (number: number) => void
    //    functionType sollte auch (number: number) => void (oder kompatibel) sein
    if (!checker.isTypeAssignableTo(functionType, paramType)) {
        return null;
    }

    // 4. Wenn kompatibel: Erstelle SubFlowValue
    const functionName = normalizeFunctionName(func.name?.getText());
    const functionDefinition = functions.find((f) => f.identifier === functionName);

    if (!functionDefinition) {
        return null;
    }

    return buildSubFlowValue(functionDefinition);

}

/**
 * Normalizes a function name by removing prefixes and replacing underscores with
 * double colons (::).
 *
 * This function applies the following transformations:
 * 1. Removes the "fn_" prefix
 * 2. Replaces the first underscore with "::"
 * 3. Replaces the second underscore with "::"
 *
 * Example: "fn_module_submodule" becomes "module::submodule"
 *
 * @param {string | undefined} rawName - The raw function name from the declaration
 *
 * @returns {string} The normalized function name, or an empty string if the input
 *          is undefined
 *
 * @private
 */
const normalizeFunctionName = (rawName: string | undefined): string => {
    if (!rawName) {
        return "";
    }
    return rawName
        .replace("fn_", "")
        .replace("_", "::")
        .replace("_", "::");
}

const buildSubFlowValue = (functionDefinition: FunctionDefinition): SubFlowValue => {
    return {
        __typename: "SubFlowValue",
        functionDefinition: functionDefinition,
        signature: functionDefinition.signature,
        settings: functionDefinition.parameterDefinitions?.nodes?.map(param => {
            const setting: SubFlowValueSetting = {
                __typename: "SubFlowValueSetting",
                identifier: param?.identifier,
                defaultValue: param?.defaultValue ?? null,
                hidden: param?.hidden ?? false,
                optional: param?.optional ?? false,
            }
            return setting
        })
    }
}