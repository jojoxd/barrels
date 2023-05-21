import { Barrels, type ConfigurationInterface } from "../../src/index.js";

export async function createBarrelsConfiguration(config: ConfigurationInterface)
{
    // @ts-expect-error Using internal function
    const configuration = await (new Barrels().loadConfiguration(config));

    return {
        configuration,

        context: Array.from(configuration.getBarrelContexts())?.[0] ?? null,
    }
}