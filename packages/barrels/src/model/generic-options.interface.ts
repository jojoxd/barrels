import type {Match} from "../util/types.js";

export interface GenericOptions
{
    readonly include?: Match[];
    readonly exclude?: Match[];
    readonly extensions?: string[];
    readonly emitExtensions?: boolean;
    readonly emitAssertions?: boolean;
    readonly header?: string;
}
