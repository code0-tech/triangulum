import ts from "typescript";
import {
    DataType,
    Flow,
    FunctionDefinition,
    NodeFunction,
    NodeParameter,
    ReferenceValue
} from "@code0-tech/sagittarius-graphql-types";
import {
    createCompilerHost,
    getParameterCode,
    getSharedTypeDeclarations,
    validateReference,
    ValidationResult
} from "../utils";

/**
 * Validates a single node's parameters and scope, then infers its return type.
 */
export const getNodeValidation = (
    flow?: Flow,
    node?: NodeFunction,
    functions?: FunctionDefinition[],
    dataTypes?: DataType[]
): ValidationResult => {
    const funcMap = new Map(functions?.map(f => [f.identifier, f]));
    const funcDef = funcMap.get(node?.functionDefinition?.identifier);
    if (!funcDef) {
        return {
            isValid: false,
            returnType: "any",
            diagnostics: [{message: `Function ${node?.id} not found`, nodeId: node?.id, code: 404, severity: "error"}],
        };
    }

    const params = (node?.parameters?.nodes as NodeParameter[]) || [];
    const scopeErrors: ValidationResult["diagnostics"] = [];

    // 1. Parameter scope validation
    for (const param of params) {
        const val = param.value;
        if (val?.__typename === "ReferenceValue") {
            const validation = validateReference(flow, node, val as ReferenceValue);
            if (!validation.isValid) {
                scopeErrors.push({
                    message: validation.error || "Scope error",
                    code: 403,
                    nodeId: node?.id,
                    parameterIndex: params.indexOf(param),
                    severity: "error"
                });
            }
        }
    }

    if (scopeErrors.length > 0) {
        return {
            isValid: false,
            returnType: "any",
            diagnostics: scopeErrors,
        };
    }

    // 2. Code generation for type inference
    const paramCodes = params.map(param => getParameterCode(param, flow, (f, n) => getNodeValidation(f, n, functions, dataTypes)));
    const funcCallArgs = paramCodes.map(code =>
        code === 'undefined' ? '({} as any)' : code
    ).join(", ");

    let signature = funcDef.signature;

    const sourceCode = `
        ${getSharedTypeDeclarations(dataTypes)}
        declare function testFunc${signature};
        const result = testFunc(${funcCallArgs});
    `;

    console.log(sourceCode)

    // 3. Virtual compilation
    const fileName = "index.ts";
    const host = createCompilerHost(fileName, sourceCode);
    const sourceFile = host.getSourceFile(fileName)!;

    const program = host.languageService.getProgram()!;
    const checker = program.getTypeChecker();
    const diagnostics = program.getSemanticDiagnostics(sourceFile);

    let inferredType = "any";

    // 4. Extract inferred type of 'result'
    const findResultType = (n: ts.Node) => {
        if (ts.isVariableDeclaration(n) && n.name.getText() === "result") {
            const type = checker.getTypeAtLocation(n);
            inferredType = checker.typeToString(
                type,
                n,
                ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseFullyQualifiedType
            );
        }
        ts.forEachChild(n, findResultType);
    };
    findResultType(sourceFile);

    const errors = diagnostics.map(d => {
        const message = ts.flattenDiagnosticMessageText(d.messageText, "\n");
        // Generic placeholders like T, R, K, V are often warnings rather than hard errors if they remains un-inferred
        const isGenericPlaceholder = /\b([TRKV])\b/.test(message);

        // Match specific phrases that indicate a mock error from our code generation,
        // while allowing other "not assignable" errors (which represent real logic errors).
        const isMockError = (message.includes("not assignable to parameter of type") && (message.includes("'{}'") || message.includes("undefined"))) ||
            message.includes("not assignable to type 'undefined'") ||
            message.includes("not assignable to type 'void'") ||
            message.includes("may be a mistake because neither type sufficiently overlaps");

        return {
            message,
            code: d.code,
            nodeId: node?.id,
            parameterIndex: (() => {
                if (d.start !== undefined) {
                    const argIndex = params.findIndex((_, i) => {
                        const start = sourceCode.indexOf(paramCodes[i]);
                        return d.start! >= start && d.start! < start + paramCodes[i].length;
                    });
                    if (argIndex !== -1) return argIndex;
                }
            })(),
            severity: (isGenericPlaceholder || isMockError ? "warning" : "error") as "error" | "warning",
        };
    });

    return {
        isValid: !errors.some(e => e.severity === "error"),
        returnType: inferredType,
        diagnostics: errors,
    };
};
