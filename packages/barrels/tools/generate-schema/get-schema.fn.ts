import { ApiInterface, ApiPropertySignature } from "@microsoft/api-extractor-model";
import { paramCase } from "change-case";
import type { Schema } from "./schema.interface.js";
import {getType, isArray} from "./get-type.fn.js";

const builtinTypes = ['string', 'boolean', 'number'];

export function getSchema(apiInterface: ApiInterface, $id: string): Schema {
    const $defs = {};
    const properties = {};

    for (const item of apiInterface.members) {
        if (item instanceof ApiPropertySignature) {
            if (item.tsdocComment?.emitAsTsdoc().indexOf('@api-only') >= 0) {
                continue;
            }

            const type = getType(item);
            const paramCaseType = paramCase(type);

            if (!builtinTypes.includes(paramCaseType)) {
                $defs[paramCaseType] = { todo: true };

                if (isArray(item)) {
                    properties[item.displayName] = {
                        type: 'array',
                        items: {
                            $ref: `#/$defs/${paramCaseType}`,
                        },
                    };
                } else {
                    properties[item.displayName] = {
                        $ref: `#/$defs/${paramCaseType}`
                    };
                }
            } else {
                properties[item.displayName] = {
                    type: paramCaseType,
                    // @TODO
                }
            }
        }
    }

    return { type: "object", $id, properties, $defs };
}