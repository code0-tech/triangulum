// Utility functions for node validation
import {
    DataType,
    Flow,
    FunctionDefinition,
    NodeFunction,
    SubFlowValue,
    NodeParameter,
    ReferenceValue, Maybe
} from "@code0-tech/sagittarius-graphql-types";
import ts from "typescript";
import {createSystem, createVirtualTypeScriptEnvironment, VirtualTypeScriptEnvironment} from "@typescript/vfs"
import {stringify} from "lossless-json";

/**
 * Result of a node or flow validation.
 */
export interface ValidationResult {
    isValid: boolean;
    returnType: string;
    diagnostics: Array<{
        message: string
        code: number
        severity: "error" | "warning"
        nodeId?: NodeFunction["id"]
        parameterIndex?: number | null
    }>;
}

/**
 * Minimal TypeScript library definitions for the virtual compiler environment.
 */
export const MINIMAL_LIB = `
    interface Array<T> { 
        [n: number]: T; 
        length: number; 
    }
    interface String { readonly length: number; }
    interface Number { }
    interface Boolean { }
    interface Object { }
    interface Function { }
    interface CallableFunction extends Function {}
    interface NewableFunction extends Function {}
    interface IArguments { }
    interface RegExp { }
  
    declare namespace Utils {
        type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
    }

    import ReturnType = Utils.ReturnType;
`;

/**
 * Common configuration for the TypeScript compiler host across different validation/inference tasks.
 */
export function createCompilerHost(
    fileName: string,
    sourceCode: string
): VirtualTypeScriptEnvironment {

    const fsMap = new Map<string, string>()
    fsMap.set(fileName, sourceCode)
    fsMap.set("lib.codezero.d.ts", MINIMAL_LIB)

    const system = createSystem(fsMap)
    return createVirtualTypeScriptEnvironment(system, [fileName, "lib.codezero.d.ts"], ts, DEFAULT_COMPILER_OPTIONS)
}

/**
 * Common TypeScript compiler options used for validation and type inference.
 */
export const DEFAULT_COMPILER_OPTIONS: ts.CompilerOptions = {
    target: ts.ScriptTarget.Latest,
    lib: ["lib.codezero.d.ts"],
    noEmit: true,
    strictNullChecks: true,
};

/**
 * Extracts and returns common type and generic declarations from DATA_TYPES.
 */
export function getSharedTypeDeclarations(dataTypes?: DataType[], genericType: string = "any", useGenericDeclarations: boolean = true): string {
    const genericDeclarations = Array.from(new Set(dataTypes?.flatMap(dt => dt.genericKeys || [])))
        .map(g => `type ${g} = ${genericType};`)
        .join("\n");

    const typeAliasDeclarations = dataTypes?.map(dt =>
        `type ${dt.identifier}${(dt.genericKeys?.length ?? 0) > 0 ? `<${dt.genericKeys?.join(",")}>` : ""} = ${dt.type};`
    ).join("\n");

    // Pre-instantiate every generic type with `any` for each type parameter.
    // These are used by widenForSuggestions to produce the widened type for
    // suggestion-scope checks when a parameter type has free TypeParameters.
    const widenedDeclarations = dataTypes
        ?.filter(dt => (dt.genericKeys?.length ?? 0) > 0)
        .map(dt => `declare const __widen_${dt.identifier}: ${dt.identifier}<${dt.genericKeys!.map(() => "any").join(", ")}>;`)
        .join("\n") ?? "";

    return `${useGenericDeclarations ? genericDeclarations : ""}\n${typeAliasDeclarations}\n${widenedDeclarations}`;
}

/**
 * Sanitizes an ID for use as a TypeScript variable name.
 */
export const sanitizeId = (id: string) => id?.replace(/[^a-zA-Z0-9]/g, '_');

/**
 * Generates TypeScript source code for a flow, suitable for validation and type inference.
 */
export function generateFlowSourceCode(
    flow?: Flow,
    functions?: FunctionDefinition[],
    dataTypes?: DataType[],
    isForInference: boolean = false
): string {
    const nodes = flow?.nodes?.nodes || [];
    const funcMap = new Map(functions?.map(f => [f.identifier, f]));
    const visited = new Set<NodeFunction['id']>();

    const generateNodeCode = (id: NodeFunction['id'] | FunctionDefinition['identifier'], indent: string = ""): string => {
        const node = nodes.find(n => n?.id === id);
        if (!node || !node.functionDefinition) return "";
        if (id?.includes("NodeFunction")) visited.add(id as NodeFunction['id']);

        const funcDef = funcMap.get(node.functionDefinition.identifier);
        if (!funcDef) return `${indent}// Error: Function ${node.functionDefinition.identifier} not found\n`;

        const params = (node.parameters?.nodes as NodeParameter[]) || [];
        const args = params.map((p, index) => {
            const val = p.value;
            if (!val) return isForInference ? `/* @pos ${id} ${index} */ {}` : `/* @pos ${id} ${index} */ undefined`;
            if (val.__typename === "ReferenceValue") {
                const ref = val as ReferenceValue;
                let refCode = typeof ref.inputIndex === "number"
                    ? `p_${sanitizeId(ref.nodeFunctionId ?? "undefined")}_${ref.parameterIndex}[${ref.inputIndex}]`
                    : ref.nodeFunctionId ? `node_${sanitizeId(ref.nodeFunctionId)}` : `flow_${sanitizeId(flow?.id ?? "undefined")}`;
                ref.referencePath?.forEach(pathObj => {
                    refCode += `?.${pathObj.path}`;
                });
                return `/* @pos ${id} ${index} */ ${refCode}`;
            }
            if (val.__typename === "LiteralValue") {
                const jsonString = val?.value !== null && val?.value !== undefined ? stringify(val?.value) : undefined
                return `/* @pos ${id} ${index} */ ${jsonString}`;
            }
            if (val.__typename === "SubFlowValue") {
                const wrapper = val as SubFlowValue;
                const lambdaArgName = `p_${sanitizeId(id as string)}_${index}`;
                const subTreeCode = generateNodeCode(wrapper.startingNodeId || wrapper.functionDefinition?.id!, indent + "    ");
                return `/* @pos ${id} ${index} */ (...${lambdaArgName}) => {\n${subTreeCode}${indent}}`;
            }
            return isForInference ? `/* @pos ${id} ${index} */ {}` : `/* @pos ${id} ${index} */ undefined`;
        });

        const varName = `node_${sanitizeId(node.id!)}`;
        const funcName = `fn_${node?.functionDefinition?.identifier?.replace(/::/g, '_')}`;
        const needsAnyCast = args.includes("undefined");



        let code = `${indent}`;

        if (node.functionDefinition.identifier === "std::control::return") {
            code += `const ${varName} = /* @pos ${id} null */ ${funcName}(${args.join(", ")})${needsAnyCast ? "" : ""} ;\n`
            code += `return ${varName};\n`
        } else if (node.functionDefinition.identifier === "std::control::if") {
            code += `const ${varName} = /* @pos ${id} null */ ${funcName}(${args.join(", ")})${needsAnyCast ? "" : ""} ;\n`
            code += `if(${args[0]}) {
                ${generateNodeCode(((node.parameters?.nodes?.[1]?.value as SubFlowValue)?.startingNodeId || (node.parameters?.nodes?.[1]?.value as SubFlowValue)?.functionDefinition?.identifier), indent + "    ")}
            }`
        } else if (node.functionDefinition.identifier === "std::control::if_else") {
            code += `const ${varName} = /* @pos ${id} null */ ${funcName}(${args.join(", ")})${needsAnyCast ? "" : ""} ;\n`
            code += `if(${args[0]}) {
                ${generateNodeCode(((node.parameters?.nodes?.[1]?.value as SubFlowValue)?.startingNodeId || (node.parameters?.nodes?.[1]?.value as SubFlowValue)?.functionDefinition?.identifier), indent + "    ")}
            } else {
                ${generateNodeCode(((node.parameters?.nodes?.[2]?.value as SubFlowValue)?.startingNodeId || (node.parameters?.nodes?.[2]?.value as SubFlowValue)?.functionDefinition?.identifier), indent + "    ")}
            }`
        } else {
            code += `const ${varName} = /* @pos ${id} null */ ${funcName}(${args.join(", ")})${needsAnyCast ? "" : ""} ;\n`
        }

        if (node.nextNodeId) code += generateNodeCode(node.nextNodeId, indent);
        return code;
    };

    const typeDefs = getSharedTypeDeclarations(dataTypes);
    const flowTypeDeclaration = `declare function flow${flow?.signature ?? "(): void"}`
    const funcDeclarations = functions?.map(f => `declare function fn_${f.identifier?.replace(/::/g, '_')}${f.signature}`).join('\n');

    const nextNodeIds = new Set(nodes.map(n => n?.nextNodeId).filter(id => !!id));
    const subTreeIds = new Set<NodeFunction['id'] | FunctionDefinition['id']>();
    nodes.forEach(n => n?.parameters?.nodes?.forEach((p: Maybe<NodeParameter>) => {
        if (p?.value?.__typename === "SubFlowValue" && (p.value.startingNodeId || p.value.functionDefinition?.id)) subTreeIds.add(p.value.startingNodeId || p.value.functionDefinition?.id);
    }));

    const flowCode = flow ? `const flow_${sanitizeId(flow.id ?? "")} = /* @pos null null */ flow(${flow.settings?.nodes?.map((setting, index) => `/* @pos null ${index} */ ${setting?.value !== null && setting?.value !== undefined ? stringify(setting?.value) : undefined}`).join(", ") ?? ""});` : ""

    const executionCode = nodes
        .filter(n => n?.id && !nextNodeIds.has(n.id) && !subTreeIds.has(n.id))
        .map(n => generateNodeCode(n!.id!))
        .join('\n');

    return `
        ${typeDefs}\n
        ${flowTypeDeclaration}\n
        ${funcDeclarations}\n
        (() =>
            ${flowCode}
            ${executionCode}
        )();
    `;
}
