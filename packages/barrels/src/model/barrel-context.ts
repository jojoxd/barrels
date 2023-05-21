import type { Configuration } from "../service/configuration.js";
import type { Match } from "../util/types.js";
import type { BarrelConfiguration, ConcreteBarrelConfiguration } from "./barrel-configuration.interface.js";

export class BarrelContext implements ConcreteBarrelConfiguration
{
    public constructor(
        protected readonly barrel: BarrelConfiguration,
        public readonly configuration: Configuration,
    ) {}

    public get directory(): Match
    {
        return this.barrel.directory;
    }

    public get emitAssertions(): boolean
    {
        return this.barrel.emitAssertions ?? this.configuration.emitAssertions;
    }

    public get emitExtensions(): boolean
    {
        return this.barrel.emitExtensions ?? this.configuration.emitExtensions;
    }

    public get exclude(): Match[] | null
    {
        return this.barrel.exclude ?? this.configuration.exclude;
    }

    public get extensions(): string[]
    {
        return this.barrel.extensions ?? this.configuration.extensions;
    }

    public get header(): string
    {
        return this.barrel.header ?? this.configuration.header;
    }

    public get include(): Match[]
    {
        return this.barrel.include ?? this.configuration.include;
    }



}