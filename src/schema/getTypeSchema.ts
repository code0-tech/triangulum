import {DataType} from "@code0-tech/sagittarius-graphql-types"
import ts from "typescript"
import {getSchema, Schema} from "../util/schema.util"
import {createCompilerHost, getSharedTypeDeclarations} from "../utils"

/**
 * Generates a schema for a given TypeScript type string.
 *
 * This function creates a virtual TypeScript environment, parses the provided type string
 * (along with any provided data type definitions), and extracts the schema for the last
 * type-related statement (TypeAlias, Interface, or Class) found in the string.
 *
 * @param typeString - The TypeScript code containing the type definition (e.g., "type MyType = { a: string }").
 * @param dataTypes - An optional array of additional data type definitions to be included in the environment.
 * @returns The generated Schema for the identified type, or undefined if no valid type was found or an error occurred.
 */
export const getTypeSchema = (
    typeString: string,
    dataTypes: DataType[] = [],
): Schema | undefined => {
    const fileName = "index.ts"
    const typeDefs = getSharedTypeDeclarations(dataTypes)
    const sourceCode = `${typeDefs}\n${typeString}`

    const host = createCompilerHost(fileName, sourceCode)
    const program = host.languageService.getProgram()
    const sourceFile = program?.getSourceFile(fileName)
    const checker = program?.getTypeChecker()

    if (!sourceFile || !checker) return undefined

    const targetStatement = sourceFile.statements
        .filter((stmt): stmt is ts.TypeAliasDeclaration | ts.InterfaceDeclaration | ts.ClassDeclaration =>
            ts.isTypeAliasDeclaration(stmt) || ts.isInterfaceDeclaration(stmt) || ts.isClassDeclaration(stmt)
        ).pop()
    if (!targetStatement) return undefined

    const targetType = checker.getTypeAtLocation(targetStatement)
    if (!targetType) return undefined

    return getSchema(checker, undefined, targetType, [], [], false)
}
