import type { GenerateResponse } from "../response/generate.response.js";
import type { GenerateOptions } from "../type/generate-options.type.js";
import type { BarrelContext } from "../model/barrel-context.js";
import { Configuration } from "./configuration.js";
import logger from "../util/logger.js";
import {GeneratorContract} from "../generator/generator.contract.js";
import {ModuleGenerator} from "../generator/module.generator.js";
import {CommonJSGenerator} from "../generator/commonjs.generator.js";
import {FileMatcher} from "./file-matcher.service.js";

type BarrelGenerateResponse = string;

export class Barrels
{
    protected generators: Array<GeneratorContract> = [];
    protected fileMatcher = new FileMatcher();

    constructor() {
        this.addGenerator(new ModuleGenerator());
        this.addGenerator(new CommonJSGenerator());
    }

    public async generate(generateOptions: GenerateOptions): Promise<GenerateResponse>
    {
        return new Promise<GenerateResponse>(async (resolve, reject) => {
            generateOptions.abortSignal?.addEventListener('abort', (event) => {
                reject(new Error(event.type));
            });

            // Do actual generation

            let response: GenerateResponse = null;
            try {
                const configuration = await this.loadConfiguration(generateOptions);

                response = await this.generateBarrels(configuration);
            } catch(e) {
                if (!generateOptions.abortSignal?.aborted) {
                    reject(e);
                }
            }

            if (!generateOptions.abortSignal?.aborted) {
                resolve(response);
            }
        });
    }

    public addGenerator(generator: GeneratorContract): void
    {
        this.generators.push(generator);
    }

    protected async generateBarrels(configuration: Configuration): Promise<GenerateResponse>
    {
        const barrelResponses: BarrelGenerateResponse[] = [];

        for (const context of configuration.getBarrelContexts()) {
            const response = await this.generateBarrel(context);

            barrelResponses.push(response);
        }

        // @TODO: Compile into single response
        return {
            barrels: [...barrelResponses],
        };
    }

    protected async generateBarrel(barrelContext: BarrelContext): Promise<BarrelGenerateResponse>
    {
        logger.inspect('Generating barrel with context', barrelContext);

        const files = await this.fileMatcher.match(barrelContext);


        return `${barrelContext.directory}/index`;
    }

    protected async loadConfiguration(generateOptions: GenerateOptions): Promise<Configuration>
    {
        if (generateOptions instanceof Configuration) {
            return generateOptions;
        }

        return Configuration.load(generateOptions);
    }
}