import {GeneratorContract} from "./generator.contract.js";
import {BarrelContext} from "../model/barrel-context.js";
import {ast, AstTransformer} from "../service/ast-transformer.js";
import {Target} from "../enum/target.enum.js";
import {AssertClauseFactory} from "./ast-factory/assert-clause.factory.js";

export class ModuleGenerator implements GeneratorContract
{
    public supports(context: BarrelContext): boolean
    {
        return [
            Target.Module,
            Target.Typescript,
            Target.TypescriptTypes,
        ].includes(context.configuration.target);
    }

    public async createExportStatement(context: BarrelContext): Promise<string>
    {
        const file = 'todo.ts';

        // @TODO: Generate ast

        const moduleSpecifier = ast.createStringLiteral(file);

        const assertClause = context.emitAssertions ? AssertClauseFactory.createAssertClause(file, context) : undefined;

        const exportDeclaration = ast.createExportDeclaration(
            undefined,
            context.configuration.target === Target.TypescriptTypes,
            undefined,
            moduleSpecifier,
            assertClause,
        );

        const nodeArray = ast.createNodeArray([exportDeclaration]);

        const transformer = new AstTransformer(context);
        return transformer.transform(nodeArray);
    }
}
