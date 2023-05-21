import {Command} from "@commander-js/extra-typings";

export type ExtractArgs<T> = T extends Command<unknown[], infer TArgs> ? TArgs : never;
