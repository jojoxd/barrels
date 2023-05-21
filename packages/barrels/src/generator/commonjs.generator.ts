import {GeneratorContract} from "./generator.contract.js";
import {BarrelContext} from "../model/barrel-context.js";
import {Target} from "../enum/target.enum.js";

export class CommonJSGenerator implements GeneratorContract
{
    public supports(context: BarrelContext): boolean
    {
        return [
            Target.CommonJS,
        ].includes(context.configuration.target);
    }

    public async createExportStatement(context: BarrelContext): Promise<string>
    {
        throw new Error("Generating CommonJS is not supported yet");
    }
}