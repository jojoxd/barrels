import { Target } from "../enum/target.enum.js";
import { Location } from "../enum/location.enum.js";
import { Configuration } from "../service/configuration.js";

export class Defaults
{
    private constructor() {}

    public static readonly DRY_RUN = false;

    public static readonly EMIT_ASSERTIONS = true;

    public static readonly EMIT_EXTENSIONS = false;

    public static readonly HEADER = '@generated by @jojoxd/barrels';

    public static readonly TARGET = Target.Module;

    public static readonly LOCATION = Location.Top;

    public static getDefaultExtensions({ target, isModule }: Configuration): string[]
    {
        switch (target) {
            case Target.Typescript:
                return ['.ts'];

            case Target.CommonJS:
                return ['.cjs', '.js']

            // When "type": "module" is specified, allow Module target to import .js files
            case Target.Module:
                return isModule
                    ? ['.mjs', '.js']
                    : ['.mjs'];
        }

        throw new Error(`Unsupported target. Expecting one of ${Object.values(Target).join(', ')}, got "${target}"`);
    }
}