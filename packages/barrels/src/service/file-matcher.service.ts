import {BarrelContext} from "../model/barrel-context.js";
import {glob} from "glob";
import logger from "../util/logger.js";

export class FileMatcher
{
    async match(context: BarrelContext)
    {
        const files = await glob(context.directory, {
            cwd: context.configuration.cwd,
            nodir: true,
        });

        logger.trace('matched files', { files });
    }
}