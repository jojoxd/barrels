import {BarrelContext} from "../model/barrel-context.js";

export class HeaderBuilder
{
    public static buildHeader(context: BarrelContext): string
    {
        const headerLines = context.header.split(/\r?\n/g);

        // @TODO: Add line endings to configuration, see also ast-transformer
        return `/**\n * ${headerLines.join('\n * ')}\n */\n`;
    }
}
