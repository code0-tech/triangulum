import ts from "typescript";
import {FunctionDefinition, SubFlowValue, SubFlowValueSetting} from "@code0-tech/sagittarius-graphql-types";
import {isSubFlow} from "./schema.util";
import {SuggestionCandidate, typeMatchCertainty} from "./suggestion.util";

/**
 * Extracts and creates a list of SubFlowValue objects from function declarations
 * that are compatible with the given parameter type.
 *
 * This function filters function declarations based on type compatibility and
 * converts matching functions into SubFlowValue objects that can be used as
 * sub-flows in a larger workflow.
 *
 * @param {ts.TypeChecker} checker - The TypeScript type checker for type analysis
 * @param {ts.FunctionDeclaration[]} functionDeclarations - Array of function declarations to analyze
 * @param {FunctionDefinition[]} functions - Array of function definitions for reference lookup
 * @param {ts.Type} paramType - The target parameter type that functions must be compatible with
 *
 * @returns {SuggestionCandidate[]} An array of sub-flow candidates for compatible
 *          functions, each carrying how certainly it satisfies the slot, or an
 *          empty array if the paramType is not a sub-flow type
 */
export const getSubFlows = (
    checker: ts.TypeChecker,
    functionDeclarations: ts.FunctionDeclaration[],
    functions: FunctionDefinition[],
    paramType: ts.Type
): SuggestionCandidate[] => {

    if (!isSubFlow(paramType)) {
        return [];
    }

    return functionDeclarations.flatMap((func) => {
        const candidate = createSubFlowIfCompatible(checker, func, functions, paramType);
        return candidate ? [candidate] : [];
    });

}

/**
 * Verifies that a function declaration is compatible with a given parameter type
 * and creates a SubFlowValue if the types match.
 *
 * Type compatibility is checked by comparing the function type against the expected
 * parameter type (e.g., a function signature like (number: number) => void).
 * If compatible, the function is converted into a SubFlowValue object with its
 * associated parameter settings.
 *
 * @param {ts.TypeChecker} checker - The TypeScript type checker for type analysis
 * @param {ts.FunctionDeclaration} func - The function declaration to check
 * @param {FunctionDefinition[]} functions - Array of function definitions for lookup
 * @param {ts.Type} paramType - The expected parameter type to check compatibility against
 *
 * @returns {SuggestionCandidate | null} A sub-flow candidate with its certainty if the
 *          function is compatible with the paramType and a matching function
 *          definition exists, or null otherwise
 */
const createSubFlowIfCompatible = (
    checker: ts.TypeChecker,
    func: ts.FunctionDeclaration,
    functions: FunctionDefinition[],
    paramType: ts.Type
): SuggestionCandidate | null => {

    // Get the full function type from the declaration
    const functionType = checker.getTypeAtLocation(func);

    // Check whether the function type fits the parameter type: the signature must
    // match the expected interface — e.g., paramType might be
    // (number: number) => void. A binding that only fits under a condition carries
    // that condition as its certainty (see {@link typeMatchCertainty}).
    const certainty = typeMatchCertainty(functionType, checker, paramType);
    if (!certainty) {
        return null;
    }

    // If type-compatible, find the function definition and create the SubFlowValue
    const functionName = normalizeFunctionName(func.name?.getText());
    const functionDefinition = functions.find((f) => f.identifier === functionName);

    if (!functionDefinition) {
        return null;
    }

    return {value: buildSubFlowValue(functionDefinition), certainty};

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

/**
 * Constructs a SubFlowValue object from a function definition.
 *
 * This function transforms a FunctionDefinition into a SubFlowValue with all
 * its parameter settings properly configured. Each parameter from the function
 * definition is converted into a SubFlowValueSetting object that includes
 * metadata such as identifier, default values, hidden status, and optional status.
 *
 * @param {FunctionDefinition} functionDefinition - The function definition to convert
 *
 * @returns {SubFlowValue} A SubFlowValue object with the function definition
 *          and all parameter settings configured
 */
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