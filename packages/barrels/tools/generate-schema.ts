// @TODO: Generate base.schema.json
// @TODO: Generate configuration.schema.json

import {Extractor, ExtractorConfig} from "@microsoft/api-extractor";
import {ApiInterface, ApiModel} from "@microsoft/api-extractor-model";
import {join as joinPath} from "path";
import {URL} from "url";
import {getSchema} from "./generate-schema/get-schema.fn.js";
import {inspect} from "util";
import {Defaults} from "../src/util/defaults.js";
import { Location } from "../src/enum/location.enum.js";
import { Target } from "../src/enum/target.enum.js";
import {writeFile} from "fs/promises";

const projectRoot = new URL('../', import.meta.url).pathname;

const extractorConfig = ExtractorConfig.loadFileAndPrepare(joinPath(projectRoot, 'api-extractor.jsonc'));

const result = Extractor.invoke(extractorConfig, {
    localBuild: true,
});

const apiModel = new ApiModel();
apiModel.loadPackage(result.extractorConfig.apiJsonFilePath);

const entrypoint = apiModel.tryGetPackageByName('@jojoxd/barrels').entryPoints[0]

const configurationInterface = entrypoint.tryGetMemberByKey(ApiInterface.getContainerKey('Configuration')) as ApiInterface;
const configurationSchema = getSchema(configurationInterface, 'configuration');

const genericOptionsInterface = entrypoint.tryGetMemberByKey(ApiInterface.getContainerKey('GenericOptions')) as ApiInterface;
const genericOptionsSchema = getSchema(genericOptionsInterface, 'generic-options');

const barrelConfigurationInterface = entrypoint.tryGetMemberByKey(ApiInterface.getContainerKey('BarrelConfiguration')) as ApiInterface;
const barrelConfigurationSchema = getSchema(barrelConfigurationInterface, 'barrel-options');

const fullBaseSchema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://jojoxd.nl/schema/barrels/{version}/configuration-base.json',
    title: "@jojoxd/barrels Base Schema",

    type: 'object',

    properties: {
        ...configurationSchema.properties,
        ...genericOptionsSchema.properties,
    },

    required: ['barrels'],

    $defs: {
        ...configurationSchema.$defs,
        ...genericOptionsSchema.$defs,
        ...barrelConfigurationSchema.$defs,

        'barrel-configuration': {
            type: 'object',
            $id: barrelConfigurationSchema.$id,

            properties: {
                ...barrelConfigurationSchema.properties,
                ...genericOptionsSchema.properties,
            },

            required: ['directory'],
        },

        match: {
            type: 'string'
        },

        location: {
            type: 'string',
            enum: Object.values(Location),
            default: Defaults.LOCATION,
        },

        target: {
            type: 'string',
            enum: Object.values(Target),
            default: Defaults.TARGET,
        }
    }
};

const fullConfigurationSchema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://jojoxd.nl/schema/barrels/{version}/configuration',

    oneOf: [
        {
           $ref: './configuration-base.json'
        },
        {
            type: 'object',
            properties: {
                configurations: {
                    type: "array",
                    minItems: 1,
                    items: {
                        $ref: './configuration-base.json',
                    },
                },
            },

            additionalProperties: false,
            required: ['configurations'],
        }
    ],
};

console.log(inspect({ fullBaseSchema, fullConfigurationSchema }, { depth: null, colors: true, }));

async function writeJson(path: string, object: object)
{
    await writeFile(
        path,
        JSON.stringify(object, null, 4),
        'utf-8'
    );
}

await writeJson(joinPath(projectRoot, 'tools/configuration-base.json'), fullBaseSchema);
await writeJson(joinPath(projectRoot, 'tools/configuration.json'), fullConfigurationSchema);
