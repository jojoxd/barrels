import {Logger as TsedLogger} from "@tsed/logger";
import isUnicodeSupported from "is-unicode-supported";
import { inspect } from "util";

class Logger extends TsedLogger
{
    public inspect(message: string, object: unknown): void
    {
        this.debug(
            `${message}\n`,
            inspect(
                object,
                {
                    depth: null,
                    colors: true,
                    getters: true,
                    showHidden: true,
                },
            ),
        );
    }
}

const logger: Logger = new Logger("Barrels");

let logFormat = 'Barrels %[%p%] %m%n';

// @TODO: Figure out if this is supported everywhere
if (isUnicodeSupported()) {
    process.stdout.setEncoding('utf-8');
    logFormat = `\u{1F6E2} ${logFormat}`;
}

logger.appenders
    .set("stdout", {
        type: "stdout",
        levels: ["trace", "debug", "info"],
        layout: {
            type: "pattern",
            pattern: logFormat,
        }
    })
    .set("stderr", {
        type: "stderr",
        levels: ["fatal", "error", "warn"],
        layout: {
            type: "pattern",
            pattern: logFormat,
        }
    })
;

if (process.env['BARRELS_LOG_JSON']) {
    logger.appenders
        .set("stdout", {
            type: "stdout",
            levels: ["debug", "info", "trace"],
            layout: {
                type: "json",
            },
        })
        .set("stderr", {
            type: "stderr",
            levels: ["fatal", "error", "warn"],
            layout: {
                type: "json",
            },
        })
    ;
}

logger.level = process.env.BARRELS_LOG_LEVEL ?? 'info';

export default logger;
