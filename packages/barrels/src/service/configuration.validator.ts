import type { ConfigurationInterface } from "../model/configuration.interface.js";
import Ajv2020, {ValidateFunction} from "ajv/dist/2020.js";
import { readFileSync } from "fs";
import { URL } from "url";
import { inspect } from "util";
import logger from "../util/logger.js";
export class ConfigurationValidator
{
    // @ts-expect-error TODO: Check this typing error
    protected static ajv = new Ajv2020();

    protected static isValid: ValidateFunction<ConfigurationInterface>;

    static {
        const buffer = readFileSync(new URL('../../base.schema.json', import.meta.url));
        const schema = JSON.parse(buffer.toString('utf-8'));

        this.isValid = this.ajv.compile<ConfigurationInterface>(schema);
    }

    public validate(data: unknown): data is ConfigurationInterface
    {
        if (ConfigurationValidator.isValid(data)) {
            return true;
        }

        logger.trace(
            'configuration validation errors\n',
            inspect(
                { data, errors: ConfigurationValidator.isValid.errors, },
                { depth: null, colors: true, }
            ),
        );

        throw new Error(ConfigurationValidator.ajv.errorsText(ConfigurationValidator.isValid.errors));
    }
}
