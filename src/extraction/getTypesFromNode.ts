import ts from "typescript";
import {DataType, Flow, FunctionDefinition, NodeFunction, NodeParameter} from "@code0-tech/sagittarius-graphql-types";
import {createCompilerHost, DEFAULT_COMPILER_OPTIONS, getParameterCode, getSharedTypeDeclarations,} from "../utils";
import {getNodeValidation} from "../validation/getNodeValidation"; // Wieder hinzugefügt

export interface NodeTypes {
    parameters: string[];
    returnType: string;
}

/**
 * Resolves the types of the parameters and the return type of a NodeFunction.
 */
export const getTypesFromNode = (
    node: NodeFunction,
    functions: FunctionDefinition[],
    dataTypes: DataType[]
): NodeTypes => {
    const funcMap = new Map(functions.map(f => [f.identifier, f]));
    const funcDef = funcMap.get(node.functionDefinition?.identifier);

    if (!funcDef) {
        return {
            parameters: [],
            returnType: "any",
        };
    }

    const mockFlow: Flow = {
        id: "gid://sagittarius/Flow/0" as any,
        nodes: {__typename: "NodeFunctionConnection", nodes: [node]}
    } as Flow;

    const params = (node.parameters?.nodes as NodeParameter[]) || [];
    const paramCodes = params.map(param => getParameterCode(param, mockFlow, (f, n) => getNodeValidation(f, n, functions, dataTypes)));

    const funcCallArgs = paramCodes.map(code => code === 'undefined' ? '({} as any)' : code).join(", ");

    const signature = funcDef.signature;
    const sourceCode = `
        ${getSharedTypeDeclarations(dataTypes)}
        declare function testFunc${signature};
        const result = testFunc(${funcCallArgs});
    `;

    const fileName = "node_types_virtual.ts";
    const sourceFile = ts.createSourceFile(fileName, sourceCode, ts.ScriptTarget.Latest);
    const host = createCompilerHost(fileName, sourceCode, sourceFile);

    const program = ts.createProgram([fileName], DEFAULT_COMPILER_OPTIONS, host);
    const checker = program.getTypeChecker();

    let inferredReturnType = "any";
    let inferredParameterTypes: string[] = [];

    const visitor = (n: ts.Node) => {
        if (ts.isVariableDeclaration(n) && n.name.getText() === "result") {
            const resultType = checker.getTypeAtLocation(n);
            inferredReturnType = checker.typeToString(
                resultType,
                n,
                ts.TypeFormatFlags.NoTruncation
            );

            if (ts.isCallExpression(n.initializer!)) {
                const callExpr = n.initializer;
                const signature = checker.getResolvedSignature(callExpr);
                if (signature) {
                    inferredParameterTypes = signature.getParameters().map(p => {
                        const type = checker.getTypeOfSymbolAtLocation(p, callExpr);
                        return checker.typeToString(
                            type,
                            callExpr,
                            ts.TypeFormatFlags.NoTruncation
                        );
                    });
                }
            }
        }
        ts.forEachChild(n, visitor);
    };

    visitor(sourceFile);

    return {
        parameters: inferredParameterTypes,
        returnType: inferredReturnType,
    };
};
