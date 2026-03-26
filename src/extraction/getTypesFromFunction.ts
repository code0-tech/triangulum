import {FunctionDefinition} from "@code0-tech/sagittarius-graphql-types";

export interface FunctionTypes {
    parameters: string[];
    returnType: string;
}

/**
 * Resolves the types of the parameters and the return type of a NodeFunction.
 */
export const getTypesFromFunction = (
    functionDefinition: FunctionDefinition
): FunctionTypes => {
    const signature = functionDefinition.signature;

    if (!signature) {
        return {parameters: [], returnType: "any"};
    }

    let searchStart = 0;
    // Skip generics
    if (signature.trim().startsWith('<')) {
        let depth = 0;
        for (let i = 0; i < signature.length; i++) {
            const char = signature[i];
            if (char === '<') depth++;
            else if (char === '>') {
                depth--;
                if (depth === 0) {
                    searchStart = i + 1;
                    break;
                }
            }
        }
    }

    const paramStart = signature.indexOf('(', searchStart);
    if (paramStart === -1) {
        return {parameters: [], returnType: "any"};
    }

    // Find matching closing paren
    let paramEnd = -1;
    let depth = 0;
    for (let i = paramStart; i < signature.length; i++) {
        const char = signature[i];
        if (char === '(') depth++;
        else if (char === ')') {
            depth--;
            if (depth === 0) {
                paramEnd = i;
                break;
            }
        }
    }

    if (paramEnd === -1) {
        return {parameters: [], returnType: "any"};
    }

    const paramsString = signature.substring(paramStart + 1, paramEnd);
    let returnTypeString = signature.substring(paramEnd + 1).trim();

    // Parse return type
    if (returnTypeString.startsWith(':')) {
        returnTypeString = returnTypeString.substring(1).trim();
    }
    const returnType = returnTypeString || "void";

    // Parse parameters
    const parameters: string[] = [];
    if (paramsString.trim()) {
        let currentParam = "";
        let pDepthParen = 0;
        let pDepthAngle = 0;
        let pDepthBrace = 0;
        let pDepthBracket = 0;

        const pushParam = (p: string) => {
            // Extract type from "name: Type"
            // Scan for first colon at top level
            let colonIndex = -1;

            let cDepthBrace = 0;
            let cDepthBracket = 0;
            let cDepthParen = 0;
            let cDepthAngle = 0;

            for (let i = 0; i < p.length; i++) {
                const c = p[i];
                if (c === '{') cDepthBrace++;
                else if (c === '}') cDepthBrace--;
                else if (c === '[') cDepthBracket++;
                else if (c === ']') cDepthBracket--;
                else if (c === '(') cDepthParen++;
                else if (c === ')') cDepthParen--;
                else if (c === '<') cDepthAngle++;
                else if (c === '>') cDepthAngle--;
                else if (c === ':' && cDepthBrace === 0 && cDepthBracket === 0 && cDepthParen === 0 && cDepthAngle === 0) {
                    colonIndex = i;
                    break;
                }
            }

            if (colonIndex !== -1) {
                parameters.push(p.substring(colonIndex + 1).trim());
            } else {
                parameters.push("any");
            }
        };

        for (const char of paramsString) {
            if (char === '(') pDepthParen++;
            else if (char === ')') pDepthParen--;
            else if (char === '<') pDepthAngle++;
            else if (char === '>') pDepthAngle--;
            else if (char === '{') pDepthBrace++;
            else if (char === '}') pDepthBrace--;
            else if (char === '[') pDepthBracket++;
            else if (char === ']') pDepthBracket--;
            else if (char === ',' && pDepthParen === 0 && pDepthAngle === 0 && pDepthBrace === 0 && pDepthBracket === 0) {
                pushParam(currentParam.trim());
                currentParam = "";
                continue;
            }
            currentParam += char;
        }
        if (currentParam.trim()) {
            pushParam(currentParam.trim());
        }
    }

    return {
        parameters,
        returnType
    };
};
