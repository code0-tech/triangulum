import ts, {flattenDiagnosticMessageText} from "typescript";
import {DataType, Flow, FunctionDefinition, NodeFunction} from "@code0-tech/sagittarius-graphql-types";
import {createCompilerHost, generateFlowSourceCode, ValidationResult} from "../utils";

// TypeScript diagnostic codes we may soften into warnings for union-branch references.
const TS_ARGUMENT_NOT_ASSIGNABLE = 2345; // "Argument of type X is not assignable to parameter of type Y."
const TS_PROPERTY_DOES_NOT_EXIST = 2339; // "Property 'p' does not exist on type X."

/**
 * Finds the innermost AST node that fully contains the [start, end) span.
 */
const findInnermostNode = (node: ts.Node, start: number, end: number): ts.Node | undefined => {
    if (node.getStart() > start || node.getEnd() < end) return undefined;
    let result: ts.Node = node;
    node.forEachChild((child) => {
        const found = findInnermostNode(child, start, end);
        if (found) result = found;
    });
    return result;
};

/**
 * Decides whether a type error stems from a reference whose value type is a union
 * where at least one branch would satisfy the expected type, but not all of them do:
 *
 *  - a nullable reference — `TEXT | null` used for a plain TEXT parameter (the value
 *    might be null/undefined at runtime); or
 *  - a union-branch reference — `flexible: TEXT | { deep: TEXT }` used for a plain
 *    TEXT parameter, or drilling into `flexible.deep` which only exists on the object
 *    branch (the value might be the wrong branch at runtime).
 *
 * Both are references the schema engine offers as suggestions, so using them is a
 * warning rather than a hard error — the flow stays valid. Genuine mismatches where
 * no branch fits (e.g. `NUMBER | null` → TEXT) stay errors.
 */
const isSoftReferenceMismatch = (
    diagnostic: ts.Diagnostic,
    sourceFile: ts.SourceFile,
    checker: ts.TypeChecker
): boolean => {
    if (diagnostic.start === undefined || diagnostic.length === undefined) return false;

    const node = findInnermostNode(sourceFile, diagnostic.start, diagnostic.start + diagnostic.length);
    if (!node) return false;

    // Argument not assignable: the argument's type is a union and at least one of its
    // non-nullish branches is assignable to the contextually expected parameter type.
    // Nullish branches are excluded so that `NUMBER | null` (no assignable base branch)
    // stays a hard error, while `TEXT | null` and `TEXT | { deep: TEXT }` soften.
    if (diagnostic.code === TS_ARGUMENT_NOT_ASSIGNABLE && ts.isExpression(node)) {
        const argType = checker.getTypeAtLocation(node);
        if (!argType.isUnion()) return false;

        const expectedType = checker.getContextualType(node);
        if (!expectedType) return false;

        return argType.types.some((branch) =>
            (branch.flags & (ts.TypeFlags.Null | ts.TypeFlags.Undefined)) === 0 &&
            checker.isTypeAssignableTo(branch, expectedType)
        );
    }

    // Property access into a union branch: the accessed object is a union and the
    // property exists on at least one of its branches.
    if (diagnostic.code === TS_PROPERTY_DOES_NOT_EXIST && ts.isPropertyAccessExpression(node.parent)) {
        const objectType = checker.getNonNullableType(checker.getTypeAtLocation(node.parent.expression));
        if (!objectType.isUnion()) return false;

        const propertyName = node.getText();
        return objectType.types.some((branch) => branch.getProperty(propertyName) !== undefined);
    }

    return false;
};

/**
 * Validates a flow by generating virtual TypeScript code and running it through the TS compiler.
 */
export const getFlowValidation = (
    flow?: Flow,
    functions?: FunctionDefinition[],
    dataTypes?: DataType[]
): ValidationResult => {

    if (!flow?.startingNodeId) {
        return {
            isValid: false,
            returnType: "void",
            diagnostics: [{
                nodeId: null,
                parameterIndex: null,
                code: 0,
                message: "You need to provide a starting node to be able to execute this flow.",
                severity: "error",
            }]
        }
    }

    if (!flow.nodes?.nodes?.find(n => n?.id == flow.startingNodeId)) {
        return {
            isValid: false,
            returnType: "void",
            diagnostics: [{
                nodeId: null,
                parameterIndex: null,
                code: 0,
                message: "The starting node is not linked within the flow. Please make sure the starting node is connected to the rest of the flow.",
                severity: "error",
            }]
        }
    }

    const functionIdentifiers = new Set(functions?.map(f => f.identifier));
    const unreachableFunctionDiagnostics = (flow.nodes?.nodes ?? [])
        .filter(n => n?.functionDefinition && !functionIdentifiers.has(n.functionDefinition.identifier))
        .map(n => ({
            nodeId: n!.id,
            parameterIndex: null,
            code: 0,
            message: `The function definition "${n!.functionDefinition!.identifier}" is not reachable.`,
            severity: "error" as const,
        }));

    if (unreachableFunctionDiagnostics.length > 0) {
        return {
            isValid: false,
            returnType: "void",
            diagnostics: unreachableFunctionDiagnostics,
        }
    }

    // Validation keeps reference nullability (assertNonNullReferences = false) so that a
    // possibly-null reference into a non-null parameter surfaces as a diagnostic, which is
    // then downgraded to a warning below instead of being silently suppressed by a `!`.
    const sourceCode = generateFlowSourceCode(flow, functions, dataTypes, false, false);

    // 3. Virtual TypeScript Compilation
    const fileName = "index.ts";
    const host = createCompilerHost(fileName, sourceCode);
    const sourceFile = host.getSourceFile(fileName)!;

    const program = host.languageService.getProgram()!;
    const checker = program.getTypeChecker();
    const diagnostics = program.getSemanticDiagnostics(sourceFile);

    const errors = diagnostics.map(d => {
        const message = flattenDiagnosticMessageText(d.messageText, "\n");
        // "Argument of type 'undefined' is not assignable to parameter of type 'number'."
        // We ignore this in flow validation too because we might generate code for incomplete flows.

        let nodeId: NodeFunction['id'] | undefined;
        let parameterIndex: number | null = null;

        if (d.start !== undefined) {
            const fullText = sourceFile.getFullText();

            // Search for position marker comment near the error location
            // The error position is typically the start of the problematic token (e.g., "undefined")
            const searchStart = Math.max(0, d.start - 300);
            const searchEnd = Math.min(fullText.length, d.start);
            const searchText = fullText.substring(searchStart, searchEnd);

            // Find all @pos comments in the search range
            const posRegex = /\/\* @pos ([^ ]+) (\d+|null) \*\//g;
            let match;
            let closestMatch: RegExpExecArray | null = null;
            let closestCommentEnd = -1;

            // Collect all matches and find the one whose end is closest to d.start
            // We want the comment that is immediately before the error
            while ((match = posRegex.exec(searchText)) !== null) {
                const commentStart = searchStart + match.index;
                const commentEnd = commentStart + match[0].length;

                // Only consider comments that end before or very close to the error start
                // This ensures we get the @pos comment that directly precedes the problematic argument
                if (commentEnd <= d.start!) {
                    if (commentEnd > closestCommentEnd) {
                        closestCommentEnd = commentEnd;
                        closestMatch = match;
                    }
                }
            }

            if (closestMatch) {
                nodeId = closestMatch[1] === "null" ? null : closestMatch[1] as NodeFunction['id'];
                parameterIndex = parseInt(closestMatch[2], 10);
            }
        }

        // A nullable reference (`TEXT | null`) or a union-branch reference
        // (`TEXT | { deep: TEXT }`) into a non-null parameter is a valid suggestion, so its
        // mismatch is a warning rather than a hard error — the flow stays valid.
        const severity: "error" | "warning" = isSoftReferenceMismatch(d, sourceFile, checker) ? "warning" : "error";

        return {
            message,
            code: d.code,
            severity,
            nodeId,
            parameterIndex: typeof parameterIndex == "number" && Number.isSafeInteger(parameterIndex) ? parameterIndex : null,
        };
    }).filter((e) => e !== null);

    return {
        isValid: !errors.some(e => e?.severity === "error"),
        returnType: "void",
        diagnostics: errors,
    };
};