import ts from "typescript";
import {DataType, Flow, FunctionDefinition, NodeFunction, ReferenceValue} from "@code0-tech/sagittarius-graphql-types";
import {createCompilerHost, generateFlowSourceCode} from "../utils";

/**
 * Calculates all available reference suggestions for a specific target node in a flow
 * and filters them by a required type.
 */
export const getReferenceSuggestions = (
    flow?: Flow,
    nodeId?: NodeFunction['id'],
    targetIndex?: number,
    functions?: FunctionDefinition[],
    dataTypes?: DataType[]
): ReferenceValue[] => {

    const sourceCode = generateFlowSourceCode(flow, functions, dataTypes, true);
    const fileName = "index.ts";
    const host = createCompilerHost(fileName, sourceCode);
    const sourceFile = host.getSourceFile(fileName)!;
    const program = host.languageService.getProgram()!;
    const checker = program.getTypeChecker();

    // 2. Suche die exakte Text-Position des Kommentars
    const fullText = sourceFile.getFullText();
    const commentPattern = `/* @pos ${nodeId} ${targetIndex} */`;
    const commentIndex = fullText.indexOf(commentPattern);

    // Die Position des eigentlichen Nodes ist direkt nach dem Kommentar
    const targetPos = commentIndex + commentPattern.length;

    // 3. Finde den kleinsten AST-Node an dieser Position
    function findNodeAtPosition(node: ts.Node, pos: number): ts.Node {
        let found = node;
        ts.forEachChild(node, child => {
            if (child.getStart(sourceFile, true) <= pos && child.getEnd() >= pos) {
                found = findNodeAtPosition(child, pos);
            }
        });
        return found;
    }

    let targetNode = findNodeAtPosition(sourceFile, targetPos);
    const targetExpression = targetNode as ts.Expression;

    // 4. Umschließenden Funktionsaufruf finden (identisch zu deinem Code)
    let parentCall: ts.CallExpression | undefined;

    if (ts.isCallExpression(targetExpression)) {
        parentCall = targetExpression;
    }

    if (!parentCall) {
        return []
    }

    // 5. Typ-Check und Variablen-Extraktion
    const signature = checker.getResolvedSignature(parentCall);
    if (!signature) return [];

    const params = signature.getParameters();
    const paramSymbol = params[targetIndex!] || params[params.length - 1];
    const expectedType = checker.getTypeOfSymbolAtLocation(paramSymbol, targetExpression);

    const allSymbols = checker.getSymbolsInScope(targetExpression, ts.SymbolFlags.Variable);

    const referenceValues: ReferenceValue[] = [];

    allSymbols.forEach(symbol => {
        const name = symbol.getName();
        if (!name.startsWith("node_") && !name.startsWith("p_")) return;

        // 1. Erhalte die Deklaration der Variable
        const declaration = symbol.valueDeclaration || symbol.declarations?.[0];
        if (!declaration) return;

        // 2. Reachability-Check:
        // Die Deklaration muss VOR der targetPos enden.
        // (Damit schließen wir die aktuelle Zeile und alles danach aus)
        if (declaration.getEnd() >= targetPos) {
            return;
        }

        const symbolType = checker.getTypeOfSymbolAtLocation(symbol, targetExpression!);

        // FALL 1: Node-Ergebnis (node_)
        if (name.startsWith("node_")) {
            // Nur hinzufügen, wenn der Typ grundsätzlich auf den Slot passt
            if (!((symbolType.flags & ts.TypeFlags.Void) !== 0) && checker.isTypeAssignableTo(symbolType, expectedType)) {
                const nodeFunctionId = name
                    .replace("node_", "")
                    .replace(/___/g, "://")
                    .replace(/__/g, "/")
                    .replace(/_/g, "/");

                referenceValues.push({
                    __typename: 'ReferenceValue',
                    nodeFunctionId: nodeFunctionId as any
                    // Bei node_ keine Indizes laut Vorgabe
                });
            }
        }

        // FALL 2: Parameter / Input (p_)
        else if (name.startsWith("p_")) {
            const idPart = name.replace("p_", "");
            const lastUnderscoreIndex = idPart.lastIndexOf("_");
            const rawId = idPart.substring(0, lastUnderscoreIndex);
            const paramIndexFromName = parseInt(idPart.substring(lastUnderscoreIndex + 1), 10);

            const nodeFunctionId = rawId
                .replace("p_", "")
                .replace(/___/g, "://")
                .replace(/__/g, "/")
                .replace(/_/g, "/");

            // Da p_ oft ein Rest-Parameter (...p) ist, prüfen wir auf Array/Tupel
            if (checker.isTupleType(symbolType)) {
                // Bei einem Tupel (z.B. [item, index]) extrahieren wir die Element-Typen
                const typeReference = symbolType as ts.TypeReference;
                const typeArguments = checker.getTypeArguments(typeReference);

                typeArguments.forEach((tupleElementType, tupleIndex) => {
                    if (checker.isTypeAssignableTo(tupleElementType, expectedType)) {
                        referenceValues.push({
                            __typename: 'ReferenceValue',
                            nodeFunctionId: nodeFunctionId as any,
                            parameterIndex: isNaN(paramIndexFromName) ? 0 : paramIndexFromName,
                            inputIndex: tupleIndex,
                            //@ts-ignore
                            inputTypeIdentifier: (typeReference.target as any).labeledElementDeclarations?.[tupleIndex].name.getText()
                        });
                    }
                });
            }
        }
    });

    return referenceValues;
}
