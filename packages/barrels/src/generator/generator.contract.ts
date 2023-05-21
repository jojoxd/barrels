import {BarrelContext} from "../model/barrel-context.js";

export interface GeneratorContract
{
    supports(context: BarrelContext): boolean;

    createExportStatement(context: BarrelContext): Promise<string>;
}
