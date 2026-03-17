import {flattenDiagnosticMessageText} from "typescript";
import {
    DataType,
    Flow,
    FunctionDefinition,
    NodeFunction,
    NodeFunctionIdWrapper,
    NodeParameter,
    ReferenceValue
} from "@code0-tech/sagittarius-graphql-types";
import {createCompilerHost, getSharedTypeDeclarations, ValidationResult} from "../utils";

const sanitizeId = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '_');

/**
 * Validates a flow by generating virtual TypeScript code and running it through the TS compiler.
 */
export const getFlowValidation = (
    flow?: Flow,
    functions?: FunctionDefinition[],
    dataTypes?: DataType[]
): ValidationResult => {
    const visited = new Set<string>();
    const nodes = flow?.nodes?.nodes || [];

    const funcMap = new Map(functions?.map(f => [f.identifier, f]));

    /**
     * Recursive function to generate TypeScript code for a node and its execution path.
     */
    const generateNodeCode = (
        nodeId: string,
        indent: string = ""
    ): string => {
        if (visited.has(nodeId)) return "";

        const node = nodes.find(n => n?.id === nodeId);
        if (!node || !node.functionDefinition) return "";

        visited.add(nodeId);

        const funcDef = funcMap.get(node.functionDefinition?.identifier);
        if (!funcDef) return `${indent}// Error: Function ${node.functionDefinition.identifier} not found\n`;

        const params = node.parameters?.nodes as NodeParameter[] || [];

        const args = params.map((p, index) => {
            const val = p.value;
            if (!val) return "undefined";

            if (val.__typename === "ReferenceValue") {
                const ref = val as ReferenceValue;
                if (!ref.nodeFunctionId) return "undefined";

                let refCode = ref.parameterIndex !== undefined
                    ? `p_${sanitizeId(ref.nodeFunctionId)}_${ref.parameterIndex}`
                    : `node_${sanitizeId(ref.nodeFunctionId)}`;

                ref.referencePath?.forEach(pathObj => {
                    refCode += `?.${pathObj.path}`;
                });

                return `/* @pos ${nodeId} ${index} */ ${refCode}`;
            }

            if (val.__typename === "LiteralValue") {
                return `/* @pos ${nodeId} ${index} */ ${JSON.stringify(val.value)}`;
            }

            if (val.__typename === "NodeFunctionIdWrapper") {
                const wrapper = val as NodeFunctionIdWrapper;
                const lambdaArgName = `p_${sanitizeId(nodeId)}_${index}`;
                const subTreeCode = generateNodeCode(wrapper.id!, indent + "    ");
                return `/* @pos ${nodeId} ${index} */ (${lambdaArgName}) => {\n${subTreeCode}${indent}}`;
            }

            return "undefined";
        }).join(", ");

        const varName = `node_${sanitizeId(node.id!)}`;
        const funcName = `fn_${node?.functionDefinition?.identifier?.replace(/::/g, '_')}`;

        // Add 'as any' cast only if undefined arguments are passed to a generic function to avoid false-positive errors.
        const needsAnyCast = args.includes("undefined");
        const isReturnNode = node.functionDefinition.identifier === "std::control::return";
        let code = `${indent}${isReturnNode ? "return " : `var ${varName} = `}${funcName}(${args})${needsAnyCast ? " as any" : ""} ;\n`;

        if (node.nextNodeId) {
            code += generateNodeCode(node.nextNodeId, indent);
        }

        return code;
    };

    // 1. Generate Declarations
    const typeDefs = getSharedTypeDeclarations(dataTypes);

    const funcDeclarations = functions?.map(funcDef => {
        return `declare function fn_${funcDef.identifier?.replace(/::/g, '_')}${funcDef.signature}`;
    }).join('\n');

    const nextNodeIds = new Set(nodes.map(n => n?.nextNodeId).filter(id => !!id));
    const subTreeIds = new Set<string>();
    nodes.forEach(n => {
        n?.parameters?.nodes?.forEach((p: any) => {
            if (p?.value?.__typename === "NodeFunctionIdWrapper" && p.value.id) {
                subTreeIds.add(p.value.id);
            }
        });
    });

    const executionCode = nodes
        .filter(n => n?.id && !nextNodeIds.has(n.id) && !subTreeIds.has(n.id))
        .map(n => generateNodeCode(n!.id!))
        .join('\n');

    const sourceCode = `${typeDefs}\n${funcDeclarations}\n\n// --- Flow ---\n${executionCode}`;

    // 3. Virtual TypeScript Compilation
    const fileName = "index.ts";
    const host = createCompilerHost(fileName, sourceCode);
    const sourceFile = host.getSourceFile(fileName)!;

    const program = host.languageService.getProgram()!;
    const diagnostics = program.getSemanticDiagnostics(sourceFile);

    const errors = diagnostics.map(d => {
        const message = flattenDiagnosticMessageText(d.messageText, "\n");
        // "Argument of type 'undefined' is not assignable to parameter of type 'number'."
        // We ignore this in flow validation too because we might generate code for incomplete flows.

        let nodeId: NodeFunction['id'] | undefined;
        let parameterIndex: number | undefined;

        if (d.start !== undefined) {
            const fullText = sourceFile.getFullText();
            const textBefore = fullText.substring(0, d.start);
            const posMatch = textBefore.match(/\/\* @pos ([^ ]+) (\d+) \*\/\s*$/);
            if (posMatch) {
                nodeId = posMatch[1] as NodeFunction['id'];
                parameterIndex = parseInt(posMatch[2], 10);
            }
        }

        return {
            message,
            code: d.code,
            severity: "error" as const,
            nodeId,
            parameterIndex
        };
    }).filter((e) => e !== null);

    return {
        isValid: !errors.some(e => e?.severity === "error"),
        returnType: "void",
        diagnostics: errors,
    };
};