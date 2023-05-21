// Somehow, node's runtime requires us to use this import-kind
import typescript, { type SourceFile, type Printer, type Node, type NodeArray } from 'typescript';
const { factory: ast, createPrinter, createSourceFile, ListFormat, NewLineKind, ScriptKind, ScriptTarget } = typescript;

import {BarrelContext} from "../model/barrel-context.js";

export { ast, type Node };

export class AstTransformer
{
    protected sourceFile: SourceFile = createSourceFile(
        'index.ts',
        '',
        ScriptTarget.Latest,
        false,
        ScriptKind.External
    );

    private printer: Printer;

    constructor(
        protected context: BarrelContext
    ) {
        // @TODO: Make these options configurable
        this.printer = createPrinter({
            newLine: NewLineKind.LineFeed,
            omitTrailingSemicolon: true,
        });
    }

    public async transform(nodeArray: NodeArray<Node>): Promise<string>
    {
        return this.printer.printList(
            ListFormat.MultiLineBlockStatements,
            nodeArray,
            this.sourceFile,
        );
    }
}