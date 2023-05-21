import type {Match, NullableOptional} from "../util/types.js";
import type {GenericOptions} from "./generic-options.interface.js";

export interface BarrelConfiguration extends GenericOptions
{
    readonly directory: Match,
}

type RequiredProps = 'directory';
export type ConcreteBarrelConfiguration =
    Required<Pick<BarrelConfiguration, RequiredProps>>
    & NullableOptional<Omit<BarrelConfiguration, RequiredProps>>