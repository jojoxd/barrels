import type { Location } from "../enum/location.enum.js";
import type { GenericOptions } from "./generic-options.interface.js";
import type { Target } from "../enum/target.enum.js";
import type { BarrelConfiguration } from "./barrel-configuration.interface.js";

export interface ConfigurationInterface extends GenericOptions
{
    readonly barrels: BarrelConfiguration[];

    readonly cwd?: string;

    readonly dryRun?: boolean;

    readonly location?: Location;

    readonly target?: Target;

    /**
     * @api-only
     */
    readonly abortSignal?: AbortSignal;
}

export type ConcreteConfiguration = Omit<Required<ConfigurationInterface>, 'barrels'>;
