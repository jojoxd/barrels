import {BarrelContext} from "../../model/barrel-context.js";
import {AssertClause} from "typescript";
import {ast} from "../../service/ast-transformer.js";

export class AssertClauseFactory
{
    private constructor() {}

    public static createAssertClause(file: string, context: BarrelContext): AssertClause
    {
        // @TODO: Make single-quote an option
        const assertKey = ast.createStringLiteral('type', false);

        // @TODO: fetch filetype somehow
        const assertValue = ast.createStringLiteral('json', false);

        return ast.createAssertClause(
            ast.createNodeArray([
                ast.createAssertEntry(assertKey, assertValue),
            ]),
            false,
        );
    }
}
