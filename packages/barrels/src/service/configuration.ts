import { readFile } from "fs/promises";
import { ConfigurationValidator } from "./configuration.validator.js";
import type { ConcreteConfiguration , ConfigurationInterface} from "../model/configuration.interface.js";
import { BarrelContext } from "../model/barrel-context.js";
import type { Location } from "../enum/location.enum.js";
import type { Target } from "../enum/target.enum.js";
import type { Match } from "../util/types.js";
import { Defaults } from "../util/defaults.js";
import { PackageJson, type PackageJsonSpec } from "../util/package-json.js";

export class Configuration implements ConcreteConfiguration
{
    constructor(
        protected readonly data: ConfigurationInterface,
        protected readonly packageJson: PackageJsonSpec,
    ) {}

    public get cwd(): string
    {
        return this.data.cwd ?? process.cwd();
    }

    public get dryRun(): boolean
    {
        return this.data.dryRun ?? Defaults.DRY_RUN;
    }

    public get location(): Location
    {
        return this.data.location ?? Defaults.LOCATION;
    }

    public get target(): Target
    {
        return this.data.target ?? Defaults.TARGET;
    }

    public get emitAssertions(): boolean | undefined
    {
        return this.data.emitAssertions ?? Defaults.EMIT_ASSERTIONS;
    }

    public get emitExtensions(): boolean
    {
        return this.data.emitExtensions ?? Defaults.EMIT_EXTENSIONS;
    }

    public get exclude(): Match[]
    {
        return this.data.exclude ?? [];
    }

    public get extensions(): string[]
    {
        return this.data.extensions ?? Defaults.getDefaultExtensions(this);
    }

    public get header(): string
    {
        return this.data.header ?? Defaults.HEADER;
    }

    public get include(): Match[]
    {
        return this.data.include ?? [];
    }

    public get isModule(): boolean
    {
        // @TODO: Huh, this should only check package.json>type === 'module'?
        return PackageJson.hasTypescript(this.packageJson, this.cwd);
    }

    public get abortSignal(): AbortSignal | null
    {
        return this.data.abortSignal ?? null;
    }

    public *getBarrelContexts(): Generator<BarrelContext>
    {
        for(const barrel of this.data.barrels) {
            yield new BarrelContext(barrel, this);
        }
    }

    public static async loadFile(file: string): Promise<Configuration>
    {
        const json = await readFile(file);

        return this.load(JSON.parse(json.toString('utf-8')));
    }

    public static async load(data: unknown): Promise<Configuration>
    {
        const validator = new ConfigurationValidator();

        if(validator.validate(data)) {
            const packageJson = await PackageJson.getPackageJson(data.cwd ?? process.cwd());

            return new Configuration(data, packageJson);
        }
    }
}
